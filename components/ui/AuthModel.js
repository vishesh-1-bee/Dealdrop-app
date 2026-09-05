"use client";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { createClient } from "@/lib/client.js";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

export function AuthModel({ isOpen, onClose }) {
    const supabase = createClient();

    const handleGoogleLogin = async () => {
        const { origin } = window.location;
        await supabase.auth.signInWithOAuth({
            provider: "google",
            options: {
                redirectTo: `${origin}/auth/callback`,
            },
        });
    };

    return (
        <Dialog
            open={isOpen}
            onOpenChange={(open) => {
                if (!open) onClose();
            }}
        >
            <DialogContent className="sm:max-w-sm rounded-3xl border border-orange-100 dark:border-stone-700 bg-white dark:bg-stone-900 shadow-2xl shadow-orange-100/40 dark:shadow-stone-900/60 p-8">
                {/* Icon */}
                <div className="flex justify-center mb-2">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center shadow-lg shadow-orange-300/40">
                        <Sparkles className="w-7 h-7 text-white" />
                    </div>
                </div>

                <DialogHeader className="text-center space-y-2">
                    <DialogTitle className="text-2xl font-bold text-stone-900 dark:text-stone-100 text-center">
                        Start saving money
                    </DialogTitle>
                    <DialogDescription className="text-stone-500 dark:text-stone-400 text-sm text-center leading-relaxed">
                        Sign in to track prices and get instant alerts when deals drop. Completely free.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex flex-col gap-3 mt-6">
                    {/* Google sign-in */}
                    <Button
                        variant="outline"
                        size="lg"
                        className="
                            cursor-pointer rounded-xl h-11 w-full gap-3 font-semibold text-sm
                            border border-stone-200 dark:border-stone-700
                            bg-white dark:bg-stone-800
                            text-stone-700 dark:text-stone-200
                            hover:bg-stone-50 dark:hover:bg-stone-700
                            hover:border-stone-300 dark:hover:border-stone-600
                            transition-all duration-200 shadow-sm hover:shadow-md
                        "
                        onClick={handleGoogleLogin}
                    >
                        {/* Google SVG icon */}
                        <svg
                            width="18"
                            height="18"
                            viewBox="0 0 18 18"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            aria-hidden="true"
                        >
                            <path
                                d="M17.64 9.2045c0-.638-.0573-1.2518-.1636-1.8409H9v3.4814h4.8436c-.2086 1.125-.8427 2.0782-1.7959 2.7164v2.2581h2.9087C16.6582 14.0523 17.64 11.8259 17.64 9.2045z"
                                fill="#4285F4"
                            />
                            <path
                                d="M9 18c2.43 0 4.4673-.8059 5.9564-2.1805l-2.9087-2.2581c-.8059.54-1.8368.8591-3.0477.8591-2.3446 0-4.3282-1.5836-5.036-3.7105H.9574v2.3318C2.4382 15.9832 5.4818 18 9 18z"
                                fill="#34A853"
                            />
                            <path
                                d="M3.964 10.71c-.18-.54-.2823-1.1168-.2823-1.71s.1023-1.17.2823-1.71V4.9582H.9574C.3477 6.1732 0 7.5468 0 9s.3477 2.8268.9574 4.0418L3.964 10.71z"
                                fill="#FBBC05"
                            />
                            <path
                                d="M9 3.5795c1.3214 0 2.5077.4541 3.4405 1.346l2.5813-2.5814C13.4627.8918 11.4255 0 9 0 5.4818 0 2.4382 2.0168.9574 4.9582L3.964 7.29C4.6718 5.1632 6.6554 3.5795 9 3.5795z"
                                fill="#EA4335"
                            />
                        </svg>
                        Continue with Google
                    </Button>

                    <p className="text-center text-xs text-stone-400 dark:text-stone-500 mt-1">
                        No spam. No credit card needed. Ever.
                    </p>
                </div>
            </DialogContent>
        </Dialog>
    );
}
