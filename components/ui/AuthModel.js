"use client"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { createClient } from "@/lib/client.js";
import { Button } from "@/components/ui/button";


export function AuthModel({ isOpen, onClose }) {
    const supabase = createClient()
    const handleGoogleLogin = async () => {
        const { origin } = window.location;
        await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${origin}/auth/callback`
            }
        });
    }
    return (
        <Dialog open={isOpen}
            onOpenChange={(open) => {
                if (!open) onClose();
            }}>
            <DialogContent className="sm:max-w-sm">
                <DialogHeader>
                    <DialogTitle className="text-2xl">Join the Community</DialogTitle>
                    <DialogDescription className="text-sm">
                        Track prices with thousands of users. Sign in to get started.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex flex-col gap-4 py-4">
                    <Button variant="outline" size="lg" className="cursor-pointer rounded-lg p-2 w-full gap-2"
                    onClick={handleGoogleLogin}
                    >
                        Continue with Google
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
