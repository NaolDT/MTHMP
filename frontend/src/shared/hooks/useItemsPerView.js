import { useEffect, useState } from 'react';

export function useItemsPerView() {
  const [itemsPerView, setItemsPerView] = useState(1);

  useEffect(() => {
    const mdQuery = window.matchMedia('(min-width: 640px)');
    const lgQuery = window.matchMedia('(min-width: 1024px)');

    function update() {
      if (lgQuery.matches) setItemsPerView(3);
      else if (mdQuery.matches) setItemsPerView(2);
      else setItemsPerView(1);
    }

    update();
    mdQuery.addEventListener('change', update);
    lgQuery.addEventListener('change', update);
    return () => {
      mdQuery.removeEventListener('change', update);
      lgQuery.removeEventListener('change', update);
    };
  }, []);

  return itemsPerView;
}