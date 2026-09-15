import { siteConfig } from '../config/siteConfig';

/**
 * Encodes a message and opens WhatsApp with pre-filled content.
 * @param {string} message - Unencoded string message to send.
 */
export const bookOnWhatsApp = (message, customNumber = null) => {
  if (!message) return;
  const num = customNumber || siteConfig.whatsappNumber || '917837175090';
  const encodedText = encodeURIComponent(message.trim());
  const whatsappUrl = `https://wa.me/${num}?text=${encodedText}`;
  window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
};
