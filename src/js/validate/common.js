import { on } from 'delegated-events';
import { validate } from 'validate.js';
import { validateAndShowErrors, showErrorsForInput, resetForm } from './show_errors';
import getInputValue from '../helpers/get_form_value';
import constraints from './constraints';

on('submit', '[data-js=validate-form]', (e) => {
  const form = e.target;
  const errors = validateAndShowErrors(form, { scrollToFirstError: true });
  // console.log(validate.collectFormValues(form));
  if (validate.isEmpty(errors)) {
    form.submit();
  } else {
    e.preventDefault();
  }
});

let isSubmited = false;
on('submit', '[data-js=validate-ajax-form]', (e) => {
  e.preventDefault();
  const form = e.target;
  const submitBtn = form.querySelector('button[type=submit]');
  const errors = validateAndShowErrors(form, { scrollToFirstError: true });

  if (validate.isEmpty(errors) && !isSubmited) {
    isSubmited = true;
  } else {
    return;
  }

  submitBtn.disabled = true;
  const formData = new FormData(form);

  axios({
    method: 'post',
    url: form.action,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    data: formData,
  }).then((response) => {
    const resData = response.data;
    console.log(resData);

    if (resData.status === 'success') {
      Toastify({
        text: resData.message,
        duration: 3000,
        gravity: 'top',
        position: 'right',
        backgroundColor: 'linear-gradient(180deg, #2DBA65 0%, #2F9D5B 100%)',
        className: 'toast_1',
      }).showToast();
    } else {
      Toastify({
        text: 'Что-то пошло не так',
        duration: 3000,
        gravity: 'top',
        position: 'right',
        backgroundColor: 'linear-gradient(180deg, #CF2644 0%, #ba1432 100%)',
        className: 'toast_1',
      }).showToast();
    }
    isSubmited = false;
    submitBtn.disabled = false;
    resetForm(form);
  })
    .catch((error) => {
      console.log(error);
      Toastify({
        text: 'Что-то пошло не так',
        duration: 3000,
        gravity: 'top',
        position: 'right',
        backgroundColor: 'linear-gradient(180deg, #CF2644 0%, #ba1432 100%)',
        className: 'toast_1',
      }).showToast();
      isSubmited = false;
      submitBtn.disabled = false;
      resetForm(form);
    });
});

function validateElemAfterChange(elem) {
  const form = elem.closest('form');
  const validationType = elem.getAttribute('data-validate');

  const opts = {};
  if (elem.getAttribute('data-validate-option')) {
    opts.options = elem.getAttribute('data-validate-option');
  }

  const elemErrors = validate.single(getInputValue(elem), constraints[validationType], opts);
  const errors = {};
  if (elemErrors) {
    // eslint-disable-next-line prefer-destructuring
    errors[elem.name] = elemErrors[0];
  }

  showErrorsForInput(elem, errors && errors[elem.getAttribute('name')]);

  if (form) {
    const disabledBtn = form.querySelector('[data-js=disabled-btn]');
    if (disabledBtn) {
      const errorsAll = validateAndShowErrors(form, { showErrors: false });
      if (validate.isEmpty(errorsAll)) {
        disabledBtn.classList.remove('btn_disabled');
      } else {
        disabledBtn.classList.add('btn_disabled');
      }
    }
  }
}

on('change', '[data-validate]:not([disabled])', (e) => {
  const elem = e.target;
  validateElemAfterChange(elem);
});

on('input', '[data-validate]:not([disabled])', (e) => {
  const elem = e.target;
  if (elem.closest('.form-field-wrap').classList.contains('form-field-wrap_error')) {
    validateElemAfterChange(elem);
  }
});

export function recaptchaCallback() {
  validateElemAfterChange(document.querySelector('[data-validate=recaptcha]'));
}

document.querySelectorAll('[data-validate]').forEach((input) => {
  const inputCur = input;
  inputCur.required = false;
});
