import Vue from 'vue'
import BootstrapVue from "bootstrap-vue"
import App from './App.vue'
import axios from 'axios'
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap-vue/dist/bootstrap-vue.css"


Vue.use(BootstrapVue)
axios.defaults.baseURL="http://192.168.123.151:3000";//"http://188.188.1.15:3000";//'http://localhost:3000/'
///axios.defaults.baseURL='http://192.168.123.194:3000/'
Vue.prototype.$ajax=axios;

new Vue({
  el: '#app',
  render: h => h(App)
})
