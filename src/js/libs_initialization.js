import 'lightgallery.js';
import SlimSelect from 'slim-select';
import flatpickr from 'flatpickr';
import { Russian } from 'flatpickr/dist/l10n/ru.js';
import Popbox from './modal';

if (document.querySelector('.ac-list')) {
  document.querySelectorAll('.ac-list').forEach((acc) => {
    // eslint-disable-next-line no-undef,no-new
    new Accordion(acc, {
      duration: 200,
      showMultiple: true,
    });
  });
}

if (document.querySelector('[data-js=select-type-1]')) {
  document.querySelectorAll('[data-js=select-type-1]').forEach((select) => {
    // eslint-disable-next-line no-undef
    const selectObj = new SlimSelect({
      select,
      showSearch: false,
    });

    const wrap = select.closest('.form-field-wrap');
    const label = wrap.querySelector('[data-js=label]');
    if (label) {
      label.addEventListener('click', () => {
        selectObj.open();
      });
    }
  });
}

if (document.querySelector('[data-js=slider-type-1]')) {
  document.querySelectorAll('[data-js=slider-type-1]').forEach((slider) => {
    // eslint-disable-next-line no-undef
    const sliderObj = tns({
      container: slider,
      controlsText: ['', ''],
      rewind: true,
      loop: false,
      mouseDrag: true,
      nav: true,
      navPosition: 'bottom',
      mode: 'gallery',
      gutter: 0,
      items: 1,
      slideBy: 1,
    });

    const sliderCountTemplate = slider.closest('[data-js=slider-wrap]').querySelector('[data-js=slider-count]');
    if (sliderCountTemplate) {
      let info = sliderObj.getInfo();
      if (info.slideCount > 1) {
        sliderCountTemplate.innerHTML = `<span class="text_blue">${info.index + 1} \\</span> ${info.slideCount}`;
        sliderObj.events.on('indexChanged', () => {
          info = sliderObj.getInfo();
          sliderCountTemplate.innerHTML = `<span class="text_blue">${info.index + 1} \\</span> ${info.slideCount}`;
        });
      }
    }
  });
}

if (document.querySelector('#place-s-map-container')) {
  // eslint-disable-next-line no-undef
  ymaps.ready(() => {
    // eslint-disable-next-line no-undef
    const map = new ymaps.Map('place-s-map-container', {
      center: [55.76, 37.64],
      zoom: 9,
      behaviors: ['drag', 'dblClickZoom', 'rightMouseButtonMagnifier', 'multiTouch'],
      controls: ['routePanelControl', 'zoomControl'],
    }, {
      searchControlProvider: 'yandex#search',
    });

    const routePanelControl = map.controls.get('routePanelControl');
    const { routePanel } = routePanelControl;

    routePanelControl.options.set({
      type: 'pedestrian',
      maxWidth: '250px',
      visible: true,
      autofocus: false,
      float: 'none',
      routingMode: 'pedestrian',
      position: {
        right: 0,
        top: (window.innerWidth > 751) ? 200 : 500,
      },
    });

    function getCoordsFromNode(node) {
      return node.getAttribute('data-coords').split(',').map((num) => parseFloat(num));
    }

    const toCoords = getCoordsFromNode(document.querySelector('[data-js=route-to]'));
    const fromRoutes = document.querySelectorAll('[data-js=route-from]');

    routePanel.state.set({
      type: 'pedestrian',
      fromEnabled: true,
      from: getCoordsFromNode(fromRoutes[0]),
      toEnabled: true,
      to: toCoords,
    });

    fromRoutes.forEach((fromRoute) => {
      fromRoute.addEventListener('click', () => {
        const fromCoords = getCoordsFromNode(fromRoute);

        fromRoutes.forEach((fromRouteInner) => {
          fromRouteInner.classList.remove('place-s-route__icon-n-name_active');
        });

        fromRoute.classList.add('place-s-route__icon-n-name_active');

        routePanel.state.set({
          from: fromCoords,
          to: toCoords,
        });
      });
    });
  });
}

window.addEventListener('load', () => {
  if (document.querySelector('[data-tabs]')) {
    const tabList = document.querySelectorAll('[data-tabs]');
    if (tabList) {
      tabList.forEach((tabs, i) => {
        tabs.setAttribute('data-tabs', i);
        // eslint-disable-next-line no-undef
        const tabsObj = Tabby(`[data-tabs="${i}"]`);

        // if no default specified then activate the first tab
        if (!tabs.querySelector('[data-tabby-default]')) {
          tabsObj.toggle(tabs.querySelector('a'));
        }
      });
    }
  }
});

document.querySelectorAll('[data-js=thumb-gallery]').forEach((thumbGallery) => {
  lightGallery(thumbGallery, {
    thumbnail: true,
    animateThumb: false,
    showThumbByDefault: false,
    mode: 'lg-fade',
    addClass: 'lg_fixed-size',
    counter: false,
  });
});

export const popbox = new Popbox();

const tooltip_triggers = document.querySelectorAll('[data-js=tooltip-trigger]');
tooltip_triggers.forEach((tooltip_trigger) => {
  const template = tooltip_trigger.querySelector('[data-js=tooltip-content]');
  tippy(tooltip_trigger, {
    content: template.innerHTML,
    allowHTML: true,
    placement: 'bottom-end',
    animation: 'shift-away',
    trigger: 'click',
    interactive: true,
  });
});

flatpickr.localize(Russian);
const datepickers = document.querySelectorAll('[data-js=datepicker_1]');
datepickers.forEach((datepicker) => {
  flatpickr(datepicker, {
    appendTo: datepicker.closest('.datepicker_1'),
    dateFormat: 'd.m.Y',
    maxDate: 'today',
    defaultDate: datepicker.getAttribute('data-default'),
    locale: {
      firstDayOfWeek: 1, // start week on Monday
    },
  });
});
