"use server"

import { scrapedata } from "@/lib/firecrawl";
import { createClient } from "@/lib/server.js";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";


export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/");
  redirect("/");
}

// code to add the products in the db using supabase 
// action code flow -> scraping -> upsert product -> price history if needed -> send notification if price drop
export async function addProducts(formData) {
  let url = formData.get("url");

  if (!url || typeof url !== "string" || !url.trim()) {
    return { error: "URL is required" };
  }

  url = url.trim();
  // Ensure valid URL protocol scheme
  if (!/^https?:\/\//i.test(url)) {
    url = "https://" + url;
  }

  try {
    const supabase = await createClient();
    // getting the user data
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return { error: "Unauthorized. Please sign in to track products." };
    }
    // scrape data with firecrawl
    const productData = await scrapedata(url);
    if (!productData || !productData.currentPrice || !productData.productName) {
      console.log("Product data extraction error:", productData);
      return { error: "Failed to extract product data from the URL" };
    }

    const newPrice = parseFloat(productData.currentPrice);
    if (isNaN(newPrice)) {
      return { error: "Failed to parse product price from the URL" };
    }
    const currency = productData.currencyCode || "USD";

    // Check if product exists for user
    const { data: existingProduct } = await supabase.from("products")
      .select("id, current_price")
      .eq("user_id", user.id)
      .eq("url", url)
      .maybeSingle();

    const isUpdate = !!existingProduct;

    // upsert product (insert or update on user_id + url)
    const { data: product, error } = await supabase.from("products")
      .upsert({
        user_id: user.id,
        name: productData.productName,
        url: url,
        current_price: newPrice,
        currency: currency,
        image_url: productData.productImageUrl || "",
        updated_at: new Date().toISOString()
      },
        {
          onConflict: "user_id, url",
          ignoreDuplicates: false
        }
      )
      .select().single();

    if (error) throw error;

    // add to the price history table if new product or price updated
    const historyAdd = !isUpdate || existingProduct.current_price !== newPrice;

   if (historyAdd && product) {
  console.log("🔥 INSERTING PRICE HISTORY");

  const { data: history, error: historyError } = await supabase
    .from("price_history")
    .insert({
      product_id: product.id,
      price: newPrice,
      currency: currency,
      checked_at: new Date().toISOString(),
    })
    .select()
    .single();

  console.log("🔥 HISTORY DATA:", history);
  console.log("🔥 HISTORY ERROR:", historyError);

  if (historyError) {
    throw historyError;
  }
}

    revalidatePath("/");
    return {
      success: true,
      product,
      message: isUpdate ? "Price updated with latest price" : "Product added successfully"
    };
  } catch (error) {
    console.error("add product error:", error);
    return { error: error.message || "Something went wrong" };
  }
}

// deleting the products 
export async function deleteProduct(productId) {
  try {
    const supabase = await createClient();

    const { error } = await supabase.from("products").delete().eq("id", productId);
    if (error) throw error;

    revalidatePath("/");
    return { success: true, message: "Product deleted successfully" };
  } catch (error) {
    console.error("deleteProduct error:", error.message);
    return { error: error.message };
  }
}

// getting all the products for particular user
export async function getProducts() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.from("products").select("*").order("updated_at", { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("getProducts error:", error.message);
    return [];
  }
}

// getting the price history for the product 
export async function getPriceHistory(productId) {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.from("price_history")
      .select("*")
      .eq("product_id", productId)
      .order("checked_at", { ascending: true });
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("getPriceHistory error:", error.message);
    return [];
  }
}