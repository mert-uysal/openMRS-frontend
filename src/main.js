import Vue from 'vue'
import App from './App.vue'
import { router } from "./router";
import 'semantic-ui-css/semantic.min.css';
import SuiVue from 'semantic-ui-vue';

Vue.use(SuiVue);
Vue.config.productionTip = false

new Vue({
  el: '#app',
  render: h => h(App),
  router
});
