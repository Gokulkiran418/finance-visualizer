// app/api/budgets/route.ts
import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { budgetSchema } from "@/lib/validation/budget";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("finance");

    const budgets = await db.collection("budgets").find().toArray();
    return NextResponse.json({ budgets });
  } catch (err) {
    console.error("GET /api/budgets error:", err);
    return NextResponse.json({ error: "Failed to fetch budgets" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = budgetSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.format() }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("finance");

    const result = await db.collection("budgets").insertOne(parsed.data);

    return NextResponse.json({ message: "Budget created", id: result.insertedId });
  } catch (err) {
    console.error("POST /api/budgets error:", err);
    return NextResponse.json({ error: "Failed to create budget" }, { status: 500 });
  }
}
