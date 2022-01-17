import Vue from 'vue'
import App from './App.vue'
import customMessageSong from '../plugins/index'

Vue.use(customMessageSong)
Vue.config.productionTip = false
new Vue({
  render: h => h(App),
}).$mount('#app')
