import { useEffect, useState } from "react";

import { DEFAULT_TEMPLATE_ID, templateFormats } from "@/data/templateFormat";
import type { Slot } from "@/features/templates/types/template";

type Format = "strip" | "portrait" | "landscape";

// Columns per photo count.
const COLUMNS: Record<Format, Record<number, number>> = {
  strip: { 1: 1, 2: 1, 3: 1, 4: 1 },
  portrait: { 1: 1, 2: 1, 3: 2, 4: 2 },
  landscape: { 1: 1, 2: 2, 3: 2, 4: 2 },
};

// Space reserved for footer.
const FOOTER: Record<Format, number> = {
  strip: 0.12,
  portrait: 0.12,
  landscape: 0.08,
};

function getFormat(width: number, height: number): Format {
  const ratio = height / width;

  if (ratio >= 2) return "strip";

  return ratio > 1 ? "portrait" : "landscape";
}

function createSlots(width: number, height: number, count: number): Slot[] {
  const n = Math.min(Math.max(Math.round(count), 1), 4);
  const format = getFormat(width, height);

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

function useTemplateEditor() {
  const initialLayout =
    templateFormats.find((template) => template.id === DEFAULT_TEMPLATE_ID) ??
    templateFormats[0];

  const [selectedTemplateId, setSelectedTemplateId] = useState(
    initialLayout.id,
  );

  const selectedLayout =
    templateFormats.find((template) => template.id === selectedTemplateId) ??
    initialLayout;

  const [slots, setSlots] = useState<Slot[]>(() =>
    createSlots(initialLayout.width, initialLayout.height, 3),
  );

  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);

  // Change print format.
  const changeTemplate = (id: string) => {
    const layout = templateFormats.find((template) => template.id === id);

    if (!layout) return;

    setSelectedTemplateId(id);

    setSlots((prev) => createSlots(layout.width, layout.height, prev.length));
  };

  // Change number of photo slots.
  const changeSlotCount = (count: number) => {
    setSlots(createSlots(selectedLayout.width, selectedLayout.height, count));
  };

  // Update all slots (used by TemplateEditor drag and resize).
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
    setBackgroundImage(URL.createObjectURL(file));
  };

  // Remove background.
  const removeBackground = () => {
    setBackgroundImage(null);
  };

  // Clean up object URLs when replaced or unmounted.
  useEffect(() => {
    return () => {
      if (backgroundImage) {
        URL.revokeObjectURL(backgroundImage);
      }
    };
  }, [backgroundImage]);

  return {
    selectedTemplateId,
    selectedLayout,
    changeTemplate,

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
