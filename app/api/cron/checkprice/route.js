import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

import { scrapedata } from "@/lib/firecrawl";
import { sendpricedropemail } from "@/lib/email";

export async function GET() {
  return NextResponse.json({
    success: true,
    message: "Price check endpoint is working",
  });
}

export async function POST(request) {
  try {
    // =========================
    // 1. Check Cron Authorization
    // =========================

    const authHeader = request.headers.get("authorization");
    const cronSecret = process.env.CRON_SECREAT;

    if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized",
        },
        { status: 401 }
      );
    }

    // =========================
    // 2. Create Supabase Admin Client
    // =========================

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLL_KEY
    );

    // =========================
    // 3. Get All Products
    // =========================

    const {
      data: products,
      error: productError,
    } = await supabase
      .from("products")
      .select("*");

    if (productError) {
      throw productError;
    }

    console.log(`Found ${products?.length || 0} products to check`);

    // =========================
    // 4. Result Object
    // =========================

    const result = {
      total: products?.length || 0,
      updated: 0,
      failed: 0,
      priceChange: 0,
      alertSend: 0,
    };

    // =========================
    // 5. Check Every Product
    // =========================

    for (const product of products || []) {
      try {
        console.log(`Checking product: ${product.name}`);

        // =========================
        // Scrape Latest Product Data
        // =========================

        const productData = await scrapedata(product.url);

        if (!productData) {
          console.log(`No data found for ${product.id}`);
          result.failed++;
          continue;
        }

        // =========================
        // Parse Prices
        // =========================

        const newPrice = Number.parseFloat(productData.currentPrice);
        const oldPrice = Number.parseFloat(product.current_price);

        if (!Number.isFinite(newPrice)) {
          console.log(`Invalid new price for ${product.id}`);
          result.failed++;
          continue;
        }

        if (!Number.isFinite(oldPrice)) {
          console.log(`Invalid old price for ${product.id}`);
          result.failed++;
          continue;
        }

        const currency =
          productData.currencyCode || product.currency || "USD";

        const priceChanged = oldPrice !== newPrice;
        const priceDropped = newPrice < oldPrice;

        console.log(
          `Product: ${product.name} | Old: ${oldPrice} | New: ${newPrice}`
        );

        // =========================
        // 6. Update Product
        // =========================

        const { error: updateError } = await supabase
          .from("products")
          .update({
            current_price: newPrice,
            currency,
            name: productData.productName || product.name,
            image_url:
              productData.productImageUrl || product.image_url || "",
            updated_at: new Date().toISOString(),
          })
          .eq("id", product.id);

        if (updateError) {
          throw updateError;
        }

        // =========================
        // 7. Add Price History
        // =========================

        if (priceChanged) {
          const { error: historyError } = await supabase
            .from("price_history")
            .insert({
              product_id: product.id,
              price: newPrice,
              currency,
              checked_at: new Date().toISOString(),
            });

          if (historyError) {
            console.error(
              `Price history error for ${product.id}:`,
              historyError
            );

            throw historyError;
          }

          result.priceChange++;

          console.log(
            `Price history added: ${oldPrice} -> ${newPrice}`
          );
        }

        // =========================
        // 8. Send Price Drop Email
        // =========================

        if (priceDropped) {
          console.log(
            `Price dropped for ${product.name}: ${oldPrice} -> ${newPrice}`
          );

          const {
            data: userData,
            error: userError,
          } = await supabase.auth.admin.getUserById(product.user_id);

          if (userError) {
            console.error(
              `Failed to get user ${product.user_id}:`,
              userError
            );
          }

          const user = userData?.user;

          if (user?.email) {
            try {
              const emailResult = await sendpricedropemail(
                user.email,
                {
                  ...product,
                  current_price: newPrice,
                  currency,
                },
                oldPrice,
                newPrice
              );

              if (emailResult?.success) {
                result.alertSend++;

                console.log(
                  `Price drop email sent to ${user.email}`
                );
              } else {
                console.error(
                  `Email failed for ${user.email}:`,
                  emailResult
                );
              }
            } catch (emailError) {
              console.error(
                `Email sending error for ${user.email}:`,
                emailError
              );
            }
          } else {
            console.log(
              `No email found for user ${product.user_id}`
            );
          }
        }

        // =========================
        // 9. Product Successfully Processed
        // =========================

        result.updated++;

        console.log(`Successfully checked: ${product.name}`);
      } catch (error) {
        console.error(
          `Error processing product ${product.id}:`,
          error
        );

        result.failed++;
      }
    }

    // =========================
    // 10. Final Response
    // =========================

    return NextResponse.json({
      success: true,
      message: "Price check completed successfully",
      result,
    });
  } catch (error) {
    console.error("Cron job error:", error);

    return NextResponse.json(
      {
        success: false,
        error: error?.message || "Internal server error",
      },
      { status: 500 }
    );
  }
}