"use client";
import { deleteProduct } from "@/app/actions";
import { useState } from "react";
import { toast } from "sonner";
import { Badge } from "./ui/badge";
import {
    ChevronDown,
    ChevronUp,
    ExternalLink,
    Trash2,
    TrendingDown,
    Package,
} from "lucide-react";
import { Button, buttonVariants } from "./ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import PriceChart from "./PriceChart";

const ProductCard = ({ product }) => {
    const [showChart, setShowChart] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const handleDelete = async () => {
        if (!confirm("Remove this product from tracking?")) return;
        setDeleting(true);
        const result = await deleteProduct(product.id);
        if (result?.error) {
            toast.error(result.error);
        } else {
            toast.success(result?.message || "Product removed");
        }
        setDeleting(false);
    };

    return (
        <div className="glass-card card-hover rounded-2xl overflow-hidden bg-white dark:bg-stone-900/60">
            {/* Card header */}
            <div className="p-5 pb-4">
                <div className="flex gap-4 items-start">
                    {/* Product image */}
                    <div className="flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden bg-orange-50 dark:bg-stone-800 border border-orange-100 dark:border-stone-700 flex items-center justify-center">
                        {product.image_url ? (
                            <img
                                src={product.image_url}
                                alt={product.name}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <Package className="w-7 h-7 text-orange-300 dark:text-stone-600" />
                        )}
                    </div>

                    {/* Product info */}
                    <div className="flex-1 min-w-0">
                        <h3 className="line-clamp-2 font-semibold text-stone-900 dark:text-stone-100 text-sm leading-snug mb-2">
                            {product.name}
                        </h3>
                        <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
                                {product.currency}{" "}
                                {Number(product.current_price).toLocaleString("en-IN")}
                            </span>
                            <Badge
                                variant="secondary"
                                className="gap-1 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/50 text-xs px-2 py-0.5 rounded-full"
                            >
                                <TrendingDown className="w-3 h-3" />
                                Tracking
                            </Badge>
                        </div>
                    </div>
                </div>
            </div>

            {/* Divider */}
            <div className="h-px bg-gradient-to-r from-transparent via-orange-100 dark:via-stone-700/60 to-transparent mx-5" />

            {/* Actions */}
            <div className="px-5 py-3 flex items-center gap-2 flex-wrap">
                {/* Toggle chart */}
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowChart(!showChart)}
                    className="h-8 gap-1.5 text-xs font-medium rounded-lg text-stone-600 dark:text-stone-300 hover:bg-orange-50 dark:hover:bg-stone-800 hover:text-orange-600 dark:hover:text-orange-400 transition-colors cursor-pointer"
                >
                    {showChart ? (
                        <>
                            <ChevronUp className="w-3.5 h-3.5" />
                            Hide chart
                        </>
                    ) : (
                        <>
                            <ChevronDown className="w-3.5 h-3.5" />
                            Price history
                        </>
                    )}
                </Button>

                {/* View product */}
                <Link
                    href={product.url || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                        buttonVariants({ variant: "ghost", size: "sm" }),
                        "h-8 gap-1.5 text-xs font-medium rounded-lg text-stone-600 dark:text-stone-300 hover:bg-orange-50 dark:hover:bg-stone-800 hover:text-orange-600 dark:hover:text-orange-400 transition-colors"
                    )}
                >
                    <ExternalLink className="w-3.5 h-3.5" />
                    View on site
                </Link>

                {/* Delete — pushed to right */}
                <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 ml-auto rounded-lg text-stone-400 dark:text-stone-500 hover:bg-red-50 dark:hover:bg-red-950/30 hover:text-red-500 dark:hover:text-red-400 transition-colors cursor-pointer"
                    onClick={handleDelete}
                    disabled={deleting}
                    title="Remove from tracking"
                >
                    <Trash2 className="w-3.5 h-3.5" />
                </Button>
            </div>

            {/* Price Chart */}
            {showChart && (
                <div className="px-5 pb-5 border-t border-orange-100/60 dark:border-stone-700/40 pt-4">
                    <PriceChart productId={product.id} />
                </div>
            )}
        </div>
    );
};

export default ProductCard;