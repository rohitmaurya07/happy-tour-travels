import React from 'react';
import { Star } from 'lucide-react';
import BookingForm from './BookingForm';
import { useSiteData } from '../context/SiteDataContext';

export default function Hero({ onSearch }) {
  const { mediaSettings } = useSiteData();

  const heroVideo = mediaSettings?.heroVideoUrl || '/assets/herovideo.mp4';
  const heroTitle = mediaSettings?.heroTitle || 'Safe, Reliable and Comfortable Taxi Services.';
  const highlightedWord = mediaSettings?.heroHighlightedWord || 'Taxi Services.';
  const heroSubtitle = mediaSettings?.heroSubtitle || 'Across North India, wherever your journey takes you.';
  const trustBadge = mediaSettings?.trustBadgeText || 'Best  Taxi Service in North India';

  // Format title with highlighted word in brand yellow
  const renderHeroTitle = () => {
    if (highlightedWord && heroTitle.includes(highlightedWord)) {
      const parts = heroTitle.split(highlightedWord);
      return (
        <>
          {parts[0]}
          <br />
          <span className="text-brand-yellow">{highlightedWord}</span>
          {parts[1]}
        </>
      );
    }
    return heroTitle;
  };

  return (
    <section id="home" className="relative min-h-[100dvh]  sm:pt-32 pb-14 sm:pb-20 flex flex-col justify-center items-center bg-slate-950 text-white overflow-hidden">
      
      {/* Hero Background Video & Dark Overlay */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <video
          key={heroVideo}
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover scale-105 filter brightness-[0.65] contrast-110"
        >
          <source src={heroVideo} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        
        {/* Dark Overlay for optimal text & form readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-slate-950/70" />
      </div>

      {/* Main Hero Centered Content */}
      <div className="relative z-10 w-full max-w-5xl mx-auto px-3 sm:px-6 lg:px-8 text-center my-auto flex flex-col items-center justify-center">
        
       

        {/* Clean Hero Title */}
        <h1 className="text-2xl mt-20 sm:text-4xl lg:text-5xl font-nexa tracking-tight font-heading leading-tight drop-shadow-md max-w-4xl">
          {renderHeroTitle()}
        </h1>

        {/* Supporting Text */}
        <p className="mt-2.5 text-xs sm:text-base md:text-lg text-gray-200 max-w-2xl font-medium drop-shadow-sm px-2">
          {heroSubtitle}
        </p>

        {/* Search Form Centered Prominently */}
        <div className="w-full mt-4 sm:mt-7">
          <BookingForm onSearch={onSearch} />
        </div>

      </div>
      
    </section>
  );
}

