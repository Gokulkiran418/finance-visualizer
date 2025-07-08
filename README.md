# Personal Finance Visualizer
A modern, interactive finance tracking web app built with **Next.js 14 App Router**, **TypeScript**, and **Tailwind CSS**. It allows users to track transactions, visualize budgets, and monitor monthly expenses in real-time — all with elegant animations and an intuitive interface.

## Features

### Transaction Management
- Add, edit, and delete transactions (income/expense)
- Assign categories using a predefined list
- Paginated transaction history with smooth animations
- Real-time UI updates using refresh triggers

### Category Tracking
- Use predefined categories such as Rent, Groceries, Health, etc.
- Visual groupings for spending and budget comparisons

### Budget Management
- Set monthly budgets per category
- Automatically grouped by current month
- Modify or update budgets in-place

### Analytics & Visualization
- Monthly Expenses Chart (Recharts)
- Budget vs. Actual bar chart comparison
- Progress Indicators showing usage percentage (color-coded)

### Visual & UX Enhancements
- Entry animations using Anime.js
- Responsive layout optimized for desktop and mobile
- Dark mode support (via Tailwind)

## 🛠️ Tech Stack

| Layer            | Technology                            |
|------------------|----------------------------------------|
| Framework        | [Next.js 14 (App Router)](https://nextjs.org/docs) |
| Language         | TypeScript                             |
| Styling          | Tailwind CSS + [shadcn/ui](https://ui.shadcn.com) |
| Charts           | [Recharts](https://recharts.org)       |
| Animations       | [Anime.js](https://animejs.com/)       |
| Form Validation  | [react-hook-form](https://react-hook-form.com/) + [Zod](https://zod.dev) |
| Database         | MongoDB (via [MongoDB Atlas](https://www.mongodb.com/atlas)) |
| Deployment       | [Vercel](https://vercel.com) (Recommended) |

```
/app
  /api
    /transactions
    /budgets
    /expenses
    /categories
  /components
    TransactionForm.tsx
    TransactionTable.tsx
    MonthlyExpensesChart.tsx
    BudgetManager.tsx
    BudgetProgressIndicator.tsx
    BudgetVsActualChart.tsx
/lib
  mongodb.ts
  validation/
    budget.ts
    transaction.ts
  constants.ts
/public
  ...assets

  ```

## Getting Started
### Clone the repository
```bash
git clone https://github.com/your-username/personal-finance-visualizer.git
cd personal-finance-visualizer
```

### Install dependencies
``` bash
npm install
```

### Set up environment variables
- Create a .env.local file:
      - MONGODB_URI=your_mongodb_connection_string

### Run the development server
``` bash
npm run dev
```

Visit http://localhost:3000 to view the app.

### Predefined Categories
These are hardcoded and used in both transactions and budgets:
```
Edit
[
  "Groceries",
  "Rent",
  "Utilities",
  "Transport",
  "Health",
  "Entertainment",
  "Savings",
  "Miscellaneous"
]
Update in lib/constants.ts if needed.
```

### Example Usage
- Add a transaction: Enter amount, select category, pick a date
- Set budget: Define monthly limits per category
- View insights: Analyze progress and monthly breakdowns

### Future Enhancements (Ideas)
- Export data to CSV/PDF
- Add user authentication
- Multi-currency support
- Savings goals & recurring transactions


# Built with ❤️ using modern web technologie