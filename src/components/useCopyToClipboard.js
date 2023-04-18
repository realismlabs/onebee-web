// useCopyToClipboard.js
import { useState, useCallback, useEffect } from 'react';
import copy from 'clipboard-copy';

export default function useCopyToClipboard() {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = useCallback((text) => {
    copy(text).then(() => {
      setIsCopied(true);
    });
  }, []);

  useEffect(() => {
    if (isCopied) {
      const timer = setTimeout(() => {
        setIsCopied(false);
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [isCopied]);

  return { isCopied, handleCopy };
}
