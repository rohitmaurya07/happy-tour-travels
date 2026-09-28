import { useEffect, useState } from 'react';

const isEditableElement = (element) =>
  element instanceof HTMLElement &&
  (element.isContentEditable ||
    ['INPUT', 'TEXTAREA', 'SELECT'].includes(element.tagName)) &&
  !element.hasAttribute('readonly') &&
  !element.hasAttribute('disabled');

export default function useMobileKeyboard() {
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);

  useEffect(() => {
    const updateKeyboardState = () => {
      const activeElement = document.activeElement;
      const hasEditableFocus = isEditableElement(activeElement);
      const viewport = window.visualViewport;
      const viewportIsReduced = viewport && viewport.height < window.innerHeight - 120;
      const isMobile = window.matchMedia('(pointer: coarse)').matches;

      setIsKeyboardOpen(Boolean(viewportIsReduced || (isMobile && hasEditableFocus)));
    };

    const handleFocusOut = () => window.setTimeout(updateKeyboardState, 100);
    const viewport = window.visualViewport;

    document.addEventListener('focusin', updateKeyboardState);
    document.addEventListener('focusout', handleFocusOut);
    window.addEventListener('resize', updateKeyboardState);
    viewport?.addEventListener('resize', updateKeyboardState);
    updateKeyboardState();

    return () => {
      document.removeEventListener('focusin', updateKeyboardState);
      document.removeEventListener('focusout', handleFocusOut);
      window.removeEventListener('resize', updateKeyboardState);
      viewport?.removeEventListener('resize', updateKeyboardState);
    };
  }, []);

  return isKeyboardOpen;
}