import React, { useState, useEffect, useMemo } from 'react';
import { Image as ImageIcon, Sparkles, Tag, Maximize2 } from 'lucide-react';
import api from '../services/api';
import { GalleryLightbox } from '../components/gallery/GalleryLightbox';

const GALLERY_CATEGORIES = [
  'ALL',
  'Café',
  'Bakery',
  'Food',
  'Drinks',
  'Ambience',
  'Exterior',
];

export const GalleryPage = () => {
  const [images, setImages] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [isLoading, setIsLoading] = useState(true);

  // Lightbox state
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        setIsLoading(true);
        const res = await api.get('/gallery');
        if (res.data.success) {
          setImages(res.data.data || []);
        }
      } catch (err) {
        console.error('Error fetching gallery:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGallery();
  }, []);

  const filteredImages = useMemo(() => {
    if (selectedCategory === 'ALL') return images;
    return images.filter(
      (img) => img.category?.toLowerCase() === selectedCategory.toLowerCase()
    );
  }, [images, selectedCategory]);

  const openLightbox = (index) => {
    setCurrentIndex(index);
    setLightboxOpen(true);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % filteredImages.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + filteredImages.length) % filteredImages.length);
  };

  return (
    <div className="pt-24 pb-20">
      
      {/* Header Banner */}
      <section className="bg-charcoal-950 text-white py-16 px-4 sm:px-6 lg:px-8 text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto relative z-10">
          <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-cafeYellow-400 bg-white/10 px-3.5 py-1.5 rounded-full border border-white/20 mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Visual Tour</span>
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white mb-4">
            Photo Gallery
          </h1>
          <p className="text-cream-200 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            Glimpses of our freshly stocked display counters, welcoming seating space, Carmel View exterior, and everyday café moments.
          </p>
        </div>
      </section>

      {/* Category Pills Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-20">
        <div className="bg-white rounded-2xl shadow-warm-xl border border-coffee-200 p-3 sm:p-4 flex items-center justify-center gap-2 overflow-x-auto no-scrollbar">
          {GALLERY_CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-burgundy-700 text-white shadow-sm'
                  : 'bg-cream-100 text-charcoal-700 hover:bg-cream-200'
              }`}
            >
              {cat === 'ALL' ? 'All Photos' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Gallery Masonry / Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div
                key={n}
                className="aspect-square bg-cream-200 rounded-2xl animate-pulse"
              ></div>
            ))}
          </div>
        ) : filteredImages.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredImages.map((img, index) => (
              <div
                key={img._id || img.id || index}
                onClick={() => openLightbox(index)}
                className="group relative rounded-2xl overflow-hidden border border-coffee-200/80 shadow-warm hover:shadow-warm-xl transition-all duration-300 cursor-pointer aspect-[4/3] bg-cream-100"
              >
                <img
                  src={img.url || img.imageUrl}
                  alt={img.altText || img.caption || 'Village Cafe Photo'}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.src = '/uploads/village_counter.jpg';
                  }}
                />

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-charcoal-950/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-5 text-white">
                  <div className="flex justify-end">
                    <span className="p-2 bg-white/20 rounded-full backdrop-blur-sm">
                      <Maximize2 className="w-4 h-4 text-white" />
                    </span>
                  </div>

                  <div>
                    {img.category && (
                      <span className="text-[10px] font-bold uppercase tracking-wider text-cafeYellow-400 bg-black/40 px-2.5 py-1 rounded-full backdrop-blur-sm inline-block mb-1.5">
                        {img.category}
                      </span>
                    )}
                    {img.caption && (
                      <p className="font-serif text-sm sm:text-base font-semibold leading-snug line-clamp-2">
                        {img.caption}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border border-coffee-200 max-w-md mx-auto p-8 shadow-warm">
            <ImageIcon className="w-12 h-12 text-coffee-400 mx-auto mb-3" />
            <h3 className="font-serif text-lg font-bold text-charcoal-900 mb-1">
              No photos in this category yet
            </h3>
            <p className="text-xs text-charcoal-600 mb-4">
              Select another category to view photos of Village Cafe.
            </p>
            <button
              onClick={() => setSelectedCategory('ALL')}
              className="px-4 py-2 rounded-full bg-burgundy-700 text-white text-xs font-semibold"
            >
              View All Photos
            </button>
          </div>
        )}
      </section>

      {/* Lightbox Modal */}
      <GalleryLightbox
        images={filteredImages}
        currentIndex={currentIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        onNext={handleNext}
        onPrev={handlePrev}
      />

    </div>
  );
};
