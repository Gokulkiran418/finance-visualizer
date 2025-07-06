'use client';

import { useEffect, useRef, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { animate, stagger } from 'animejs';

type Category = {
  _id: string;
  name: string;
};
type Props = {
  onChange?: () => void;
};

export default function CategoryManager({ onChange }: Props) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategory, setNewCategory] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories');
      const data = await res.json();
      setCategories(data.categories);
    } catch {
      setError('Failed to load categories');
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (containerRef.current) {
      animate(containerRef.current, {
        opacity: [0, 1],
        translateY: [30, 0],
        duration: 600,
        easing: 'easeOutExpo',
      });
    }

    animate('.category-row', {
      opacity: [0, 1],
      translateX: [-20, 0],
      delay: stagger(80),
      duration: 500,
      easing: 'easeOutExpo',
    });
  }, [categories]);

  const handleAdd = async () => {
    if (!newCategory.trim()) return;

    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newCategory }),
      });

      if (!res.ok) throw new Error('Failed to add');

      setNewCategory('');
      await fetchCategories();
      onChange?.();
    } catch {
      setError('Failed to add category');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await fetch(`/api/categories/${id}`, { method: 'DELETE' });
      fetchCategories();
    } catch {
      setError('Failed to delete category');
    }
  };

  return (
    <Card ref={containerRef} className="p-6 mt-10 w-full max-w-2xl mx-auto space-y-6 opacity-0">
      <h2 className="text-xl font-bold">Manage Categories</h2>

      <div className="flex items-center gap-2">
        <Input
          placeholder="New category name"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
        />
        <Button onClick={handleAdd} disabled={loading}>
          {loading ? 'Adding...' : 'Add'}
        </Button>
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <ul className="space-y-2">
        {categories.map((cat) => (
          <li
            key={cat._id}
            className="flex justify-between items-center p-2 border rounded-md category-row opacity-0"
          >
            <span>{cat.name}</span>
            <Button variant="outline" size="sm" onClick={() => handleDelete(cat._id)}>
              Delete
            </Button>
          </li>
        ))}
      </ul>
    </Card>
  );
}
