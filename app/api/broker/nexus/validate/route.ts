import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";


export async function POST(req: NextRequest) {
  try {
    const { nexusLink } = await req.json();

    // Validate format: https://trustate.triji.me/nexus/{nexus_code} or https://trustate.com/nexus/{nexus_code}
    // Updated to accept both trustate.com and trustate.triji.me, and variable length codes (mixed case)
    const nexusPattern = /^https?:\/\/(?:www\.)?(?:trustate\.com|trustate\.triji\.me)\/nexus\/([A-Za-z0-9_-]+)$/i;
    const match = nexusLink.match(nexusPattern);

    if (!match) {
      return NextResponse.json(
        { error: "Invalid nexus link format. Expected: https://trustate.triji.me/nexus/CODE..." },
        { status: 400 }
      );
    }

    // Use the code exactly as extracted (preserve case if needed, though previously we uppercased it)
    // If the generation logic uses mixed case, we should strictly NOT force uppercase unless we know for sure.
    // Given the user gave 'MhWJm6XujccW', we should preserve case.
    const nexusCode = match[1];

    // Fetch broker info from nexus code
    const supabase = getSupabaseAdmin();
    const { data: nexusData, error: nexusError } = await supabase
      .from("broker_nexus")
      .select("broker_id")
      .eq("nexus_code", nexusCode)
      .single();

    if (nexusError || !nexusData) {
      return NextResponse.json(
        { error: "Nexus link not found or expired" },
        { status: 404 }
      );
    }

    // Fetch broker details from Cognito
    const AWS = require("aws-sdk");

    // Amplify doesn't allow AWS_ prefix for custom env vars, so we check for alternates
    const accessKeyId = process.env.APP_AWS_ACCESS_KEY_ID || process.env.AWS_ACCESS_KEY_ID;
    const secretAccessKey = process.env.APP_AWS_SECRET_ACCESS_KEY || process.env.AWS_SECRET_ACCESS_KEY;
    const region = process.env.APP_AWS_REGION || process.env.AWS_REGION || "ap-southeast-1";

    const cognito = new AWS.CognitoIdentityServiceProvider({
      region,
      credentials: new AWS.Credentials({
        accessKeyId,
        secretAccessKey,
      }),
    });

    const userPoolId = process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID;

    try {
      const cognitoUser = await cognito
        .adminGetUser({
          UserPoolId: userPoolId,
          Username: nexusData.broker_id,
        })
        .promise();

      const attributes = cognitoUser.UserAttributes.reduce(
        (acc: any, attr: any) => {
          acc[attr.Name] = attr.Value;
          return acc;
        },
        {}
      );

      return NextResponse.json({
        nexusCode,
        broker: {
          id: nexusData.broker_id,
          firstName: attributes["custom:firstName"] || "",
          lastName: attributes["custom:lastName"] || "",
          email: attributes.email || "",
          picture: attributes.picture || null,
        },
      });
    } catch (cognitoError: any) {
      console.error("Cognito full error:", JSON.stringify(cognitoError, null, 2));

      let errorMessage = `Failed to fetch broker information: ${cognitoError.code || "Unknown"} - ${cognitoError.message || JSON.stringify(cognitoError)}`;

      if (cognitoError.code === "AccessDeniedException" || cognitoError.code === "NotAuthorizedException") {
        errorMessage = "Server Error: Missing permissions to fetch broker details. Please check AWS IAM policies.";
      } else if (cognitoError.code === "UnrecognizedClientException" || cognitoError.code === "MissingCredentials" || cognitoError.code === "CredentialsError") {
        errorMessage = "Server Error: Missing AWS Credentials. Please check APP_AWS_ACCESS_KEY_ID in env vars.";
      } else if (cognitoError.code === "UserNotFoundException") {
        errorMessage = "Broker account not found in Cognito.";
      }

      return NextResponse.json(
        { error: errorMessage, details: cognitoError },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Validation error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
