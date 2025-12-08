import { useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface PropertyGalleryProps {
  images: string[];
  vipType?: string;
}

export function PropertyGallery({ images, vipType }: PropertyGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  const openViewer = (index: number) => {
    setCurrentIndex(index);
    setIsOpen(true);
  };

  const nextImage = () =>
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));

  const prevImage = () =>
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));

  return (
    <>
      {/* ẢNH TO */}
      <div className="relative w-full h-[260px] sm:h-[380px] md:h-[450px] lg:h-[500px] overflow-hidden rounded-lg shadow-sm cursor-pointer">
        <img
          src={images[currentIndex]}
          className="w-full h-full object-cover"
          onClick={() => openViewer(currentIndex)}
        />

        {/* VIP badge */}
        {vipType && (
          <span className="absolute top-4 left-4 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-md shadow">
            {vipType}
          </span>
        )}

        {/* Nút trái/phải */}
        <button
          onClick={prevImage}
          className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full"
        >
          <ChevronLeft />
        </button>

        <button
          onClick={nextImage}
          className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full"
        >
          <ChevronRight />
        </button>

        {/* Image count */}
        <div className="absolute bottom-3 right-3 bg-black/50 text-white text-xs px-2 py-1 rounded">
          {currentIndex + 1}/{images.length}
        </div>
      </div>

      {/* SLIDER ẢNH NHỎ */}
      <div className="flex gap-2 mt-3 overflow-x-auto no-scrollbar pb-1">
        {images.map((img, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={cn(
              "w-20 h-20 sm:w-24 sm:h-24 rounded-md overflow-hidden border-2 flex-shrink-0",
              currentIndex === index
                ? "border-primary"
                : "border-transparent opacity-70 hover:opacity-100"
            )}
          >
            <img src={img} className="w-full h-full object-cover" />
          </button>
        ))}
      </div>

      {/* FULLSCREEN IMAGE VIEWER */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-5xl p-0 bg-black/90 border-none">
          <div className="relative flex items-center justify-center min-h-[80vh]">
            {/* Close */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 bg-white/20 p-2 rounded-full hover:bg-white/40"
            >
              <X className="text-white" />
            </button>

            {/* Ảnh lớn */}
            <img
              src={images[currentIndex]}
              className="max-w-full max-h-[80vh] object-contain rounded-lg"
            />

            {/* Prev */}
            <button
              onClick={prevImage}
              className="absolute left-4 bg-white/20 hover:bg-white/40 text-white p-3 rounded-full"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Next */}
            <button
              onClick={nextImage}
              className="absolute right-4 bg-white/20 hover:bg-white/40 text-white p-3 rounded-full"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
