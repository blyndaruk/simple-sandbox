import { CLASSES, DOM } from './_global';

const { modalOpened } = CLASSES;

export default class Utility {

  static addBodyHidden() {
    sessionStorage.scrollTop = DOM.$window.scrollTop();
    DOM.$body.addClass(modalOpened);
    DOM.$body.css('top', `${-sessionStorage.scrollTop}px`);
    DOM.$body.css('margin-left', `-${ Utility.getScrollbarWidth() / 2 }px`); // TODO: Has to be tested more properly
    DOM.$burger.css('margin-right', `${ Utility.getScrollbarWidth() }px`); // TODO: Has to be tested more properly
  };

  static removeBodyHidden() {
    DOM.$body.removeClass(modalOpened);
    const bodyFromTop = parseInt(DOM.$body.css('top'), 10) * -1;
    DOM.$burger.css('margin-right', 0);
    if (bodyFromTop === 0) return;
    DOM.$window.scrollTop(bodyFromTop);
    DOM.$body.css('top', 0);
    DOM.$body.css('margin-left', 0);
    window.scrollTo(0, sessionStorage.scrollTop);
  }

  static getScrollbarWidth() {

    // Creating invisible container
    const outer = document.createElement('div');
    outer.style.visibility = 'hidden';
    outer.style.overflow = 'scroll'; // forcing scrollbar to appear
    outer.style.msOverflowStyle = 'scrollbar'; // needed for WinJS apps
    document.body.appendChild(outer);

    // Creating inner element and placing it in the container
    const inner = document.createElement('div');
    outer.appendChild(inner);

    // Calculating difference between container's full width and the child width
    const scrollbarWidth = (outer.offsetWidth - inner.offsetWidth);

    // Removing temporary elements from the DOM
    outer.parentNode.removeChild(outer);

    return scrollbarWidth;

  }

  static getElemHeight(elem) {
    return $(elem).outerHeight();
  };

}
