import Vue from 'vue'

import {
  JumbotronPlugin,
  NavbarPlugin,
  LayoutPlugin,
  CalendarPlugin,
  InputGroupPlugin,
  FormInputPlugin,
  ButtonPlugin,
  AlertPlugin,
  ModalPlugin,
  FormPlugin,
  FormGroupPlugin,
  FormTextareaPlugin,
  FormTagsPlugin,
  FormSelectPlugin,
  FormFilePlugin,
  ProgressPlugin,
  PaginationPlugin,
  ListGroupPlugin,
  LinkPlugin,
  CardPlugin,
  BadgePlugin,
} from 'bootstrap-vue'
Vue.use(JumbotronPlugin)
Vue.use(NavbarPlugin)
Vue.use(LayoutPlugin)
Vue.use(CalendarPlugin)
Vue.use(InputGroupPlugin)
Vue.use(FormInputPlugin)
Vue.use(ButtonPlugin)
Vue.use(AlertPlugin)
Vue.use(ModalPlugin)
Vue.use(FormPlugin)
Vue.use(FormGroupPlugin)
Vue.use(FormTextareaPlugin)
Vue.use(FormTagsPlugin)
Vue.use(FormSelectPlugin)
Vue.use(FormFilePlugin)
Vue.use(ProgressPlugin)
Vue.use(PaginationPlugin)
Vue.use(ListGroupPlugin)
Vue.use(LinkPlugin)
Vue.use(CardPlugin)
Vue.use(BadgePlugin)
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

import App from './App.vue'
import router from './scripts/router'

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
