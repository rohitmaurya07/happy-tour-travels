import React, { useEffect } from 'react';
import { Lock, CreditCard } from 'lucide-react';

export const SHOW_PAYMENT_OVERLAY = false;

// Custom image path (e.g. QR code, payment scanner, or logo)
export const OVERLAY_IMAGE_URL = '/assets/images/image.png';

export default function PaymentLockOverlay({
  enabled = SHOW_PAYMENT_OVERLAY,
  imageUrl = OVERLAY_IMAGE_URL,
  message = "Make payment to access the website"
}) {
  useEffect(() => {
    if (enabled) {
      // Completely disable background scrolling
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      
      return () => {
        document.body.style.overflow = originalOverflow || 'unset';
      };
    }
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div 
      className="fixed inset-0 z-[999999] bg-slate-950/95 backdrop-blur-2xl flex flex-col items-center justify-center p-4 sm:p-6 text-center select-none overflow-hidden touch-none"
      style={{ pointerEvents: 'auto' }}
      onContextMenu={(e) => e.preventDefault()}
    >
      <div className="max-w-md w-full bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col items-center animate-fadeIn relative">


        {/* Display Image (e.g. Payment Scanner / QR Code / Logo) */}
        {imageUrl && (
          <div className="w-full max-w-[240px] aspect-square rounded-2xl overflow-hidden bg-white p-3 border-2 border-amber-400/40 shadow-2xl mb-6 flex items-center justify-center">
            <img 
              src={imageUrl} 
              alt="Payment Required" 
              className="w-full h-full object-contain rounded-xl"
            />
          </div>
        )}

        {/* Primary Required Text */}
        <h2 className="text-xl sm:text-2xl font-thin font-nexa text-white tracking-tight leading-snug">
          {message}
        </h2>

        {/* Sub-text */}
        <p className="text-xs sm:text-sm text-gray-300 mt-3  leading-relaxed">
          Access to this website is currently restricted. Please complete the required payment to get access.
        </p>

        {/* Status Tag */}
        <div className="mt-6 flex items-center space-x-2 text-[11px] font-semibold text-white  px-3.5 py-1.5 rounded-full">
          <CreditCard className="w-3.5 h-3.5" />
          <span>Payment Required</span>
        </div>

      </div>
    </div>
  );
}
