// app/api/budgets/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { budgetSchema } from "@/lib/validation/budget";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const parsed = budgetSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.format() }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("finance");

    await db.collection("budgets").updateOne(
      { _id: new ObjectId(params.id) },
      { $set: parsed.data }
    );

    return NextResponse.json({ message: "Budget updated" });
  } catch (err) {
    console.error("PUT /api/budgets/[id] error:", err);
    return NextResponse.json({ error: "Failed to update budget" }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const client = await clientPromise;
    const db = client.db("finance");

    await db.collection("budgets").deleteOne({ _id: new ObjectId(params.id) });

    return NextResponse.json({ message: "Budget deleted" });
  } catch (err) {
    console.error("DELETE /api/budgets/[id] error:", err);
    return NextResponse.json({ error: "Failed to delete budget" }, { status: 500 });
  }
}
