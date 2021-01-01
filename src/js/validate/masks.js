import IMask from 'imask';

const phoneInputs = document.querySelectorAll('[data-validate=phone]');
const maskOptions = {
  mask: '+{7} (000) 000 00 00',
};

phoneInputs.forEach((phoneInput) => {
  IMask(phoneInput, maskOptions);
});
