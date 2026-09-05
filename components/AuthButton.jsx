"use client";
import { Button } from "@/components/ui/button";
import { LogIn, LogOut, User } from "lucide-react";
import { useState } from "react";
import { AuthModel } from "./ui/AuthModel.js";
import { signOut } from "@/app/actions.js";

const AuthButton = ({ user }) => {
    const [showModal, setShowModal] = useState(false);

    if (user) {
        return (
            <form action={signOut}>
                <Button
                    variant="outline"
                    size="sm"
                    type="submit"
                    className="
                        gap-2 cursor-pointer rounded-full h-9 px-4
                        border border-stone-200 dark:border-stone-700
                        text-stone-600 dark:text-stone-300
                        bg-white dark:bg-stone-900
                        hover:bg-stone-50 dark:hover:bg-stone-800
                        hover:text-stone-900 dark:hover:text-stone-100
                        transition-all duration-200 shadow-sm text-sm font-medium
                    "
                >
                    <LogOut className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">Sign out</span>
                </Button>
            </form>
        );
    }

    return (
        <>
            <Button
                variant="default"
                size="sm"
                onClick={() => setShowModal(true)}
                className="
                    rounded-full flex cursor-pointer px-5 py-2 h-9
                    btn-orange text-white
                    gap-2 text-sm font-semibold
                    shadow-md
                "
            >
                <LogIn className="h-3.5 w-3.5" />
                <span>Sign in</span>
            </Button>

            <AuthModel isOpen={showModal} onClose={() => setShowModal(false)} />
        </>
    );
};

export default AuthButton;