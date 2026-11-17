/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useRef, useState } from "react";

import { DEFAULT_LAYOUTS, DEFAULT_LAYOUT } from "@/data/layout";
import type {
  Layout,
  Slot,
  TemplateConfiguration,
} from "@/features/templates/types/template";

//
export const MAX_PHOTO_SLOTS = 8;

// Columns per photo count.
const COLUMNS: Record<Layout["format"], (count: number) => number> = {
  strip: () => 1,
  portrait: (count) => (count <= 2 ? 1 : 2),
  landscape: (count) => (count === 1 ? 1 : 2),
};

// Space reserved for footer.
const FOOTER: Record<Layout["format"], number> = {
  strip: 0.12,
  portrait: 0.12,
  landscape: 0.08,
};

function createSlots(layout: Layout, count: number): Slot[] {
  const { width, height, format } = layout;

  const n = Math.min(Math.max(Math.round(count), 1), MAX_PHOTO_SLOTS);

  const margin = Math.round(Math.min(width, height) * 0.06);
  const gap = Math.round(margin / 2);

  const columns = COLUMNS[format](n);
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

function useTemplateEditor(
  initialTemplate?: TemplateConfiguration,
  initialTemplateKey?: string,
) {
  const [name, setName] = useState("");

  const [selectedLayout, setSelectedLayout] = useState<Layout>(() => ({
    ...(initialTemplate?.layout ?? DEFAULT_LAYOUT),
  }));

  const [slots, setSlots] = useState<Slot[]>(() =>
    initialTemplate?.slots.length
      ? initialTemplate.slots
      : createSlots(initialTemplate?.layout ?? DEFAULT_LAYOUT, 4),
  );

  const [backgroundImage, setBackgroundImage] = useState<string | null>(
    initialTemplate?.backgroundImage ?? null,
  );

  const backgroundUrlRef = useRef<string | null>(null);
  const initializedTemplateKey = useRef<string | undefined>(undefined);

  // Initialize or load a reusable template.
  useEffect(() => {
    if (initializedTemplateKey.current === initialTemplateKey) return;

    initializedTemplateKey.current = initialTemplateKey;

    // Revoke an old uploaded background before changing templates.
    if (backgroundUrlRef.current) {
      URL.revokeObjectURL(backgroundUrlRef.current);
      backgroundUrlRef.current = null;
    }

    if (!initialTemplate) {
      setSelectedLayout({ ...DEFAULT_LAYOUT });
      setSlots(createSlots(DEFAULT_LAYOUT, 3));
      setBackgroundImage(null);
      return;
    }

    setSelectedLayout({ ...initialTemplate.layout });

    setSlots(
      initialTemplate.slots.length
        ? initialTemplate.slots.map((slot) => ({ ...slot }))
        : createSlots(initialTemplate.layout, 3),
    );

    setBackgroundImage(initialTemplate.backgroundImage ?? null);
  }, [initialTemplate, initialTemplateKey]);

  // Change layout.
  const changeLayout = (format: Layout["format"]) => {
    const layout = DEFAULT_LAYOUTS.find((item) => item.format === format);

    if (!layout) return;

    setSelectedLayout(layout);

    setSlots((prev) => createSlots(layout, prev.length));
  };

  // Add a slot.
  const addSlot = () => {
    setSlots((prev) => {
      if (prev.length >= MAX_PHOTO_SLOTS) return prev;

      const firstSlot = prev[0];
      const offset = 20;

      const newSlot: Slot = {
        x: firstSlot.x,
        y: Math.min(offset, selectedLayout.height - firstSlot.h),
        w: firstSlot.w,
        h: firstSlot.h,
      };

      return [...prev, newSlot];
    });
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
    setSlots((prev) => {
      if (prev.length <= 1) return prev;

      return prev.filter((_, i) => i !== index);
    });
  };

  const autoArrangeSlots = () => {
    setSlots((prev) => createSlots(selectedLayout, prev.length));
  };

  const resetEditor = () => {
    if (!initialTemplate) {
      setSelectedLayout({ ...DEFAULT_LAYOUT });
      setSlots(createSlots(DEFAULT_LAYOUT, 3));
      setBackgroundImage(null);
      return;
    }

    setSelectedLayout({ ...initialTemplate.layout });
    setSlots(initialTemplate.slots.map((slot) => ({ ...slot })));
    setBackgroundImage(initialTemplate.backgroundImage ?? null);
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
    name,
    setName,

    selectedLayout,
    changeLayout,

    slots,
    setSlots: updateSlots,
    addSlot,
    updateSlot,
    removeSlot,
    autoArrangeSlots,
    resetEditor,

    backgroundImage,
    uploadBackground,
    removeBackground,
  };
}

export default useTemplateEditor;
