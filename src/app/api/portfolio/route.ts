import { NextResponse } from "next/server";
import { fetchPortfolioData } from "@/lib/sanity-service";

export const revalidate = 3600; // Revalidate every hour

export async function GET() {
  try {
    const data = await fetchPortfolioData();
    return NextResponse.json(data);
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch data" },
      { status: 500 }
    );
  }
}