import Vue from 'vue'
import App from './App.vue'
import { router } from "./router";
import 'semantic-ui-css/semantic.min.css';
import SuiVue from 'semantic-ui-vue';
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue';
import Dropdown from "vue-simple-search-dropdown";
// Import Bootstrap an BootstrapVue CSS files (order is important)
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

// Make BootstrapVue available throughout your project
Vue.use(BootstrapVue)
// Optionally install the BootstrapVue icon components plugin
Vue.use(IconsPlugin)
Vue.use(SuiVue);
Vue.use(Dropdown);
Vue.config.productionTip = false

new Vue({
  el: '#app',
  render: h => h(App),
  router
});
