import { validate } from 'validate.js';

validate.validators.presence.options = { message: '^Обязательное поле', allowEmpty: false };
validate.validators.recaptcha = () => {
  // eslint-disable-next-line no-undef
  if (grecaptcha && grecaptcha.getResponse().length !== 0) {
    return null;
  }
  return 'Обязательное поле';
};

validate.validators.extension = (value, options, key, attributes, globalOptions) => {
  if (value && globalOptions.options) {
    const allowedExtentions = globalOptions.options.split(',');
    const extension = value.split('.').pop();

    if (allowedExtentions.includes(extension)) {
      return null;
    }
    return 'Невалидный файл';
  }
  return null;
};

const constraints = {
  email: {
    presence: true,
    email: {
      message: '^Невалидный email',
    },
  },
  password: {
    presence: true,
    length: {
      minimum: 6,
      message: '^Минимум 6 символов',
    },
  },
  phone: {
    presence: true,
    format: {
      pattern: '^(\\+7|7|8)?[\\s\\-]?\\([0-9]{3}\\)?[\\s\\-]?[0-9]{3}[\\s\\-]?[0-9]{2}[\\s\\-]?[0-9]{2}$',
      message: '^Невалидный номер',
    },
  },
  presence: {
    presence: true,
  },
  checkbox: {
    presence: true,
    inclusion: {
      within: [true],
      message: '^Обязательное поле',
    },
  },
  recaptcha: {
    recaptcha: true,
  },
  file: {
    presence: {
      message: '^Загрузите файл',
      allowEmpty: false,
    },
    extension: {},
  },
};

export default constraints;
