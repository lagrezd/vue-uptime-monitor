import Vue from 'vue'
import VueResource from 'vue-resource'
import App from './App.vue'
import Vuetify from 'vuetify'
import './stylus/main.styl'

Vue.use(Vuetify)
Vue.use(VueResource)

new Vue({
  el: '#app',
  render: h => h(App)
})
