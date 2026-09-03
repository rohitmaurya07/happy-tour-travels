import { siteConfig } from '../config/siteConfig';

/**
 * Encodes a message and opens WhatsApp with pre-filled content.
 * @param {string} message - Unencoded string message to send.
 */
export const bookOnWhatsApp = (message) => {
  if (!message) return;
  const encodedText = encodeURIComponent(message.trim());
  const whatsappUrl = `https://wa.me/${siteConfig.whatsappNumber}?text=${encodedText}`;
  window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
};
