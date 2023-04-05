import { useMediaQuery } from '@react-hook/media-query';
import { useMemo } from 'react';

function useScreenSize() {
  const isSm = useMediaQuery('(min-width: 640px)');
  const isMd = useMediaQuery('(min-width: 768px)');
  const isLg = useMediaQuery('(min-width: 1024px)');

  const screen = useMemo(() => {
    if (isLg) {
      return 'lg';
    } else if (isMd) {
      return 'md';
    } else if (isSm) {
      return 'sm';
    } else {
      return 'xs';
    }
  }, [isLg, isMd, isSm]);

  return { isSm, isMd, isLg, screen };
}

export default useScreenSize;