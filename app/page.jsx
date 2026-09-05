import AuthButton from "@/components/AuthButton";
import { Shield, Rabbit, Bell } from "lucide-react";
import Image from "next/image";
import { createClient } from "@/lib/server.js";
import AddproductForm from "@/components/AddproductForm";
import { getProducts } from "./actions";
import ProductCard from "@/components/ProductCard";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const product = user?await getProducts():[]

  const FEATURES = [
    {
      icon: Rabbit,
      title: "Lightning Fast",
      description:
        "Deal Drop extracts prices in seconds, handling JavaScript and dynamic content",
    },
    {
      icon: Shield,
      title: "Always Reliable",
      description:
        "Works across all major e-commerce sites with built-in anti-bot protection",
    },
    {
      icon: Bell,
      title: "Smart Alerts",
      description: "Get notified instantly when prices drop below your target",
    },
  ];
  return (
    <main className="min-h-screen bg-linear-br from-orange-300 via-red-200 to-orange-300">
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10 ">
        <div className="max-w-7xl mx-auto px-2 py-4 flex items-center justify-between">
          <div className="flex item-center gap-3">
            <Image
              src={"/logo.png"}
              alt="logo"
              width={600}
              height={200}
              className="h-10 w-auto"
            />
          </div>
          {/* auth button */}
          <AuthButton user={user} />
        </div>

      </header>
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div
            className="inline-flex item-center gap-3 bg-orange-100 text-orange-500 px-6 py-2 rounded-full text-sm font-medium mb-7">
            Track prices like a pro for free
          </div>
          <h2 className="text-5xl font-bold text-gray-900 mb-4 tracking-tight">Never miss a pricedrop</h2>
          <p className=" text-muted-foreground max-w-2xl mb-12 mx-auto text-gray-600">
            Never miss a drop again. DealDrop tracks prices for you 24/7, whether you're shopping on Amazon, Flipkart, or any other major retailer.
          </p>

          <AddproductForm user={user} />

          {/* features */}
          {product.length === 0 && (
            <div className="grid md:grid-cols-3 max-w-4xl grid-cols-1 gap-8 mx-auto mt-16">
              {FEATURES.map(({ icon: Icon, title, description }) => (
                <div key={title} className="bg-white/60 backdrop-blur-md border border-orange-200 px-6 py-8 rounded-3xl text-center">
                  <div className="w-12 h-12 bg-orangr-400/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Icon className=" h-8 w-8 text-orange-500" />
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-2">{title}</h3>
                  <p className="text-gray-600 text-sm">{description}</p>
                </div>


              ))}
            </div>

          )}
        </div>
      </section>

     {user && product.length> 0 &&(
      <section className="ma-w-7xl mx-auto pb-20 px-4">
        <div className="flex flex-col md:flex-row justify-between item-center mb-6 px-9">
           <h3 className="text-2xl font-semibold text-gray-900">Your tracked products</h3> 
           <span className="text-sm text-grey-500">
            {product.length} {product.length === 1 ?"product":"products"}
            </span>  
        </div>

        {/* //render the products */}
        <div className="grid gap-6 md:grid-cols-2 items-start">
          {product.map((product)=> <ProductCard key={product.id} product={product}/>
          )}

        </div>
      </section>
     ) }
      {user && product.length ===0 && (
        <section className="py-20 px-4">
          <div className="max-w-7xl mx-auto text-center">
            <h2 className="text-5xl font-bold text-gray-900 mb-4 tracking-tight">Add your first product</h2>
            <p className=" text-muted-foreground max-w-2xl mb-12 mx-auto text-gray-600">
              Never miss a drop again. DealDrop tracks prices for you 24/7, whether you're shopping on Amazon, Flipkart, or any other major retailer.
            </p>
          </div>
        </section>
      )}

    </main>
  );
}
