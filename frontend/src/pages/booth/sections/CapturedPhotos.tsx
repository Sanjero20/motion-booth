import type { Photo } from "@/types/booth";

interface Props {
  limit: number;
  photos: Photo[];
}

function CapturedPhotos({ limit, photos }: Props) {
  return (
    <div className="grid w-full grid-cols-2 gap-2 sm:gap-3 md:grid-cols-1">
      {Array.from({ length: limit }).map((_, index) => {
        const photo = photos[index];

        return (
          <div
            key={index}
            className="bg-secondary border-border relative flex min-w-0 items-center justify-center overflow-hidden rounded-md border-2 border-dashed"
          >
            <div className="aspect-4/3 w-full">
              {photo ? (
                <img
                  src={photo.src}
                  alt={`Captured photo ${index + 1}`}
                  className="size-full object-cover"
                />
              ) : (
                <div className="text-muted-foreground flex size-full items-center justify-center font-mono text-xs">
                  {String(index + 1).padStart(2, "0")}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default CapturedPhotos;
