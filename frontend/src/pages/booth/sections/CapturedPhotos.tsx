import type { Photo } from "@/types/booth";

interface Props {
  limit: number;
  photos: Photo[];
}

function CapturedPhotos({ limit, photos }: Props) {
  return (
    <aside className="grid shrink-0 grid-cols-4 gap-2 sm:gap-3 md:max-h-full md:w-28 md:grid-cols-1 md:overflow-y-auto lg:w-40">
      {Array.from({ length: limit }).map((_, index) => {
        const photo = photos[index];

        return (
          <div
            key={index}
            className="bg-secondary border-border relative flex aspect-4/3 min-w-0 items-center justify-center overflow-hidden rounded-md border-2 border-dashed"
          >
            {photo ? (
              <img
                src={photo.src}
                alt={`Captured photo ${index + 1}`}
                className="size-full object-cover"
              />
            ) : (
              <span className="text-muted-foreground font-mono text-xs">
                {String(index + 1).padStart(2, "0")}
              </span>
            )}
          </div>
        );
      })}
    </aside>
  );
}

export default CapturedPhotos;
