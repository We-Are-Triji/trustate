import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const { nexusLink } = await req.json();

    // Validate format: https://trustate.com/nexus/{nexus_code}
    const nexusPattern = /^https?:\/\/(?:www\.)?trustate\.com\/nexus\/([A-Z0-9]{8})$/i;
    const match = nexusLink.match(nexusPattern);

    if (!match) {
      return NextResponse.json(
        { error: "Invalid nexus link format. Expected: https://trustate.com/nexus/XXXXXXXX" },
        { status: 400 }
      );
    }

    const nexusCode = match[1].toUpperCase();

    // Fetch broker info from nexus code
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
    const cognito = new AWS.CognitoIdentityServiceProvider({
      region: process.env.AWS_REGION || "ap-southeast-1",
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
    } catch (cognitoError) {
      console.error("Cognito error:", cognitoError);
      return NextResponse.json(
        { error: "Failed to fetch broker information" },
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
