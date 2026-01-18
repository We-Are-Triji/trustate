"use client";

interface ToolsPanelProps {
  activeTab: string;
}

export function ToolsPanel({ activeTab }: ToolsPanelProps) {
  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-gray-100">
        <h3 className="font-semibold text-gray-900">Tools</h3>
      </div>
      <div className="flex-1 p-4">
        <p className="text-sm text-gray-500">
          Tools for {activeTab} will appear here
        </p>
      </div>
    </div>
  );
}
