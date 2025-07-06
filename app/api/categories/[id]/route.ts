// app/api/categories/[id]/route.ts
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }   // params is now a Promise
) {
  const { id } = await params;                       // await before use
  try {
    const client = await clientPromise;
    const db = client.db("finance");

    await db.collection("categories").deleteOne({ _id: new ObjectId(id) });

    return NextResponse.json({ message: "Category deleted" });
  } catch (err) {
    console.error("DELETE /api/categories/[id] error:", err);
    return NextResponse.json({ error: "Failed to delete category" }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }   // same here
) {
  const { id } = await params;
  try {
    const { name } = await req.json();

    if (!name || typeof name !== "string") {
      return NextResponse.json({ error: "Invalid category name" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("finance");

    await db.collection("categories").updateOne(
      { _id: new ObjectId(id) },
      { $set: { name } }
    );

    return NextResponse.json({ message: "Category updated" });
  } catch (err) {
    console.error("PUT /api/categories/[id] error:", err);
    return NextResponse.json({ error: "Failed to update category" }, { status: 500 });
  }
}
