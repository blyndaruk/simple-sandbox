export const isMobile = '599px';
export const isTablet = '767px';

export const $window = $(window);

export const CLASSES = {
  isActive: 'is-active',
  isVisible: 'is-visible',
  isDisabled: 'is-disabled',
  isHidden: 'is-hidden',
  isFixed: 'is-fixed',
  isOpen: 'is-open',
  isError: 'is-error',
  isExpanded: 'is-expanded',
  isDarkMode: 'is-dark',
  isFooter: 'is-footer',
  modalOpened: 'is-modal-opened',
  isSticky: 'is-sticky',
  isOut: 'is-out',
  isHeaderOpen: 'is-header-open',
  isDropdownOpened: 'is-dropdown-opened',
  isZoomDisabled: 'is-zoom-disabled',
};

export const DOM = {
  body: document.querySelector('body'),
  $body: $('body'),
  html: document.querySelector('html'),
  $html: $('html'),
  window,
  $window: $(window),
  $header: $('.js-header'),
  $burger: $('.js-burger')
};


window.checkIsMobile = window.matchMedia(`(max-width: ${isMobile})`).matches;
window.viewportHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
