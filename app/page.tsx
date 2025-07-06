'use client';

import TransactionForm from "@/components/TransactionForm";
import { Button } from "@/components/ui/button";
import { animate } from "animejs"; // ✅ Updated import
import { useEffect, useRef } from "react";

export default function Home() {
  const headingRef = useRef(null);

  useEffect(() => {
    if (headingRef.current) {
      animate(headingRef.current, {
        opacity: [0, 1],
        translateY: [40, 0],
        easing: "easeOutExpo",
        duration: 800,
      });
    }
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-start p-6 pt-24">
      <h1 ref={headingRef} className="text-4xl font-bold mb-8">
        Personal Finance Visualizer
      </h1>
      <TransactionForm />
    </main>
  );
}
