"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Settings, Trash2, RefreshCw, Key, Loader2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";

interface TransactionSettingsProps {
    transactionId: string;
    transactionName?: string;
    onDeleted?: () => void;
}

export function TransactionSettings({ transactionId, transactionName, onDeleted }: TransactionSettingsProps) {
    const router = useRouter();
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [deleteError, setDeleteError] = useState<string | null>(null);

    const handleDelete = async () => {
        setIsDeleting(true);
        setDeleteError(null);

        try {
            const response = await fetch(`/api/transactions/${transactionId}`, {
                method: "DELETE",
                headers: { "x-user-id": "demo-user" },
            });

            if (response.ok) {
                onDeleted?.();
                router.push("/dashboard/transactions");
            } else {
                const data = await response.json();
                setDeleteError(data.error || "Failed to delete transaction");
            }
        } catch (error) {
            setDeleteError("Network error. Please try again.");
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className="h-full overflow-y-auto">
            <div className="p-6 space-y-6 max-w-2xl mx-auto">
                {/* Access Settings */}
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <div className="p-4 border-b border-gray-100 bg-gray-50/50">
                        <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                            <Key size={18} className="text-gray-500" />
                            Access & Security
                        </h3>
                    </div>
                    <div className="p-4">
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                            <div>
                                <p className="font-medium text-sm text-gray-900">Client Access Code</p>
                                <p className="text-xs text-gray-500">Regenerate if compromised</p>
                            </div>
                            <Button variant="outline" size="sm">
                                <RefreshCw size={14} className="mr-2" />
                                Regenerate
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Danger Zone */}
                <div className="bg-white rounded-xl border border-red-200 overflow-hidden">
                    <div className="p-4 border-b border-red-100 bg-red-50/30">
                        <h3 className="font-semibold text-red-700 flex items-center gap-2">
                            <AlertTriangle size={18} />
                            Danger Zone
                        </h3>
                    </div>
                    <div className="p-6">
                        <p className="text-sm text-gray-600 mb-4">
                            Deleting a transaction is permanent and cannot be undone. All documents, messages, and data associated with
                            <span className="font-medium text-gray-900"> {transactionName || "this transaction"} </span>
                            will be permanently deleted.
                        </p>
                        <Button
                            variant="destructive"
                            onClick={() => setShowDeleteConfirm(true)}
                            className="w-full sm:w-auto"
                        >
                            <Trash2 size={14} className="mr-2" />
                            Delete Transaction
                        </Button>
                    </div>
                </div>
            </div>

            {/* Delete Confirmation Dialog */}
            <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
                <DialogContent className="max-w-sm">
                    <DialogHeader>
                        <div className="mx-auto h-12 w-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
                            <AlertTriangle className="h-6 w-6 text-red-600" />
                        </div>
                        <DialogTitle className="text-center">Delete Transaction?</DialogTitle>
                        <DialogDescription className="text-center">
                            This action cannot be undone. All documents, messages, and data associated with{" "}
                            <span className="font-medium text-gray-900">{transactionName || "this transaction"}</span>{" "}
                            will be permanently deleted.
                        </DialogDescription>
                    </DialogHeader>

                    {deleteError && (
                        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                            {deleteError}
                        </div>
                    )}

                    <DialogFooter className="gap-2 sm:gap-0">
                        <Button
                            variant="outline"
                            onClick={() => setShowDeleteConfirm(false)}
                            disabled={isDeleting}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleDelete}
                            disabled={isDeleting}
                        >
                            {isDeleting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Deleting...
                                </>
                            ) : (
                                <>
                                    <Trash2 size={14} className="mr-2" />
                                    Delete Forever
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
