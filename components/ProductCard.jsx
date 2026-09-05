"use client";
import { deleteProduct } from "@/app/actions";
import react, { useState } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";
import { Badge } from "./ui/badge";
import { ChevronDown, ChevronUp, Droplet, ExternalLink, Trash, TrendingDown } from "lucide-react";
import { Button, buttonVariants } from "./ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import PriceChart from "./PriceChart";

const ProductCard = ({ product }) => {
    const [chats, setcharts] = useState(false);
    const [deleteing, setdeleting] = useState(false);

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this product from tracking?")) return;

        setdeleting(true);
        const result = await deleteProduct(product.id);

        if (result?.error) {
            toast.error(result.error);
        } else {
            toast.success(result?.message || "Product deleted");
        }
        setdeleting(false);
    };

    return (
        <div>
            <div className="space-x-6">
                <Card className="max-w-md hover:shadow-lg transition-shadow duration-200 cursor-pointer">
                    <CardHeader className="pb-3">
                        <div className="flex gap-4 items-center">
                            {product.image_url && (
                                <img
                                    src={product.image_url}
                                    alt={product.name}
                                    className="w-16 h-16 object-cover rounded-md"
                                />
                            )}

                            <div className="flex-1 min-w-0">
                                <h3 className="line-clamp-1 font-semibold text-gray-900">{product.name}</h3>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-3xl font-semibold text-orange-500">
                                        {product.currency} {product.current_price}
                                    </span>

                                    <Badge variant="secondary" className="gap-2">
                                        <TrendingDown className="w-3 h-3" />
                                        Tracking
                                    </Badge>
                                </div>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-wrap gap-2">
                            <Button variant="outline"
                                size="sm"
                                onClick={() => setcharts(!chats)}
                                className="bg-gray-50 text-gray-900 gap-1 cursor-pointer rounded-lg py-1 h-auto">
                                {chats ? (
                                    <>
                                        <ChevronUp className="w-4 h-4" />
                                        Hide chart
                                    </>
                                ) : (
                                    <>
                                        <ChevronDown className="w-4 h-4" />
                                        Show charts
                                    </>
                                )}
                            </Button>

                            <Link 
                                href={product.url || "#"} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className={cn(buttonVariants({ variant: "outline", size: "sm" }), "gap-1 cursor-pointer")}
                            >
                                <ExternalLink className="w-4 h-4" />
                                View Product
                            </Link>

                            <Button variant="destructive" size="sm"
                                className="text-red-500 gap-1 cursor-pointer bg-white border-red-500 border hover:bg-red-500 hover:text-white"
                                onClick={handleDelete} disabled={deleteing}>
                                <Trash className="w-4 h-4" />
                                Delete product
                            </Button>
                        </div>
                    </CardContent>
                    {chats && (
                        <CardFooter className="border-t pt-2 mt-4">
                            <PriceChart productId={product.id} />
                        </CardFooter>
                    )}
                </Card>
            </div>
        </div>
    );
};
export default ProductCard;