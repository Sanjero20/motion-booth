import { useRef, useState } from "react";
import { ImagePlus, Trash2, Upload } from "lucide-react";

import { Button } from "@/components/ui/button";

interface ImageUploaderProps {
  value?: string | null;
  onChange: (file: File | null) => void;
}

function ImageUploader({ value, onChange }: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(value ?? null);

  const handleFileChange = (file?: File) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) return;

    setPreview(URL.createObjectURL(file));
    onChange(file);
  };

  const handleRemove = () => {
    setPreview(null);
    onChange(null);

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-3">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFileChange(e.target.files?.[0])}
      />

      {preview ? (
        <div className="space-y-3">
          <div className="relative overflow-hidden rounded-lg border">
            <img
              src={preview}
              alt="Background preview"
              className="h-36 w-full object-cover"
            />
          </div>

          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={() => inputRef.current?.click()}
            >
              <Upload />
              Replace
            </Button>

            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={handleRemove}
            >
              <Trash2 />
            </Button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="bg-secondary hover:bg-secondary/70 border-border flex h-28 w-full flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed transition-colors"
        >
          <ImagePlus className="text-muted-foreground size-6" />

          <span className="text-sm font-medium">Upload background image</span>

          <span className="text-muted-foreground text-xs">
            PNG, JPG or WEBP
          </span>
        </button>
      )}
    </div>
  );
}

export default ImageUploader;
