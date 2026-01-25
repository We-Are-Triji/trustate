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
import type { Transaction } from "@/lib/types/transaction";

export default function TransactionPage() {
  const params = useParams();
  const router = useRouter();
  const transactionId = params.id as string;

  // State
  const [activeTab, setActiveTab] = useState("overview");
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  // Derived State
  // Step 1 (Reservation) -> Step 2 (KYC) -> Step 3 (Docs) -> Step 4 (Escrow)
  // Escrow tab is locked until Step 4 (Escrow Funding) is active or completed.
  const isEscrowLocked = currentStep < 4;
  const lockedTabs = isEscrowLocked ? ["escrow"] : [];

  const handleStepComplete = () => {
    if (currentStep < 6) {
      setCompletedSteps([...completedSteps, currentStep]);
      setCurrentStep(currentStep + 1);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return <OverviewTab transaction={null} />; // Passing null for demo, real data would go here
      case "messages":
        return <ConversationTab transactionId={transactionId} />;
      case "documents":
        return <DocumentVault transactionId={transactionId} />;
      case "escrow":
        return <EscrowForm transactionId={transactionId} />;
      case "assistant":
        return <SmartAssistant transactionId={transactionId} />;
      default:
        return <OverviewTab transaction={null} />;
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
            // Dev/Demo: Allow clicking previous steps to view? Or strict? 
            // For now, strict: can't jump ahead.
          }}
        />
      }
    >
      <div className="h-full flex flex-col">
        {/* Context Header for Workspace */}
        <header className="h-16 border-b border-gray-100 flex items-center justify-between px-6 bg-white">
          <h1 className="text-xl font-bold capitalize text-gray-900">
            {activeTab === "overview" ? "Transaction Overview" : activeTab.replace("-", " ")}
          </h1>

          {/* Demo Control */}
          <button
            onClick={handleStepComplete}
            className="text-xs bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-lg text-gray-600 transition-colors"
          >
            [Dev] Complete Step {currentStep}
          </button>
        </header>

        {/* Scrollable Content Area */}
        <main className="flex-1 overflow-y-auto bg-white relative">
          {renderContent()}
        </main>
      </div>
    </TransactionLayout>
  );
}
