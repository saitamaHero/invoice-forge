import { createApp } from "vue";
import "./style.css";
import "@mdi/font/css/materialdesignicons.css";
import App from "./App.vue";
import i18n from "./i18n";


// Vuetify
//TODO move Vuetify to its own file
import "vuetify/styles";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import { VDateInput } from "vuetify/labs/VDateInput";
import { createVueI18nAdapter } from "vuetify/locale/adapters/vue-i18n";
import { useI18n, type I18n } from "vue-i18n";

const vuetify = createVuetify({
  components: {
    ...components,
    VDateInput,
  },
  directives,
  locale: {
    adapter: createVueI18nAdapter({ i18n: i18n as I18n<any, any>, useI18n }),
  },
});

createApp(App).use(vuetify).use(i18n).mount("#app");
