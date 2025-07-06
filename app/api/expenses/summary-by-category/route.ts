// app/api/expenses/summary-by-category/route.ts
import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET(req: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db("finance");

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const result = await db.collection("transactions").aggregate([
      {
        $match: {
          type: "expense",
          date: {
            $gte: startOfMonth.toISOString(),
            $lte: endOfMonth.toISOString(),
          },
        },
      },
      {
        $group: {
          _id: "$category",
          spent: { $sum: "$amount" },
        },
      },
      {
        $project: {
          category: "$_id",
          spent: 1,
          _id: 0,
        },
      },
    ]).toArray();

    return NextResponse.json({ data: result });
  } catch (err) {
    console.error("GET /api/expenses/summary-by-category", err);
    return NextResponse.json({ error: "Failed to load summary" }, { status: 500 });
  }
}
