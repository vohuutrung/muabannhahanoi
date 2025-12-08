import { useState } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface VipDiamondGalleryProps {
  images: string[];
  vipType?: "VIP DIAMOND";
  onClick?: () => void;
}

export function VipDiamondGallery({ images, vipType = "VIP DIAMOND", onClick }: VipDiamondGalleryProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const displayImages = [...images];
  while (displayImages.length < 4) {
    displayImages.push(images[0] || "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80");
  }

  const openViewer = (index: number) => {
    setCurrentIndex(index);
    setIsOpen(true);
  };

  return (
    <>
      <div className="rounded-[10px] shadow-md overflow-hidden bg-card p-1 cursor-pointer"
           onClick={onClick}>
        
        {/* Ảnh lớn phía trên */}
        <div className="relative w-full h-[220px] mb-1">
          <img
            src={displayImages[0]}
            className="w-full h-full object-cover rounded-lg"
            onClick={(e) => { e.stopPropagation(); openViewer(0); }}
          />

          <span className="absolute top-3 left-3 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-md">
            {vipType}
          </span>
        </div>

        {/* 3 ảnh nhỏ dưới */}
        <div className="grid grid-cols-3 gap-1">
          {displayImages.slice(1, 4).map((img, index) => (
            <img
              key={index}
              src={img}
              className="w-full h-[100px] object-cover rounded-md"
              onClick={(e) => { e.stopPropagation(); openViewer(index + 1); }}
            />
          ))}
        </div>
      </div>

      {/* Modal xem ảnh */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-4xl p-0 bg-background border-none">
          <div className="relative">

            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 z-10 w-10 h-10 bg-background/80 rounded-full flex items-center justify-center"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="relative flex items-center justify-center min-h-[400px]">
              <img
                src={displayImages[currentIndex]}
                className="max-w-full max-h-[80vh] object-contain rounded-lg"
              />

              <button onClick={() => setCurrentIndex(prev => prev === 0 ? 3 : prev - 1)}
                      className="absolute left-4 w-12 h-12 bg-background/80 rounded-full flex items-center justify-center">
                <ChevronLeft className="w-6 h-6" />
              </button>

              <button onClick={() => setCurrentIndex(prev => prev === 3 ? 0 : prev + 1)}
                      className="absolute right-4 w-12 h-12 bg-background/80 rounded-full flex items-center justify-center">
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

