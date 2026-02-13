'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import Image from 'next/image';
import { getPublicPath } from '@/lib/paths';

interface CarouselImage {
  src: string;
  alt: string;
  caption?: string;
}

export default function Carousel() {
  const [images, setImages] = useState<CarouselImage[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(getPublicPath('/carousel.json'))
      .then(res => res.json())
      .then(data => {
        setImages(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error loading carousel data:", err);
        setLoading(false);
      });
  }, []);

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    })
  };

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity;
  };

  const paginate = (newDirection: number) => {
    setDirection(newDirection);
    setCurrentIndex((prevIndex) => {
      let nextIndex = prevIndex + newDirection;
      if (nextIndex < 0) nextIndex = images.length - 1;
      if (nextIndex >= images.length) nextIndex = 0;
      return nextIndex;
    });
  };

  if (loading || images.length === 0) return null;

  return (
    <div className="relative w-full h-[400px] md:h-[500px] overflow-hidden rounded-xl bg-gray-100 shadow-lg group">
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={currentIndex}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: "spring", stiffness: 300, damping: 30 },
            opacity: { duration: 0.2 }
          }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={1}
          onDragEnd={(e, { offset, velocity }) => {
            const swipe = swipePower(offset.x, velocity.x);

            if (swipe < -swipeConfidenceThreshold) {
              paginate(1);
            } else if (swipe > swipeConfidenceThreshold) {
              paginate(-1);
            }
          }}
          className="absolute w-full h-full flex items-center justify-center"
        >
          <div className="relative w-full h-full bg-urv-black/90">
            <Image
              src={getPublicPath(images[currentIndex].src)}
              alt={images[currentIndex].alt}
              fill
              className="object-cover"
              draggable={false}
            />
            {images[currentIndex].caption && (
               <div className="absolute bottom-8 left-0 right-0 p-4 bg-black/40 backdrop-blur-sm text-white text-center">
                 <p className="text-sm md:text-lg font-medium">{images[currentIndex].caption}</p>
               </div>
            )}
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="absolute inset-0 flex items-center justify-between p-4 pointer-events-none">
        <button
          className="p-2 rounded-full bg-white/80 text-urv-black hover:bg-white hover:text-urv-red transition-colors shadow-lg pointer-events-auto z-10 opacity-0 group-hover:opacity-100"
          onClick={() => paginate(-1)}
        >
          <FaChevronLeft size={20} />
        </button>
        <button
          className="p-2 rounded-full bg-white/80 text-urv-black hover:bg-white hover:text-urv-red transition-colors shadow-lg pointer-events-auto z-10 opacity-0 group-hover:opacity-100"
          onClick={() => paginate(1)}
        >
          <FaChevronRight size={20} />
        </button>
      </div>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {images.map((_, idx) => (
          <button
            key={idx}
            onClick={() => {
              setDirection(idx > currentIndex ? 1 : -1);
              setCurrentIndex(idx);
            }}
            className={`w-2 h-2 rounded-full transition-all ${
              idx === currentIndex ? 'bg-white w-4' : 'bg-white/50 hover:bg-white/80'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
