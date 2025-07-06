// app/api/categories/[id]/route.ts
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const client = await clientPromise;
    const db = client.db("finance");

    await db.collection("categories").deleteOne({ _id: new ObjectId(params.id) });

    return NextResponse.json({ message: "Category deleted" });
  } catch (err) {
    console.error("DELETE /api/categories/[id] error:", err);
    return NextResponse.json({ error: "Failed to delete category" }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { name } = await req.json();

    if (!name || typeof name !== "string") {
      return NextResponse.json({ error: "Invalid category name" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("finance");

    await db.collection("categories").updateOne(
      { _id: new ObjectId(params.id) },
      { $set: { name } }
    );

    return NextResponse.json({ message: "Category updated" });
  } catch (err) {
    console.error("PUT /api/categories/[id] error:", err);
    return NextResponse.json({ error: "Failed to update category" }, { status: 500 });
  }
}
