// app/api/transactions/[id]/route.ts

import clientPromise from "@/lib/mongodb";
import { transactionSchema } from "@/lib/validation/transaction";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }  // params may be a Promise
) {
  const { id } = await params;  // ✅ await before use

  try {
    const body = await req.json();
    const parsed = transactionSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.errors }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("finance");

    await db.collection("transactions").updateOne(
      { _id: new ObjectId(id) },
      { $set: parsed.data }
    );

    return NextResponse.json({ message: "Transaction updated" });
  } catch (err) {
    console.error("PUT /api/transactions/[id] error:", err);
    return NextResponse.json({ error: "Failed to update transaction" }, { status: 500 });
  }
}
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }  // 🧠 note this is now async
) {
  const { id } = await params;  // ✅ await params before use

  try {
    const client = await clientPromise;
    const db = client.db("finance");

    await db.collection("transactions").deleteOne({ _id: new ObjectId(id) });

    return NextResponse.json({ message: "Transaction deleted" });
  } catch (err) {
    console.error("DELETE /api/transactions/[id] error:", err);
    return NextResponse.json({ error: "Failed to delete transaction" }, { status: 500 });
  }
}