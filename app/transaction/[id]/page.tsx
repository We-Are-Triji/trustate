"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { Loader2, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/hooks/use-auth";
import { TransactionLayout, TransactionMenu } from "@/components/transaction/transaction-layout";
import { TransactionLifecycle } from "@/components/transaction/transaction-lifecycle";
import { OverviewTab } from "@/components/transaction/overview-tab";
import { ConversationTab } from "@/components/transaction/conversation-tab";
import { DocumentVault } from "@/components/transaction/document-vault";
import { ActivityTab } from "@/components/transaction/activity-tab";
import { EscrowForm } from "@/components/transaction/escrow-form";
import { SmartAssistant } from "@/components/transaction/smart-assistant";
import { TransactionSettings } from "@/components/transaction/transaction-settings";
import { KYCTab } from "@/components/transaction/kyc-tab";
import { DocumentSigningTab } from "@/components/transaction/document-signing-tab";
import type { Transaction } from "@/lib/types/transaction";

interface ExtendedTransaction extends Transaction {
  project_name?: string;
  client_name?: string;
  lifecycle_step?: number;
  client_status?: "none" | "pending" | "approved" | "rejected";
  client_invite_code?: string;
  client_invite_expires_at?: string;
}

export default function TransactionPage() {
  const params = useParams();
  const router = useRouter();
  const transactionId = params.id as string;
  const { userId, isLoading: authLoading } = useAuth();

  // State
  const [transaction, setTransaction] = useState<ExtendedTransaction | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [aiContext, setAiContext] = useState<{ documentId: string; fileName: string; fileUrl: string } | null>(null);

  // Fetch transaction data
  const fetchTransaction = useCallback(async () => {
    if (!userId) return;

    try {
      // Try to fetch from API first
      const response = await fetch(`/api/transactions/${transactionId}`, {
        headers: {
          "x-user-id": userId,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setTransaction(data.transaction);
        setCurrentStep(data.transaction.lifecycle_step || 1);
        // Calculate completed steps based on lifecycle_step
        const completed = [];
        for (let i = 1; i < (data.transaction.lifecycle_step || 1); i++) {
          completed.push(i);
        }
        setCompletedSteps(completed);
      } else if (response.status === 403) {
        setError("Access Denied: You do not have permission to view this transaction.");
        setIsLoading(false);
        return;
      } else {
        // Fallback to localStorage for demo
        const stored = localStorage.getItem("mock_transactions");
        if (stored) {
          const transactions = JSON.parse(stored);
          const found = transactions.find((t: Transaction) => t.id === transactionId);
          if (found) {
            // For strict protection, we should probably verify user ID against fallback too, 
            // but localStorage is local.
            setTransaction(found);
          }
        }
      }
    } catch (error) {
      console.error("Failed to fetch transaction:", error);
      // Fallback to localStorage
      const stored = localStorage.getItem("mock_transactions");
      if (stored) {
        const transactions = JSON.parse(stored);
        const found = transactions.find((t: Transaction) => t.id === transactionId);
        if (found) {
          setTransaction(found);
        }
      }
    } finally {
      setIsLoading(false);
    }
  }, [transactionId, userId, setTransaction, setCurrentStep, setCompletedSteps, setIsLoading]);

  useEffect(() => {
    fetchTransaction();
  }, [fetchTransaction]);

  // Derived State
  const isAgent = userId === transaction?.agent_id;
  const isClientApproved = transaction?.client_status === "approved";
  // User requested tabs to remain LOCKED until approved (reverting previous unlock)
  const canViewTabs = isAgent || isClientApproved;

  // Lock all tabs only if not allowed to view (Escrow now unlocked from Step 1)
  const lockedTabs = !canViewTabs
    ? ["messages", "documents", "escrow", "assistant"]
    : [];

  const handleStepComplete = async () => {
    if (currentStep < 6) {
      const newStep = currentStep + 1;
      setCompletedSteps([...completedSteps, currentStep]);
      setCurrentStep(newStep);

      // Update in backend
      try {
        await fetch(`/api/transactions/${transactionId}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            "x-user-id": "demo-user",
          },
          body: JSON.stringify({ lifecycle_step: newStep }),
        });
      } catch (error) {
        console.error("Failed to update step:", error);
      }
    }
  };

  const handleAnalyzeDocument = (doc: any) => {
    setAiContext({
      documentId: doc.id,
      fileName: doc.file_name,
      fileUrl: doc.file_url
    });
    setActiveTab("assistant");
  };

  const renderContent = () => {
    if (isLoading || authLoading) {
      return (
        <div className="flex items-center justify-center h-full">
          <Loader2 className="h-8 w-8 animate-spin text-[#0247ae]" />
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-center p-8">
          <div className="h-16 w-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mb-4">
            <ShieldAlert size={32} />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600 mb-6 max-w-md">{error}</p>
          <Button onClick={() => router.push('/dashboard')} variant="outline">Back to Dashboard</Button>
        </div>
      );
    }

    switch (activeTab) {
      case "overview":
        return <OverviewTab transaction={transaction} onTransactionUpdate={fetchTransaction} isAgent={isAgent} currentStep={currentStep} onNavigate={setActiveTab} />;
      case "messages":
        return <ConversationTab transactionId={transactionId} />;
      case "documents":
        return <DocumentVault transactionId={transactionId} onAnalyzeDocument={handleAnalyzeDocument} />;
      case "kyc":
        return <KYCTab transactionId={transactionId} />;
      case "signing":
        return <DocumentSigningTab transactionId={transactionId} />;
      case "escrow":
        return <EscrowForm transactionId={transactionId} />;
      case "activity":
        return <ActivityTab transactionId={transactionId} />;
      case "assistant":
        return (
          <SmartAssistant
            transactionId={transactionId}
            transactionContext={{
              projectName: transaction?.project_name || transaction?.property_address,
              clientName: transaction?.client_name,
              lifecycleStep: currentStep,
              status: transaction?.status,
            }}
            aiContext={aiContext}
          />
        );
      case "settings":
        return (
          <TransactionSettings
            transactionId={transactionId}
            transactionName={transaction?.project_name || transaction?.property_address}
          />
        );
      default:
        return <OverviewTab transaction={transaction} />;
    }
  };

  return (
    <TransactionLayout
      leftMenu={
        <TransactionMenu
          activeTab={activeTab}
          onTabChange={setActiveTab}
          transactionId={transactionId}
          projectName={transaction?.project_name || transaction?.property_address}
          lockedTabs={lockedTabs}
          userRole={isAgent ? "agent" : "client"}
        />
      }
      rightTools={
        <TransactionLifecycle
          transactionId={transactionId}
          clientStatus={transaction?.client_status}
          onStepClick={(step) => {
            // Navigate to relevant tab based on step
            if (step === 1) setActiveTab("overview");
            else if (step === 2) setActiveTab("documents");
            else if (step === 3) setActiveTab("documents");
            else setActiveTab("overview");
          }}
        />
      }
    >
      <div className="h-full flex flex-col">
        {/* Context Header for Workspace */}
        <header className="h-16 border-b border-gray-100 flex items-center justify-between px-6 bg-white">
          <div>
            <h1 className="text-xl font-bold capitalize text-gray-900">
              {activeTab === "overview" ? "Transaction Overview" : activeTab.replace("-", " ")}
            </h1>

          </div>

          <div className="flex items-center gap-2">
            {/* Tools Area */}
          </div>
        </header>

        {/* Scrollable Content Area */}
        <main className="flex-1 overflow-y-auto bg-white relative">
          {renderContent()}
        </main>
      </div>
    </TransactionLayout>
  );
}
