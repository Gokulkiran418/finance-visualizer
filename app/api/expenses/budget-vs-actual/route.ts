// app/api/expenses/budget-vs-actual/route.ts
import clientPromise from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";
import { Decimal128 } from "mongodb";

export async function GET(req: NextRequest) {
  try {
    const url = req.nextUrl;
    // month in YYYY-MM format, defaults to current
    const monthParam = url.searchParams.get("month");
    const now = new Date();
    const month = monthParam || `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, "0")}`;

    const [yearStr, monthStr] = month.split("-");
    const year = parseInt(yearStr, 10);
    const mon  = parseInt(monthStr, 10);

    const client = await clientPromise;
    const db = client.db("finance");

    // 1️⃣ Load budgets for this month
    const budgets = await db
      .collection("budgets")
      .find({ month })
      .toArray();

    // 2️⃣ Sum actual expenses by category for this month
    const pipeline = [
      // convert date string to Date
      { $addFields: { dateObj: { $toDate: "$date" } } },
      // filter expense + same year/month
      {
        $match: {
          type: "expense",
          $expr: {
            $and: [
              { $eq: [{ $year: "$dateObj" }, year] },
              { $eq: [{ $month: "$dateObj" }, mon] },
            ],
          },
        },
      },
      // group by category
      {
        $group: {
          _id: "$category",
          spent: { $sum: "$amount" },
        },
      },
    ];

    const spentResults = await db
      .collection("transactions")
      .aggregate(pipeline)
      .toArray();

    // 3️⃣ Combine budgets & spent
    const data = budgets.map((b) => {
      // find spent for this category (or 0)
      const match = spentResults.find((s) => s._id === b.category);
      return {
        category: b.category,
        budget: parseFloat((b.amount as unknown as Decimal128).toString()),
        spent: match ? parseFloat((match.spent as unknown as Decimal128).toString()) : 0,
      };
    });

    // Optionally include categories with spending but no budget:
    spentResults.forEach((s) => {
      if (!budgets.some((b) => b.category === s._id)) {
        data.push({
          category: s._id,
          budget: 0,
          spent: parseFloat((s.spent as unknown as Decimal128).toString()),
        });
      }
    });

    return NextResponse.json({ data });
  } catch (err) {
    console.error("GET /api/expenses/budget-vs-actual error:", err);
    return NextResponse.json(
      { error: "Failed to fetch budget vs actual data" },
      { status: 500 }
    );
  }
}
