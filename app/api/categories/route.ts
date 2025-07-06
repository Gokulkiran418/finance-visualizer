// app/api/categories/route.ts
import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("finance");

    const categories = await db.collection("categories").find({}).toArray();

    return NextResponse.json({ categories });
  } catch (err) {
    console.error("GET /api/categories error:", err);
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { name } = await req.json();

    if (!name || typeof name !== "string") {
      return NextResponse.json({ error: "Invalid category name" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("finance");

    const result = await db.collection("categories").insertOne({ name });

    return NextResponse.json({ message: "Category added", id: result.insertedId });
  } catch (err) {
    console.error("POST /api/categories error:", err);
    return NextResponse.json({ error: "Failed to add category" }, { status: 500 });
  }
}
