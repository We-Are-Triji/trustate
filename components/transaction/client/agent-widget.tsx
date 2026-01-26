"use client";

import { Phone, Mail, MessageCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface AgentWidgetProps {
    agentName: string;
    agentPhone?: string;
    agentEmail?: string;
    agentPhoto?: string;
    brokerageName?: string;
}

export function AgentWidget({
    agentName,
    agentPhone,
    agentEmail,
    agentPhoto,
    brokerageName
}: AgentWidgetProps) {
    return (
        <Card className="border-gray-200 bg-white shadow-sm">
            <CardContent className="p-4">
                <div className="flex items-center gap-4">
                    {/* Agent Photo */}
                    <div className="h-14 w-14 rounded-full bg-gradient-to-br from-[#0247ae] to-blue-600 flex items-center justify-center text-white font-bold text-xl shrink-0">
                        {agentPhoto ? (
                            <img src={agentPhoto} alt={agentName} className="h-full w-full rounded-full object-cover" />
                        ) : (
                            agentName.charAt(0).toUpperCase()
                        )}
                    </div>

                    {/* Agent Info */}
                    <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 truncate">{agentName}</p>
                        {brokerageName && (
                            <p className="text-xs text-gray-500 truncate">{brokerageName}</p>
                        )}
                        <p className="text-xs text-[#0247ae] font-medium mt-0.5">Your Agent</p>
                    </div>

                    {/* Contact Buttons */}
                    <div className="flex gap-2">
                        {agentPhone && (
                            <Button
                                variant="outline"
                                size="icon"
                                className="h-10 w-10 rounded-full"
                                onClick={() => window.open(`tel:${agentPhone}`)}
                            >
                                <Phone size={16} className="text-gray-600" />
                            </Button>
                        )}
                        <Button
                            size="icon"
                            className="h-10 w-10 rounded-full bg-[#0247ae] hover:bg-[#023a8a]"
                            onClick={() => window.open(`sms:${agentPhone}`)}
                        >
                            <MessageCircle size={16} />
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
