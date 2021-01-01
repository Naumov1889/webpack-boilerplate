import { on } from 'delegated-events';
import autosizeTextarea from './helpers/autosizeTextarea';
import getInputValue from './helpers/get_form_value';

on('click', '[data-js=header-burger]', (e) => {
  const btn = e.target.closest('[data-js=header-burger]');
  btn.querySelector('[data-js=burger]').classList.toggle('burger_active');
  document.querySelector('[data-js=header-hav]').classList.toggle('header-nav_active');
  document.querySelector('body').classList.toggle('body_fixed');
});

on('change', '[data-js-org_type]', (e) => {
  const { value } = e.target;
  const isFormThirty = orgTypes[parseInt(value)];
  if (isFormThirty === 'True') {
    document.querySelector('[data-js=form_thirty_true]').checked = true;
    document.querySelector('[data-js=form_thirty-block]').style.display = 'none';
  } else if (isFormThirty === 'False') {
    document.querySelector('[data-js=form_thirty_false]').checked = true;
    document.querySelector('[data-js=form_thirty-block]').style.display = 'none';
  } else {
    document.querySelector('[data-js=form_thirty_true]').checked = false;
    document.querySelector('[data-js=form_thirty_false]').checked = false;
    document.querySelector('[data-js=form_thirty-block]').style.display = 'block';
  }
});

document.querySelectorAll('textarea').forEach((textarea) => {
  autosizeTextarea(textarea);
});

on('keydown', 'textarea', (e) => {
  autosizeTextarea(e.target);
});

on('change', '[data-js=form-update-on-change] *', (e) => {
  const elem = e.target;
  const should_hold = elem.getAttribute('data-form-update-on-change-hold');
  if (should_hold && getInputValue(elem)) {
    return;
  }
  const form = elem.closest('[data-js=form-update-on-change]');
  form.submit();
})