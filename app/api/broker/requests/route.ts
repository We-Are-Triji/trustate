import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const brokerId = searchParams.get("brokerId");

        if (!brokerId) {
            return NextResponse.json(
                { error: "Broker ID is required" },
                { status: 400 }
            );
        }

        const supabase = getSupabaseAdmin();

        // Fetch pending requests for this broker
        const { data: requests, error } = await supabase
            .from("agent_broker_requests")
            .select("*")
            .eq("broker_id", brokerId)
        // .eq("status", "pending") // Fetch all statuses to categorize in frontend

        if (error) {
            console.error("Error fetching requests:", error);
            return NextResponse.json(
                { error: "Failed to fetch requests" },
                { status: 500 }
            );
        }

        // We might want to fetch agent details (name/email) from Cognito here 
        // since the table only has agent_id.
        // For now, let's return the IDs and let the frontend or a separate call handle user details?
        // Or we can enhance this route to fetch from Cognito.

        // Let's try to fetch agent details if we have any requests
        if (requests && requests.length > 0) {
            // ... (Optional: Fetch user details from Cognito)
            // For MVP, just return requests. Frontend might need to look them up.
            // Actually, without names, the dashboard is useless. 
            // Let's add Cognito lookup.

            try {
                const AWS = require("aws-sdk");
                // Amplify doesn't allow AWS_ prefix for custom env vars, so we check for alternates
                const accessKeyId = process.env.APP_AWS_ACCESS_KEY_ID || process.env.AWS_ACCESS_KEY_ID;
                const secretAccessKey = process.env.APP_AWS_SECRET_ACCESS_KEY || process.env.AWS_SECRET_ACCESS_KEY;
                const region = process.env.APP_AWS_REGION || process.env.AWS_REGION || "ap-southeast-1";

                const cognito = new AWS.CognitoIdentityServiceProvider({
                    region,
                    credentials: new AWS.Credentials(accessKeyId, secretAccessKey),
                });
                const userPoolId = process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID;

                const detailedRequests = await Promise.all(requests.map(async (req: any) => {
                    try {
                        const user = await cognito.adminGetUser({
                            UserPoolId: userPoolId,
                            Username: req.agent_id
                        }).promise();

                        const attributes = user.UserAttributes.reduce((acc: any, attr: any) => {
                            acc[attr.Name] = attr.Value;
                            return acc;
                        }, {});

                        return {
                            ...req,
                            agent: {
                                firstName: attributes["custom:firstName"] || "",
                                lastName: attributes["custom:lastName"] || "",
                                email: attributes.email || ""
                            }
                        };
                    } catch (err) {
                        console.error(`Failed to fetch agent ${req.agent_id}`, err);
                        return { ...req, agent: { firstName: "Unknown", lastName: "Agent", email: "N/A" } };
                    }
                }));

                return NextResponse.json({ requests: detailedRequests });
            } catch (awsError) {
                console.error("AWS Error:", awsError);
                // Verify if AWS error is credentials related
                return NextResponse.json({ requests, warning: "Failed to fetch agent details" });
            }
        }

        return NextResponse.json({ requests: [] });
    } catch (error) {
        console.error("Server error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
