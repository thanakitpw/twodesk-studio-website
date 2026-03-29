'use client';

import { useState } from 'react';
import Image from 'next/image';
import Lightbox from './Lightbox';
import type { ImageGroup } from '@/lib/data';

interface ProjectGalleryProps {
  images: string[];
  imageGroups?: ImageGroup[];
  title: string;
}

export default function ProjectGallery({ images, imageGroups, title }: ProjectGalleryProps) {
  const [lightbox, setLightbox] = useState<{ images: string[]; index: number } | null>(null);
  const [activeGroup, setActiveGroup] = useState(0);

  const groups = imageGroups && imageGroups.length > 0 ? imageGroups : [{ label: 'All', images }];
  const allImages = groups.flatMap((g) => g.images);
  const currentGroup = groups[activeGroup];

  return (
    <>
      {/* Group Tabs */}
      {groups.length > 1 && (
        <div className="mb-6 flex gap-2">
          {groups.map((group, i) => (
            <button
              key={group.label}
              onClick={() => setActiveGroup(i)}
              className={`rounded-full border px-4 py-1.5 text-xs font-medium transition-colors ${
                activeGroup === i
                  ? 'border-[#1a1a1a] bg-[#1a1a1a] text-white'
                  : 'border-[#e5e5e5] bg-white text-[#666] hover:border-[#999]'
              }`}
            >
              {group.label}
              <span className="ml-1.5 text-[10px] opacity-60">{group.images.length}</span>
            </button>
          ))}
        </div>
      )}

      {/* Image Grid */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:gap-4">
        {currentGroup.images.map((img, i) => (
          <button
            key={img}
            onClick={() => setLightbox({ images: currentGroup.images, index: i })}
            className={`group relative cursor-pointer overflow-hidden rounded ${
              currentGroup.images.length % 2 !== 0 && i === currentGroup.images.length - 1
                ? 'aspect-[16/9] sm:col-span-2'
                : 'aspect-[4/3]'
            }`}
          >
            <Image
              src={img}
              alt={`${title} — ${currentGroup.label} ${i + 1}`}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
            <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/10" />
          </button>
        ))}
      </div>

      {/* Lightbox */}
      {lightbox && (
        <Lightbox
          images={lightbox.images}
          initialIndex={lightbox.index}
          onClose={() => setLightbox(null)}
        />
      )}
    </>
  );
}
