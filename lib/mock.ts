export function mockDelay(ms: number = 1500): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function mockVerification(): Promise<{ success: boolean }> {
  await mockDelay(2000);
  return { success: true };
}
