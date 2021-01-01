import { on } from 'delegated-events';
import removeInnerHtml from './helpers/dom';
import {
  filenameboxTemplate, placeholderTemplate, getFileName, getFileExtension,
} from './ticket/helpers';

on('change', 'input[type=file]', (e) => {
  const input = e.target;
  const filename = getFileName(input.value);
  const extension = getFileExtension(input.value);
  const label = input.parentNode.querySelector('label');
  const placeholderText = input.getAttribute('placeholder');
  const content = label.querySelector('.filebox__content');

  removeInnerHtml(content);
  if (filename) {
    input.setAttribute('data-disabled', 'true');
    content.innerHTML = filenameboxTemplate(filename, extension);
  } else {
    content.innerHTML = placeholderTemplate(placeholderText);
  }
});

// Firefox bug fix
on('focus', 'input[type=file]', (e) => {
  e.target.classList.add('has-focus');
});

on('blur', 'input[type=file]', (e) => {
  e.target.classList.remove('has-focus');
});
