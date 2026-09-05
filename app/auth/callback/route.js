import { NextResponse } from "next/server";
import { createClient } from "@/lib/server.js";

export async function GET(request) {
  const { searchParams } = new URL(request.url);

  const code = searchParams.get("code");

  if (code) {
    const supabase = await createClient();

    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      console.error("Auth callback error:", error.message);

      return NextResponse.redirect(
        new URL("/auth/auth-code-error", request.url)
      );
    }
  }

  return NextResponse.redirect(new URL("/", request.url));
}