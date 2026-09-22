import React, { useState } from 'react';
import { Maximize2, X, ChevronLeft, ChevronRight } from 'lucide-react';

interface VehicleGalleryProps {
  images: string[];
  vehicleTitle: string;
}

export const VehicleGallery: React.FC<VehicleGalleryProps> = ({ images, vehicleTitle }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const displayImages = images && images.length > 0 ? images : [
    'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1600&q=85'
  ];

  const handlePrev = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setActiveIndex((prev) => (prev === 0 ? displayImages.length - 1 : prev - 1));
  };

  const handleNext = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setActiveIndex((prev) => (prev === displayImages.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="space-y-3">
      {/* Main Large Image Container */}
      <div className="relative aspect-[16/10] bg-black rounded-sm overflow-hidden border border-white/10 group">
        <img
          src={displayImages[activeIndex]}
          alt={`${vehicleTitle} - Angle ${activeIndex + 1}`}
          className="w-full h-full object-cover transition-opacity duration-300"
        />

        {/* Fullscreen Button */}
        <button
          onClick={() => setIsFullscreen(true)}
          className="absolute top-4 right-4 p-2 rounded bg-black/60 hover:bg-black/80 text-white backdrop-blur-md border border-white/15 transition-all opacity-80 hover:opacity-100"
          title="View Fullscreen Gallery"
        >
          <Maximize2 className="w-4 h-4" />
        </button>

        {/* Image Counter Badge */}
        <div className="absolute bottom-4 left-4 px-2.5 py-1 rounded bg-black/60 backdrop-blur-md border border-white/15 text-xs text-white font-mono">
          {activeIndex + 1} / {displayImages.length}
        </div>

        {/* Arrows on Main Image (if multiple images) */}
        {displayImages.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 hover:bg-black/80 text-white backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity border border-white/10"
              aria-label="Previous Photo"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 hover:bg-black/80 text-white backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity border border-white/10"
              aria-label="Next Photo"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}
      </div>

      {/* Thumbnails Row */}
      {displayImages.length > 1 && (
        <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
          {displayImages.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIndex(idx)}
              className={`relative aspect-[16/10] rounded-sm overflow-hidden border transition-all ${
                idx === activeIndex
                  ? 'border-red-600 ring-2 ring-red-600/40 opacity-100'
                  : 'border-white/10 opacity-60 hover:opacity-100'
              }`}
            >
              <img
                src={img}
                alt={`Thumbnail ${idx + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Fullscreen Lightbox Modal */}
      {isFullscreen && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex flex-col justify-between p-4 sm:p-8 backdrop-blur-md"
          onClick={() => setIsFullscreen(false)}
        >
          {/* Lightbox Header */}
          <div className="flex items-center justify-between text-white" onClick={(e) => e.stopPropagation()}>
            <div>
              <h4 className="font-heading text-lg font-bold">{vehicleTitle}</h4>
              <p className="text-xs text-slate-400">High-Resolution Studio Photo {activeIndex + 1} of {displayImages.length}</p>
            </div>
            <button
              onClick={() => setIsFullscreen(false)}
              className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Main Lightbox Image */}
          <div
            className="relative flex-1 flex items-center justify-center max-h-[80vh] my-4"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={displayImages[activeIndex]}
              alt={`${vehicleTitle} Fullscreen`}
              className="max-h-full max-w-full object-contain rounded shadow-2xl"
            />

            {displayImages.length > 1 && (
              <>
                <button
                  onClick={handlePrev}
                  className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/60 hover:bg-black/90 text-white border border-white/20 transition-transform active:scale-95"
                >
                  <ChevronLeft className="w-8 h-8" />
                </button>
                <button
                  onClick={handleNext}
                  className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/60 hover:bg-black/90 text-white border border-white/20 transition-transform active:scale-95"
                >
                  <ChevronRight className="w-8 h-8" />
                </button>
              </>
            )}
          </div>

          {/* Lightbox Footer Thumbnails */}
          <div
            className="flex items-center justify-center gap-2 overflow-x-auto py-2"
            onClick={(e) => e.stopPropagation()}
          >
            {displayImages.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveIndex(idx)}
                className={`w-16 sm:w-24 aspect-[16/10] shrink-0 rounded overflow-hidden border transition-all ${
                  idx === activeIndex
                    ? 'border-red-500 ring-2 ring-red-500'
                    : 'border-white/20 opacity-50 hover:opacity-90'
                }`}
              >
                <img src={img} alt="Thumb" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
