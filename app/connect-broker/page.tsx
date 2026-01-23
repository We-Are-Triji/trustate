"use client";

import { useRouter } from "next/navigation";
import { BrokerConnectionForm } from "@/components/auth/registration/broker-connection-form";
import { AnimatedBackground } from "@/components/auth/registration/animated-background";
import { useAuth } from "@/lib/hooks/use-auth";
import { updateUserAttributes } from "@/lib/cognito";

export default function ConnectBrokerPage() {
    const router = useRouter();
    const { userId } = useAuth(); // Ensure auth context is loaded if needed, though we just need it for protected route wrapper usually.

    const handleBack = () => {
        // If they came here directly or from verify, back might ideally go to dashboard or verify?
        // Given the context, if they are "stuck" pending, dashboard is safe.
        // If they are verifying, they can't easily go back to PRC without restarting.
        router.push("/dashboard");
    };

    const handleBrokerConnectSubmit = async (nexusLink: string) => {
        try {
            await updateUserAttributes({ userAttributes: { "custom:status": "pending_approval" } });
            // Redirect to dashboard where they will see the Pending Approval screen (with check status)
            router.push("/dashboard");
        } catch (err) {
            console.error("Failed to update status:", err);
            // Even if update fails, if the API call in component succeeded, we might want to move them.
            // But typically we want status updated.
            alert("Failed to update status. Please try again or contact support.");
        }
    };

    return (
        <main className="flex min-h-screen bg-[#0247ae]">
            <AnimatedBackground />
            <div className="relative z-10 flex w-full items-center justify-center p-6 py-12">
                <div className="w-full max-w-md animate-[fadeInScale_0.6s_ease-out_0.2s_both] bg-white rounded-2xl shadow-xl overflow-hidden">
                    <BrokerConnectionForm
                        onSubmit={handleBrokerConnectSubmit}
                        onBack={handleBack}
                    />
                </div>
            </div>
        </main>
    );
}
