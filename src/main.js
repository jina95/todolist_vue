import '@babel/polyfill'
import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'
import router from './router'
import store from './store'

Vue.config.productionTip = false

export const eventBus = new Vue({
  methods:{
    listEdit(memo, index, mode, display){
      this.$emit('listEdit', memo, index, mode, display)
      // mode를 추가해 주었다.
    }
  }
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')