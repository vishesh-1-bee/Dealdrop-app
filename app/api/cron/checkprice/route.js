import { sendpricedropemail } from "@/lib/email";
import { scrapedata } from "@/lib/firecrawl";
import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { success } from "zod";

export async function GET() {
    return NextResponse.json({
        msg:"price check endpoint is working"
    })
}

export async function POST(request){
try {
    const authHeader= request.headers.get("authorization");
    const cronSecreat = process.env.CRON_SECREAT

    if (!cronSecreat || authHeader !== `Bearer ${cronSecreat}`) {

        return NextResponse.json({error:"Unauthorized"}, {status:"401"})
        
    }

    //use service role to bypass the rls

    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLL_KEY
    );

   const{data:products , error: productError}= await supabase
   .from("products")
   .select("*");

   if (productError) {
    throw productError
   }
   
   console.log(`Found ${products.length} product to check`);

   const result = {
    total: products.length,
    updated:0,
    failed:0,
    priceChange:0,
    alertSend:0
   }

   for(const product of products){
      try {
        //scrape the data from the scrape function
        const productData= await scrapedata(product.url);
        if (!productData) {
            result.failed++;
            continue;
        }

        const newPrice = parseFloat(productData.currentPrice)
         const oldPrice = parseFloat(product.current_price);

        await supabase.from("products").update({
            current_price: newPrice,
            currency: productData.currencyCode || product.currency,
            name: productData. productName || product.name,
            image_url : productData.productImageUrl || product.image_url,
            updated_at: new Date().toISOString()
        }).eq("id" , product.id)

        //update if  price change

        if (oldPrice !== newPrice) {
            await supabase.from("price_history").insert({
                product_id :  product.id,
                price : newPrice,
                currency: productData.currencyCode || product.currency
            })
        }
        result.priceChange++;

        if (newPrice < oldPrice) {
            //alert to the user using the email

            const {data: {user}}= await supabase.auth.admin.getUserById(product.user_id);

        //sending emial
         if(user?.email){
          const emailResult = await sendpricedropemail(
            user.email,
            product,
            oldPrice,
            newPrice
          )
          if(emailResult.success){
            result.alertSend++;
          }
         }
        }
          

         result.updated++;
      } catch (error) {
        console.log(`error in the processing of  the product ${product.id}:` , error);
        result.failed++;
        
      }
   }
    return NextResponse.json({
        success:true,
        msg:"price checked successfully",
        result
    })
} catch (error) {
    console.log("cron job error:", error);
    return NextResponse.json({error: error.message}, {ststus:500})
    
}
}

