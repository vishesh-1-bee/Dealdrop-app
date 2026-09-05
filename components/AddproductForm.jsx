"use client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { AuthModel } from "./ui/AuthModel";
import { addProducts } from "@/app/actions";
import { toast } from "sonner";

const PENDING_URL_KEY = "dealdrop_pending_url";

const AddproductForm = ({ user }) => {
    const [url, seturl] = useState("");
    const [loading, setLoading] = useState(false);
    const [showAuthModel, setShowAuthModel] = useState(false);
    const hasAutoSubmitted = useRef(false);

    // Normalize URL function (ensures protocol http/https)
    const normalizeUrl = (rawUrl) => {
        if (!rawUrl) return "";
        let trimmed = rawUrl.trim();
        if (!trimmed) return "";
        if (!/^https?:\/\//i.test(trimmed)) {
            trimmed = "https://" + trimmed;
        }
        return trimmed;
    };

    const submitProductUrl = async (targetUrl) => {
        const cleanUrl = normalizeUrl(targetUrl);
        if (!cleanUrl) {
            toast.error("Please enter a valid product URL");
            return;
        }

        setLoading(true);
        try {
            const formData = new FormData();
            formData.append("url", cleanUrl);
            const result = await addProducts(formData);
            if (result?.error) {
                toast.error(result.error);
            } else {
                toast.success(result?.message || "Product tracked successfully!");
                seturl("");
            }
        } catch (err) {
            console.error("Submit error:", err);
            toast.error("Failed to add product");
        } finally {
            setLoading(false);
        }
    };

    // On mount / user login: restore pending URL and auto-submit if authenticated
    useEffect(() => {
        try {
            const savedUrl = localStorage.getItem(PENDING_URL_KEY);
            if (savedUrl && savedUrl.trim()) {
                const cleanSavedUrl = normalizeUrl(savedUrl);
                seturl(cleanSavedUrl);

                if (user && !hasAutoSubmitted.current) {
                    hasAutoSubmitted.current = true;
                    localStorage.removeItem(PENDING_URL_KEY);
                    submitProductUrl(cleanSavedUrl);
                }
            }
        } catch (e) {
            console.error("Error reading stored pending URL", e);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const cleanUrl = normalizeUrl(url);

        if (!cleanUrl) {
            toast.error("Please enter a product URL");
            return;
        }

        if (!user) {
            // Save the normalized URL before OAuth redirect so it survives login
            try {
                localStorage.setItem(PENDING_URL_KEY, cleanUrl);
            } catch (err) {
                console.error("Error saving pending URL", err);
            }
            setShowAuthModel(true);
            return;
        }

        await submitProductUrl(cleanUrl);
    };

    const handleOpenAuthModal = () => {
        const cleanUrl = normalizeUrl(url);
        if (cleanUrl) {
            try {
                localStorage.setItem(PENDING_URL_KEY, cleanUrl);
            } catch (err) {
                console.error("Error saving pending URL", err);
            }
        }
        setShowAuthModel(true);
    };

    return (
        <>
            <form className="w-full max-w-xl mx-auto flex flex-col sm:flex-row gap-3 justify-center items-center"
                onSubmit={handleSubmit}>
                <div className="w-full sm:flex-1">
                    <Input
                        type="text"
                        value={url}
                        onChange={(e) => seturl(e.target.value)}
                        placeholder="Paste product URL (e.g. amazon.com/dp/...)"
                        className="h-12 text-base w-full rounded-xl px-4 bg-white border border-gray-300 focus:border-orange-500 shadow-sm"
                        disabled={loading}
                    />
                </div>
                <Button 
                    className="bg-orange-500 hover:bg-orange-600 h-12 px-6 rounded-xl cursor-pointer text-white font-semibold text-base shadow-md w-full sm:w-auto transition-all" 
                    type="submit"
                    disabled={loading}
                >
                    {loading ? (
                        <div className="flex items-center gap-2">
                            <Loader2 className="h-5 w-5 animate-spin" />
                            <span>Adding Product...</span>
                        </div>
                    ) : (
                        "Track price"
                    )}
                </Button>
            </form>
            <AuthModel isOpen={showAuthModel} onClose={() => setShowAuthModel(false)} />
        </>
    );
};

export default AddproductForm;