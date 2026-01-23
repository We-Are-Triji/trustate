"use client";

import { Amplify } from "aws-amplify";
import { useEffect } from "react";

export default function ConfigureAmplify() {
    useEffect(() => {
        const userPoolId = process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID;
        const userPoolClientId = process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID;

        if (!userPoolId || !userPoolClientId) {
            console.error(
                "Trustate: Missing Amplify Environment Variables",
                { userPoolId: !!userPoolId, userPoolClientId: !!userPoolClientId }
            );
            return;
        }

        try {
            Amplify.configure({
                Auth: {
                    Cognito: {
                        userPoolId,
                        userPoolClientId,
                    },
                },
            });
            console.log("Trustate: Amplify Configured Successfully");
        } catch (error) {
            console.error("Trustate: Failed to configure Amplify", error);
        }
    }, []);

    return null;
}
