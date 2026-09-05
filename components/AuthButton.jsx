"use client"
import { Button } from "@/components/ui/button";
import { LogIn, LogOut } from "lucide-react";
import react, { useState } from "react";
import { AuthModel } from "./ui/AuthModel.js";
import { signOut } from "@/app/actions.js";

const AuthButton = ({user}) => {
    const [showModal, setShowModal] = useState(false);

    if (user) {
        return (
            <form action={signOut}>
                <Button variant="outline" size="sm" type="submit" className="gap-2 cursor-pointer">  
                    <LogOut className="h-4 w-4" />
                    Sign out
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
                className="rounded-lg flex cursor-pointer px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white gap-2"
            >
                <LogIn className="h-4 w-4" />
                Sign in
            </Button>

            <AuthModel isOpen={showModal} onClose={() => setShowModal(false)} />
        </>
    );
};
export default AuthButton;