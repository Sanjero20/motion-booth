import { useEffect, useRef, useState } from "react";

import { DEFAULT_LAYOUTS, DEFAULT_LAYOUT } from "@/data/layout";
import type {
  Layout,
  Slot,
  Template,
} from "@/features/templates/types/template";

// Columns per photo count.
const COLUMNS: Record<Layout["format"], Record<number, number>> = {
  strip: { 1: 1, 2: 1, 3: 1, 4: 1 },
  portrait: { 1: 1, 2: 1, 3: 2, 4: 2 },
  landscape: { 1: 1, 2: 2, 3: 2, 4: 2 },
};

// Space reserved for footer.
const FOOTER: Record<Layout["format"], number> = {
  strip: 0.12,
  portrait: 0.12,
  landscape: 0.08,
};

function createSlots(layout: Layout, count: number): Slot[] {
  const { width, height, format } = layout;

  const n = Math.min(Math.max(Math.round(count), 1), 4);

  const margin = Math.round(Math.min(width, height) * 0.06);
  const gap = Math.round(margin / 2);

  const columns = COLUMNS[format][n];
  const rows = Math.ceil(n / columns);

  const availableWidth = width - margin * 2;
  const availableHeight =
    height - margin * 2 - Math.round(height * FOOTER[format]);

  const slotWidth = Math.round(
    (availableWidth - gap * (columns - 1)) / columns,
  );

  const slotHeight = Math.round((availableHeight - gap * (rows - 1)) / rows);

  return Array.from({ length: n }, (_, index) => {
    const row = Math.floor(index / columns);
    const column = index % columns;

    // Center an incomplete last row.
    const itemsInRow = Math.min(columns, n - row * columns);
    const rowWidth = itemsInRow * slotWidth + (itemsInRow - 1) * gap;
    const rowStart = margin + Math.round((availableWidth - rowWidth) / 2);

    return {
      x: rowStart + column * (slotWidth + gap),
      y: margin + row * (slotHeight + gap),
      w: slotWidth,
      h: slotHeight,
    };
  });
}

function useTemplateEditor(initialTemplate?: Template) {
  const [selectedLayout, setSelectedLayout] = useState<Layout>(() => ({
    ...(initialTemplate?.layout ?? DEFAULT_LAYOUT),
  }));

  const [slots, setSlots] = useState<Slot[]>(() =>
    initialTemplate?.slots.length
      ? initialTemplate.slots
      : createSlots(initialTemplate?.layout ?? DEFAULT_LAYOUT, 3),
  );

  const [backgroundImage, setBackgroundImage] = useState<string | null>(
    initialTemplate?.backgroundImage ?? null,
  );

  const backgroundUrlRef = useRef<string | null>(null);
  const initializedTemplateId = useRef<string | null>(null);

  useEffect(() => {
    if (!initialTemplate) return;

    if (initializedTemplateId.current === initialTemplate.id) return;

    initializedTemplateId.current = initialTemplate.id;

    setSelectedLayout({ ...initialTemplate.layout });
    setSlots(initialTemplate.slots);
    setBackgroundImage(initialTemplate.backgroundImage ?? null);
  }, [initialTemplate]);

  // Change layout.
  const changeLayout = (format: Layout["format"]) => {
    const layout = DEFAULT_LAYOUTS.find((item) => item.format === format);

    if (!layout) return;

    setSelectedLayout(layout);

    setSlots((prev) => createSlots(layout, prev.length));
  };

  // Change number of photo slots.
  const changeSlotCount = (count: number) => {
    setSlots(createSlots(selectedLayout, count));
  };

  // Update all slots.
  const updateSlots = (newSlots: Slot[]) => {
    setSlots(newSlots);
  };

  // Update an individual slot.
  const updateSlot = (index: number, updates: Partial<Slot>) => {
    setSlots((prev) =>
      prev.map((slot, i) => (i === index ? { ...slot, ...updates } : slot)),
    );
  };

  // Delete a slot.
  const removeSlot = (index: number) => {
    setSlots((prev) => prev.filter((_, i) => i !== index));
  };

  // Upload background.
  const uploadBackground = (file: File) => {
    if (backgroundUrlRef.current) {
      URL.revokeObjectURL(backgroundUrlRef.current);
    }

    const url = URL.createObjectURL(file);

    backgroundUrlRef.current = url;
    setBackgroundImage(url);
  };

  // Remove background.
  const removeBackground = () => {
    if (backgroundUrlRef.current) {
      URL.revokeObjectURL(backgroundUrlRef.current);
      backgroundUrlRef.current = null;
    }

    setBackgroundImage(null);
  };

  // Clean up object URLs on unmount.
  useEffect(() => {
    return () => {
      if (backgroundUrlRef.current) {
        URL.revokeObjectURL(backgroundUrlRef.current);
      }
    };
  }, []);

  return {
    selectedLayout,
    changeLayout,

    slots,
    setSlots: updateSlots,
    changeSlotCount,
    updateSlot,
    removeSlot,

    backgroundImage,
    uploadBackground,
    removeBackground,
  };
}

export default useTemplateEditor;
