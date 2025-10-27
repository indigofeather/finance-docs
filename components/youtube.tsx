"use client";

type YouTubeProps = {
  id: string;
  title?: string;
  start?: number;
  className?: string;
};

export function YouTube({ id, title, start, className }: YouTubeProps) {
  const videoTitle = title ?? '';
  const query = new URLSearchParams({
    rel: '0',
    modestbranding: '1',
    playsinline: '1',
  });

  if (start) {
    query.set('start', String(start));
  }

  const src = `https://www.youtube.com/embed/${id}?${query.toString()}`;

  return (
    <div
      className={`group relative w-full overflow-hidden rounded-3xl border border-white/10 bg-black shadow-2xl shadow-black/30 ${className ?? ''}`}
      style={{ aspectRatio: '16 / 9' }}
    >
      <iframe
        src={src}
        title={videoTitle}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        loading="lazy"
        className="absolute inset-0 h-full w-full"
      />
      <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/70 via-black/40 to-transparent p-4 text-sm text-white/90">
        {videoTitle}
      </div>
    </div>
  );
}
