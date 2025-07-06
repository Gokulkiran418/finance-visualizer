import clientPromise from "@/lib/mongodb";
import { transactionSchema } from "@/lib/validation/transaction";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db("finance");

    const url = req.nextUrl;
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "5");
    const skip = (page - 1) * limit;

    const type = url.searchParams.get("type"); // income | expense
    const description = url.searchParams.get("description"); // fuzzy search
    const startDate = url.searchParams.get("startDate"); // yyyy-mm-dd
    const endDate = url.searchParams.get("endDate");     // yyyy-mm-dd

    const query: any = {};

    if (type === "income" || type === "expense") {
      query.type = type;
    }

    if (description) {
      query.description = { $regex: description, $options: "i" };
    }

    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = startDate;
      if (endDate) query.date.$lte = endDate;
    }

    const [transactions, total] = await Promise.all([
      db
        .collection("transactions")
        .find(query)
        .sort({ date: -1 })
        .skip(skip)
        .limit(limit)
        .toArray(),
      db.collection("transactions").countDocuments(query),
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
