import { DOM } from './_global';

const detectMouse = e => {
  if (e.type === 'mousemove') {
    document.body.classList.add('no-touch')
  } else if (e.type === 'touchstart' && window.matchMedia('(max-width: 1024px)').matches) {
    document.body.classList.remove('no-touch')
  }
  // remove event bindings, so it only runs once
  DOM.$body.off('mousemove touchstart', detectMouse);
};
// attach both events to body
DOM.$body.on('mousemove touchstart', detectMouse);
