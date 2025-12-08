import { useState } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface PropertyGalleryProps {
  images: string[];
  vipType?: string;
}

export function PropertyGallery({ images, vipType = "VIP DIAMOND" }: PropertyGalleryProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Ensure we have at least 4 images, use placeholders if not
  const displayImages = [...images];
  while (displayImages.length < 4) {
    displayImages.push(images[0] || "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80");
  }

  const openViewer = (index: number) => {
    setCurrentIndex(index);
    setIsOpen(true);
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? displayImages.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === displayImages.length - 1 ? 0 : prev + 1));
  };

  return (
    <>
      {/* Gallery Container */}
      <div className="rounded-[10px] shadow-md overflow-hidden bg-card">
        <div className="flex flex-col gap-1 p-1">
          {/* Large Image */}
          <div className="relative">
            <img
              src={displayImages[0]}
              alt="Property main image"
              className="w-full h-[300px] md:h-[400px] object-cover rounded-lg cursor-pointer transition-transform hover:scale-[1.01]"
              onClick={() => openViewer(0)}
            />
            {/* VIP Badge */}
            <span className="absolute top-3 left-3 bg-destructive text-destructive-foreground text-xs font-bold px-2 py-1 rounded-md">
              {vipType}
            </span>
          </div>

          {/* 3 Smaller Images */}
          <div className="grid grid-cols-3 gap-1">
            {displayImages.slice(1, 4).map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`Property image ${index + 2}`}
                className="w-full h-24 md:h-32 object-cover rounded-lg cursor-pointer transition-transform hover:scale-[1.02]"
                onClick={() => openViewer(index + 1)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Image Viewer Modal */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-4xl p-0 bg-background/95 backdrop-blur-sm border-none">
          <div className="relative">
            {/* Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 z-10 w-10 h-10 bg-background/80 rounded-full flex items-center justify-center hover:bg-background transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Main Image */}
            <div className="relative flex items-center justify-center min-h-[400px] md:min-h-[500px]">
              <img
                src={displayImages[currentIndex]}
                alt={`Property image ${currentIndex + 1}`}
                className="max-w-full max-h-[80vh] object-contain rounded-lg"
              />

              {/* Navigation Arrows */}
              <button
                onClick={goToPrevious}
                className="absolute left-4 w-12 h-12 bg-background/80 rounded-full flex items-center justify-center hover:bg-background transition-colors"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={goToNext}
                className="absolute right-4 w-12 h-12 bg-background/80 rounded-full flex items-center justify-center hover:bg-background transition-colors"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>

            {/* Image Counter */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-background/80 px-4 py-2 rounded-full text-sm font-medium">
              {currentIndex + 1} / {displayImages.length}
            </div>

            {/* Thumbnails */}
            <div className="flex gap-2 justify-center p-4 overflow-x-auto">
              {displayImages.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={cn(
                    "w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-all",
                    currentIndex === index
                      ? "border-primary ring-2 ring-primary/30"
                      : "border-transparent opacity-60 hover:opacity-100"
                  )}
                >
                  <img
                    src={image}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
