import debounce from 'lodash.debounce';

import { isMobile, isTablet } from '../utils/_global';

function onResize() {
  window.checkIsMobile = window.matchMedia(`(max-width: ${isMobile})`).matches;
  window.checkIsTablet = window.matchMedia(`(max-width: ${isTablet})`).matches;
}


export default function initResizeEvent() {
  const debouncedResize = debounce(onResize, 250);
  window.addEventListener('resize', debouncedResize);
}
