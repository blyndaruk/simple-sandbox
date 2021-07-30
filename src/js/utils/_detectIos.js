import { DOM } from './_global';

export default function detectIos() {
  if (navigator.userAgent.match(/(iPad|iPhone|iPod)/i)) {
    DOM.$html.addClass('is-ios');
  }
}
