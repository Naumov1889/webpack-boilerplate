import { on } from 'delegated-events';
import removeInnerHtml from '../helpers/dom';
// eslint-disable-next-line import/no-unresolved,import/no-webpack-loader-syntax
import iconEyeOpenSvg from '!!raw-loader!../../images/icons/icon-eye-open.svg';
// eslint-disable-next-line import/no-unresolved,import/no-webpack-loader-syntax
import iconEyeCloseSvg from '!!raw-loader!../../images/icons/icon-eye-close.svg';

on('click', '[data-js=pass-vis-btn]', (e) => {
  const btn = e.target.closest('[data-js=pass-vis-btn]');
  const wrap = btn.closest('.form-field-wrap');
  const input = wrap.querySelector('input');
  const isVisible = input.getAttribute('type') === 'text';

  removeInnerHtml(btn);
  if (isVisible) {
    btn.innerHTML = iconEyeOpenSvg;
    input.setAttribute('type', 'password');
  } else {
    btn.innerHTML = iconEyeCloseSvg;
    input.setAttribute('type', 'text');
  }
});
