import { validate as v } from 'validate.js';

function getInputValue(elem) {
  if (elem.tagName === 'INPUT' || elem.tagName === 'TEXTAREA') {
    const value = v.sanitizeFormValue(elem.value, { trim: true, nullify: true });
    if (elem.type === 'text' || elem.type === 'textarea') {
      return value;
    }
    if (elem.type === 'checkbox' || elem.type === 'radio') {
      if (elem.attributes.value) {
        if (!elem.checked) {
          const elem2 = elem.closest('form').querySelector(`[name=${elem.name}]:checked`);
          return elem2 ? v.sanitizeFormValue(elem2.value, { trim: true, nullify: true }) : null;
        }
        return value;
      }
      return elem.checked;
    }
    if (elem.type === 'number') {
      return value ? +value : null;
    }
  }

  if (elem.tagName === 'SELECT') {
    if (elem.multiple) {
      const value = [];
      Array.from(elem.options).forEach((option) => {
        if (option && option.selected) {
          value.push(v.sanitizeFormValue(option.value, { trim: true, nullify: true }));
        }
      });
      return value;
    }
    const val = typeof elem.options[elem.selectedIndex] !== 'undefined' ? elem.options[elem.selectedIndex].value : '';
    return v.sanitizeFormValue(val, { trim: true, nullify: true });
  }

  if (elem.value) {
    return v.sanitizeFormValue(elem.value, { trim: true, nullify: true });
  }
}

export default getInputValue;
