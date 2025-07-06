import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("finance");

    const pipeline = [
  {
    $match: { type: "expense" },
  },
  {
    $addFields: {
      dateObj: { $toDate: "$date" }, // ✅ Convert to Date if it's a string
    },
  },
  {
    $group: {
      _id: {
        year: { $year: "$dateObj" },
        month: { $month: "$dateObj" },
      },
      total: { $sum: "$amount" },
    },
  },
  {
    $sort: {
      "_id.year": 1,
      "_id.month": 1,
    },
  },
];


    const result = await db.collection("transactions").aggregate(pipeline).toArray();

    const formatted = result.map((entry) => ({
      month: `${entry._id.year}-${entry._id.month.toString().padStart(2, "0")}`,
      total: parseFloat(entry.total.toString()), // Handle Decimal128
    }));

    return NextResponse.json({ data: formatted });
  } catch (err) {
    console.error("GET /api/expenses/monthly error:", err);
    return NextResponse.json({ error: "Failed to load chart data" }, { status: 500 });
  }
}
