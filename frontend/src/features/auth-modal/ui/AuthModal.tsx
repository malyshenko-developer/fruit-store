"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { requestCode, verifyCode } from "@/entities/auth";

import { EmailStep } from "./steps/EmailStep";
import { CodeStep } from "./steps/CodeStep";

interface Props {
    onClose: () => void;
}

export function AuthModal({ onClose }: Props) {
    const [step, setStep] = useState<"email" | "code">("email");
    const [email, setEmail] = useState("");
    const [serverError, setServerError] = useState<string | null>(null);
    const queryClient = useQueryClient();

    function handleEmailSuccess(submittedEmail: string) {
        setServerError(null);
        setEmail(submittedEmail);
        setStep("code");
    }

    async function handleCodeSuccess() {
        setServerError(null);
        await queryClient.invalidateQueries({ queryKey: ["me"] });
        onClose();
    }

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded p-6 w-80">
                <button onClick={onClose} className="float-right text-gray-400">
                    ×
                </button>

                {step === "email" && (
                    <EmailStep
                        requestCode={requestCode}
                        onSuccess={handleEmailSuccess}
                        onError={setServerError}
                        serverError={serverError}
                    />
                )}

                {step === "code" && (
                    <CodeStep
                        email={email}
                        verifyCode={verifyCode}
                        onSuccess={handleCodeSuccess}
                        onError={setServerError}
                        serverError={serverError}
                    />
                )}
            </div>
        </div>
    );
}