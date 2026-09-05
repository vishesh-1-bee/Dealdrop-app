import { Firecrawl } from 'firecrawl';

const firecrawl = new Firecrawl({ apiKey: process.env.FIRECRAWL_URL || process.env.FIRECRAWL_API_KEY });

export async function scrapedata(url) {
  try {
    const result = await firecrawl.scrape(url, {
      formats: [
        {
          "type": "json",
          "schema": {
            "type": "object",
            "required": [
              "productName",
              "currentPrice"
            ],
            "properties": {
              "productName": {
                "type": "string"
              },
              "currentPrice": {
                "type": "string"
              },
              "currencyCode": {
                "type": "string"
              },
              "productImageUrl": {
                "type": "string"
              }
            }
          },
          prompt: "Extract the product name as 'productName', current price as a number as 'currentPrice', currency code (USD, EUR, etc) as 'currencyCode', and product image URL as 'productImageUrl' if available"
        }
      ]
    });

    const extracteddata = result.json;
    console.log("Scraped data:", extracteddata);
    if (!extracteddata || !extracteddata.productName) {
      throw new Error("No valid product data found at the provided URL");
    }
    return extracteddata;
  } catch (error) {
    console.error("Firecrawl error:", error);
    throw new Error(`Failed to extract product from ${url}: ${error.message}`);
  }
}