import type { StrapiApp } from '@strapi/strapi/admin';

export default {
  config: {
    locales: [
      // 'ar',
      // 'fr',
      // 'cs',
      // 'de',
      // 'dk',
      // 'es',
      // 'he',
      // 'id',
      // 'it',
      // 'ja',
      // 'ko',
      // 'ms',
      // 'nl',
      // 'no',
      // 'pl',
      // 'pt-BR',
      // 'pt',
      // 'ru',
      // 'sk',
      // 'sv',
      // 'th',
      // 'tr',
      // 'uk',
      // 'vi',
      'zh-Hans',
      // 'zh',
    ],
  },
  bootstrap(app: StrapiApp) {
    console.log(app);
  },
  // fbb027acc2f94124836c799cb2b7c6c5f82ad95953e34890ccea4dd319e65d8b91c2c3174bad1e4bd0fe62f06bd70e41d821f7bb2d2ee5ede7f740a53e7421a85a75a82b47f1b6ede25504eb8cf576035e49dfa32601390dc38d8b6f9b3c548a9358870cc93d323956d13b4782bf3e3a8347e8b8f96c8bfb76f103a0d579ef4a
};
