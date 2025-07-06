import clientPromise from "@/lib/mongodb";
import { transactionSchema } from "@/lib/validation/transaction";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("finance");
    const transactions = await db.collection("transactions").find().toArray();

    return NextResponse.json({ transactions });
  } catch (err) {
    return NextResponse.json({ error: "Failed to fetch transactions" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = transactionSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.errors }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("finance");

    const result = await db.collection("transactions").insertOne(parsed.data);

    return NextResponse.json({ message: "Transaction added", id: result.insertedId });
  } catch (err) {
    return NextResponse.json({ error: "Failed to add transaction" }, { status: 500 });
  }
}
