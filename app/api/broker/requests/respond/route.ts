import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

export async function POST(req: NextRequest) {
    try {
        const { requestId, action, brokerId } = await req.json();

        if (!requestId || !action || !brokerId) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        if (action !== "accept" && action !== "reject") {
            return NextResponse.json(
                { error: "Invalid action" },
                { status: 400 }
            );
        }

        const supabase = getSupabaseAdmin();

        // Verify the request belongs to this broker first (security check)
        // Although the update clause with eq('broker_id', brokerId) implicitly does this,
        // explicitly checking is good practice or just relying on the update count.

        const status = action === "accept" ? "accepted" : "rejected";

        const { data, error } = await supabase
            .from("agent_broker_requests")
            .update({
                status: status,
                responded_at: new Date().toISOString()
            })
            .eq("id", requestId)
            .eq("broker_id", brokerId)
            .select();

        if (error) {
            console.error("Error updating request:", error);
            return NextResponse.json(
                { error: "Failed to update request" },
                { status: 500 }
            );
        }

        if (!data || data.length === 0) {
            return NextResponse.json(
                { error: "Request not found or not authorized" },
                { status: 404 }
            );
        }

        // If accepted, update the agent's Cognito status to active so they can access the dashboard
        if (action === "accept") {
            try {
                const AWS = require("aws-sdk");
                const accessKeyId = process.env.APP_AWS_ACCESS_KEY_ID || process.env.AWS_ACCESS_KEY_ID;
                const secretAccessKey = process.env.APP_AWS_SECRET_ACCESS_KEY || process.env.AWS_SECRET_ACCESS_KEY;
                const region = process.env.APP_AWS_REGION || process.env.AWS_REGION || "ap-southeast-1";
                const userPoolId = process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID;

                if (accessKeyId && secretAccessKey) {
                    const cognito = new AWS.CognitoIdentityServiceProvider({
                        region,
                        credentials: new AWS.Credentials(accessKeyId, secretAccessKey),
                    });

                    // 1. Find the user's Cognito Username using their sub (agent_id)
                    const listUsersResponse = await cognito.listUsers({
                        UserPoolId: userPoolId,
                        Filter: `sub = "${data[0].agent_id}"`,
                        Limit: 1
                    }).promise();

                    if (listUsersResponse.Users && listUsersResponse.Users.length > 0) {
                        const cognitoUsername = listUsersResponse.Users[0].Username;

                        // 2. Update the custom:status attribute
                        await cognito.adminUpdateUserAttributes({
                            UserPoolId: userPoolId,
                            Username: cognitoUsername,
                            UserAttributes: [
                                {
                                    Name: "custom:status",
                                    Value: "active"
                                }
                            ]
                        }).promise();
                        console.log(`Updated agent ${data[0].agent_id} status to active`);
                    } else {
                        console.warn(`Could not find Cognito user for agent_id: ${data[0].agent_id}`);
                    }
                } else {
                    console.warn("Missing AWS Credentials - could not update Cognito status");
                }
            } catch (awsError) {
                console.error("Failed to update Cognito status:", awsError);
                // We don't fail the request since the DB update succeeded, but we log it
            }
        }

        return NextResponse.json({ success: true, request: data[0] });
    } catch (error) {
        console.error("Server error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
