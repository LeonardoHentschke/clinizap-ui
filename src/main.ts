import { createApp } from 'vue';
import './assets/index.scss';
import ExpertsUi from '@clinicaexperts/experts-ui'; // Adjust the path accordingly
import App from './App.vue';
import router from './router';

const app = createApp(App);

app.use(ExpertsUi, {
  i18n: {
    locale: import.meta.env.VITE_VUE_APP_I18N_LOCALE,
    fallbackLocale: import.meta.env.VITE_VUE_APP_I18N_FALLBACK_LOCALE,
    messages: {
      'pt-BR': {
        validations: {
          custom: 'Erro customizado Default',
        },
      },
    },
  },
  config: {
    defaultCountry: 'br',
  },
});

app.use(router);

app.mount('#app');
