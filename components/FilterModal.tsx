'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { ICategory } from '@/types/index';

interface FilterModalProps {
  open: boolean;
  categories: ICategory[];
  initialSelected: string[]; // array of category ids
  onApply: (selected: string[]) => void;
  onClose: () => void;
  onReset?: () => void;
}

export default function FilterModal({
  open,
  categories,
  initialSelected,
  onApply,
  onClose,
  onReset,
}: FilterModalProps) {
  const [localSelected, setLocalSelected] = useState<string[]>(initialSelected ?? []);
  const sheetRef = useRef<HTMLDivElement | null>(null);

  // Sync local selection with parent
  useEffect(() => {
    setLocalSelected(initialSelected ?? []);
  }, [initialSelected, open]);

  // Lock background scroll when open
  useEffect(() => {
    if (open) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [open]);

  // Focus modal for accessibility
  useEffect(() => {
    if (open) {
      setTimeout(() => sheetRef.current?.focus(), 60);
    }
  }, [open]);

  // Close on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  const toggle = (id: string) => {
    setLocalSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleApply = () => {
    onApply(localSelected);
    onClose();
  };

  const handleReset = () => {
    setLocalSelected([]);
    if (onReset) onReset();
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.45 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={onClose}
            aria-hidden="true"
            className="fixed inset-0 bg-black z-40"
          />

          {/* Bottom Sheet */}
          <motion.div
            ref={sheetRef}
            role="dialog"
            aria-modal="true"
            aria-label="Filters"
            tabIndex={-1}
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed left-0 right-0 bottom-0 z-50 bg-white rounded-t-2xl shadow-xl max-h-[85vh] overflow-auto"
            style={{ WebkitOverflowScrolling: 'touch' }}
          >
            <div className="px-4 pt-4 pb-6">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
                  <p className="text-xs text-gray-500">
                    Refine results by categories and more
                  </p>
                </div>
                <button
                  onClick={onClose}
                  aria-label="Close filters"
                  className="p-2 rounded-full hover:bg-gray-100 text-gray-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Categories */}
              <div className="mt-4">
                <h3 className="text-sm font-medium text-gray-800 mb-2">
                  Categories
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {categories.map((c) => {
                    const checked = localSelected.includes(c._id);
                    return (
                      <label
                        key={c._id}
                        className={`flex items-center gap-2 p-2 rounded-lg border transition-colors cursor-pointer ${
                          checked
                            ? 'bg-primary/10 border-primary'
                            : 'bg-gray-50 border-gray-100'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggle(c._id)}
                          className="h-4 w-4 rounded text-primary border-gray-300"
                        />
                        <div className="text-sm text-gray-700">{c.name}</div>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Actions */}
              <div className="mt-6 flex gap-3">
                <Button onClick={handleApply} className="flex-1">
                  Apply ({localSelected.length})
                </Button>
                <Button variant="outline" onClick={handleReset} className="flex-1">
                  Reset
                </Button>
              </div>

              <div className="mt-4 text-xs text-gray-400">
                Tip: You can select multiple categories. Tap{' '}
                <strong>Apply</strong> to update results.
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
