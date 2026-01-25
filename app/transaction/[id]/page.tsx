"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { TransactionLayout, TransactionMenu } from "@/components/transaction/transaction-layout";
import { TransactionLifecycle } from "@/components/transaction/transaction-lifecycle";
import { OverviewTab } from "@/components/transaction/overview-tab";
import { ConversationTab } from "@/components/transaction/conversation-tab";
import { DocumentVault } from "@/components/transaction/document-vault";
import { EscrowForm } from "@/components/transaction/escrow-form";
import { SmartAssistant } from "@/components/transaction/smart-assistant";
import { TransactionSettings } from "@/components/transaction/transaction-settings";
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

  // State
  const [transaction, setTransaction] = useState<ExtendedTransaction | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  // Fetch transaction data
  const fetchTransaction = useCallback(async () => {
    try {
      // Try to fetch from API first
      const response = await fetch(`/api/transactions/${transactionId}`, {
        headers: {
          "x-user-id": "demo-user", // TODO: Get from auth context
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
      } else {
        // Fallback to localStorage for demo
        const stored = localStorage.getItem("mock_transactions");
        if (stored) {
          const transactions = JSON.parse(stored);
          const found = transactions.find((t: Transaction) => t.id === transactionId);
          if (found) {
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
  }, [transactionId, setTransaction, setCurrentStep, setCompletedSteps, setIsLoading]);

  useEffect(() => {
    fetchTransaction();
  }, [fetchTransaction]);

  // Derived State
  const isClientApproved = transaction?.client_status === "approved";
  const isEscrowLocked = currentStep < 4;

  // Lock all tabs except Overview if client is not approved
  // Otherwise, fallback to escrow locking logic
  const lockedTabs = !isClientApproved
    ? ["messages", "documents", "escrow", "assistant"]
    : (isEscrowLocked ? ["escrow"] : []);

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

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-full">
          <Loader2 className="h-8 w-8 animate-spin text-[#0247ae]" />
        </div>
      );
    }

    switch (activeTab) {
      case "overview":
        return <OverviewTab transaction={transaction} onTransactionUpdate={fetchTransaction} />;
      case "messages":
        return <ConversationTab transactionId={transactionId} />;
      case "documents":
        return <DocumentVault transactionId={transactionId} />;
      case "escrow":
        return <EscrowForm transactionId={transactionId} />;
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
          lockedTabs={lockedTabs}
        />
      }
      rightTools={
        <TransactionLifecycle
          currentStep={currentStep}
          completedSteps={completedSteps}
          onStepClick={(step) => {
            // Allow viewing completed steps
            if (completedSteps.includes(step) || step === currentStep) {
              // Could implement step history view here
            }
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
            {transaction?.project_name && (
              <p className="text-sm text-gray-500">{transaction.project_name}</p>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Demo Control */}
            <button
              onClick={handleStepComplete}
              disabled={currentStep >= 6}
              className="text-xs bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-lg text-gray-600 transition-colors disabled:opacity-50"
            >
              [Dev] Complete Step {currentStep}
            </button>

            {/* Settings */}
            <TransactionSettings
              transactionId={transactionId}
              transactionName={transaction?.project_name || transaction?.property_address}
            />
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
