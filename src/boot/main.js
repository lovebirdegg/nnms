import Vue from 'vue'
import Vuelidate from 'vuelidate'
Vue.use(Vuelidate)

import { Notify } from 'quasar'

Notify.setDefaults({
  position: 'top',
  timeout: 2500,
  icon: 'announcement',
  textColor: 'white',
  color: 'secondary',
  actions: [{ icon: 'close', color: 'white' }]
})
