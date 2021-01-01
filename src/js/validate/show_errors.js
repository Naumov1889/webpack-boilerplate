import { validate } from 'validate.js';
import removeInnerHtml from '../helpers/dom';
import getInputValue from '../helpers/get_form_value';
import { clearFormFileBlock } from '../ticket/helpers';
import constraints from './constraints';

export function resetFormGroup(formGroup) {
  formGroup.classList.remove('form-field-wrap_error');
  formGroup.classList.remove('form-field-wrap_success');
  removeInnerHtml(formGroup.querySelector('.form-field__help-block-list'));
}

export function resetForm(form) {
  form.reset();
  const formGroups = form.querySelectorAll('.form-field-wrap');
  formGroups.forEach((formGroup) => {
    resetFormGroup(formGroup);
    clearFormFileBlock(formGroup);
  });
}

function addError(messages, error) {
  const block = document.createElement('p');
  block.classList.add('help-block');
  block.classList.add('error');
  block.innerText = error;
  messages.appendChild(block);
}

export function showErrorsForInput(input, errors) {
  const formGroup = input.closest('.form-field-wrap');
  if (formGroup) {
    const messagesTemplate = formGroup.querySelector('.form-field__help-block-list');
    resetFormGroup(formGroup);

    if (errors) {
      formGroup.classList.add('form-field-wrap_error');
      addError(messagesTemplate, errors);
    } else {
      formGroup.classList.add('form-field-wrap_success');
    }
  }
}

function isVisible(e) {
  return !!(e.offsetWidth || e.offsetHeight || e.getClientRects().length);
}

export function validateAndShowErrors(form, {
  scrollToFirstError = false,
  showErrors = true,
  validateVisibleOnly = false,
}) {
  const errors = {};
  const elemsToValidate = form.querySelectorAll('[data-validate]:not([disabled])');
  let isFirstErrorSelected = false;
  let firstElemWithError;
  elemsToValidate.forEach((elem) => {
    if (validateVisibleOnly) {
      if (!isVisible(elem)) {
        return;
      }
    }

    const validationType = elem.getAttribute('data-validate');

    const opts = {};
    if (elem.getAttribute('data-validate-option')) {
      opts.options = elem.getAttribute('data-validate-option');
    }

    const elemErrors = validate.single(getInputValue(elem), constraints[validationType], opts);
    if (elemErrors) {
      // eslint-disable-next-line prefer-destructuring
      errors[elem.getAttribute('name')] = elemErrors[0];
      if (!isFirstErrorSelected) {
        isFirstErrorSelected = true;
        firstElemWithError = elem;
      }
    }
    if (showErrors) {
      showErrorsForInput(elem, errors && errors[elem.getAttribute('name')]);
    }
  });

  if (scrollToFirstError && firstElemWithError) {
    elemsToValidate[0].closest('.form-field-wrap').scrollIntoView();
  }

  return errors;
}
