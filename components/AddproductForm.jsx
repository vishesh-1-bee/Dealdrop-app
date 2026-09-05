"use client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Link2, ArrowRight } from "lucide-react";
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
            <form
                className="w-full max-w-2xl mx-auto"
                onSubmit={handleSubmit}
            >
                <div className="
                    flex flex-col sm:flex-row gap-3
                    p-2 rounded-2xl
                    bg-white/80 dark:bg-stone-900/80
                    border border-orange-200/70 dark:border-stone-700/70
                    shadow-lg shadow-orange-100/40 dark:shadow-stone-900/40
                    backdrop-blur-sm
                ">
                    {/* URL icon + input */}
                    <div className="flex items-center flex-1 gap-3 pl-3">
                        <Link2 className="w-4 h-4 text-orange-400 dark:text-orange-500 flex-shrink-0" />
                        <Input
                            type="text"
                            id="product-url-input"
                            value={url}
                            onChange={(e) => seturl(e.target.value)}
                            placeholder="Paste product URL from Amazon, Flipkart…"
                            className="
                                border-0 bg-transparent shadow-none focus-visible:ring-0
                                text-stone-800 dark:text-stone-100
                                placeholder:text-stone-400 dark:placeholder:text-stone-500
                                text-base h-10 px-0 w-full
                            "
                            disabled={loading}
                            autoComplete="off"
                        />
                    </div>

                    {/* Submit button */}
                    <Button
                        className="btn-orange h-11 px-6 rounded-xl cursor-pointer font-semibold text-sm flex-shrink-0 gap-2 w-full sm:w-auto"
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Tracking…
                            </>
                        ) : (
                            <>
                                Track Price
                                <ArrowRight className="h-4 w-4" />
                            </>
                        )}
                    </Button>
                </div>

                {/* Helper text */}
                <p className="text-xs text-stone-400 dark:text-stone-500 text-center mt-3">
                    Supports Amazon, Flipkart, and 50+ other stores
                </p>
            </form>

            <AuthModel isOpen={showAuthModel} onClose={() => setShowAuthModel(false)} />
        </>
    );
};

export default AddproductForm;