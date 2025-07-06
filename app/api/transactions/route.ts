import clientPromise from "@/lib/mongodb";
import { transactionSchema } from "@/lib/validation/transaction";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db("finance");

    const page = parseInt(req.nextUrl.searchParams.get("page") || "1");
    const limit = parseInt(req.nextUrl.searchParams.get("limit") || "5");
    const skip = (page - 1) * limit;

    const [transactions, total] = await Promise.all([
      db
        .collection("transactions")
        .find({})
        .sort({ date: -1 }) // Most recent first
        .skip(skip)
        .limit(limit)
        .toArray(),
      db.collection("transactions").countDocuments(),
    ]);

    return NextResponse.json({
      transactions,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    console.error("GET /api/transactions error:", err);
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
    console.error("POST /api/transactions error:", err);
    return NextResponse.json({ error: "Failed to add transaction" }, { status: 500 });
  }
}
