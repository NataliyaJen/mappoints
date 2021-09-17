import "@babel/polyfill";
import "mutationobserver-shim";

import Vue from "vue";
import "bootstrap-vue/dist/bootstrap-vue.css";
import "bootstrap/dist/css/bootstrap.css";
import BootstrapVue from "bootstrap-vue";
import App from "./App.vue";

import { BFormFile } from 'bootstrap-vue'
Vue.component('b-form-file', BFormFile)
import { BButton } from 'bootstrap-vue'
Vue.component('b-button', BButton)
import { BModal } from 'bootstrap-vue'
Vue.component('b-modal', BModal)

import "bootstrap-vue/dist/bootstrap-vue.css";
import "bootstrap/dist/css/bootstrap.css";

import { ModalPlugin } from 'bootstrap-vue'

import Amplify from 'aws-amplify';
import awsconfig from './aws-exports'; 
Amplify.configure(awsconfig);

Vue.use(ModalPlugin)

Vue.config.productionTip = false;

new Vue({
  render: (h) => h(App),
}).$mount("#app");

Vue.use(BootstrapVue);



