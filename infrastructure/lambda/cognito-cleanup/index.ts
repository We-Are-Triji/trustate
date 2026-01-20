import { CognitoIdentityProviderClient, ListUsersCommand, AdminDeleteUserCommand } from "@aws-sdk/client-cognito-identity-provider";

const client = new CognitoIdentityProviderClient({ region: process.env.AWS_REGION });
const USER_POOL_ID = process.env.COGNITO_USER_POOL_ID!;
const THREE_DAYS_MS = 3 * 24 * 60 * 60 * 1000;

export const handler = async () => {
  try {
    const { Users } = await client.send(
      new ListUsersCommand({
        UserPoolId: USER_POOL_ID,
        Filter: 'cognito:user_status = "UNCONFIRMED"',
      })
    );

    if (!Users || Users.length === 0) {
      return { statusCode: 200, body: "No unconfirmed users found" };
    }

    const now = Date.now();
    const deletedUsers: string[] = [];

    for (const user of Users) {
      const createdAt = user.UserCreateDate?.getTime();
      if (createdAt && now - createdAt > THREE_DAYS_MS) {
        await client.send(
          new AdminDeleteUserCommand({
            UserPoolId: USER_POOL_ID,
            Username: user.Username!,
          })
        );
        deletedUsers.push(user.Username!);
      }
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: `Deleted ${deletedUsers.length} unconfirmed users`,
        users: deletedUsers,
      }),
    };
  } catch (error) {
    console.error("Error cleaning up users:", error);
    return { statusCode: 500, body: "Failed to cleanup users" };
  }
};
