import Vue from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'
import Unicon from 'vue-unicons'
import { uniFilter, uniCrosshairAlt, uniCrosshair, uniFilterSlash } from 'vue-unicons/src/icons'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
import vuetify from './plugins/vuetify';
import Vuex from 'vuex'

import io from "socket.io-client";
var socket = io.connect("http://localhost:5000");

Vue.use(Vuetify)
Vue.use(Vuex)


Unicon.add([uniFilter, uniCrosshairAlt, uniCrosshair, uniFilterSlash])
Vue.use(Unicon, {
  height: 20,
  width: 20
})

Vue.config.productionTip = false
Vue.prototype.$http = axios

const store = new Vuex.Store({
  state: {
    connected: false,
    events: [],
    eventSelection: [],
    contentHeight: "90vh"
  },
  mutations: {
    connectionStatus (state, status) {
      state.connected = status
    },
    addEvent(state, event) {
      state.events = [event, ...state.events];
    },
    selectEvents(state, events) {
      state.eventSelection = events;
    },
    resetEvents(state) {
      state.eventSelection = [];
      state.events = [];
    },
    setHeight(state, height) {
      state.contentHeight = height+"px";
    }
  },
  getters: {
    connectionStatus: state => {
      return state.connected;
    },
    events: state => {
      return state.events;
    },
    selectedEvents: state => {
      return state.eventSelection;
    },
    contentHeight: state => {
      return state.contentHeight;
    }
  }
})

socket.on("evt", event => {
  store.commit('addEvent', event)
});

socket.on("connect", () => {
 console.log("connect");
});

socket.on("disconnect", () => {
 console.log("disconnect");
 store.commit('connectionStatus', false);
});

new Vue({
  router,
  store,
  sockets: {
    evt: function(event){
      console.log(event);
        this.store.commit('addEvent', event)
     },
    connect: function() {
      console.log("connect");
    },
    disconnect: function() {
      console.log("disconnect");
      this.$store.commit('connectionStatus', false);
    }
  },
  vuetify,
  render: h => h(App)
}).$mount('#app')
