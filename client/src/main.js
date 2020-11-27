import Vue from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'
import Unicon from 'vue-unicons'
import { uniFilter, uniFilterSlash, uniPlay, uniPen, uniPauseCircle, uniChannelAdd, uniLink, uniLinkBroken, uniTrashAlt, uniInfoCircle  } from 'vue-unicons/src/icons'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
import vuetify from './plugins/vuetify';
import Vuex from 'vuex'

import io from "socket.io-client";
var socket = io.connect("http://localhost:5000");

Vue.use(Vuetify)
Vue.use(Vuex)


Unicon.add([uniFilter, uniFilterSlash, uniPlay, uniPen, uniPauseCircle, uniChannelAdd, uniLink, uniLinkBroken, uniTrashAlt, uniInfoCircle  ])
Vue.use(Unicon, {
  height: 20,
  width: 20
})

Vue.config.productionTip = false
Vue.prototype.$http = axios


const store = new Vuex.Store({
  state: {
    activeConnections: [],
    events: [],
    eventSelection: [],
    contentHeight: "90vh",
    websocketStatus: false
  },
  mutations: {
    //Sets a whole array of connections as active connections
    setActiveConnections (state, connections) {
      state.activeConnections = connections;
    },
    //Adds connection to activeConnections if no connection with same id is present
    addActiveConnection (state, connection) {
      if (!state.activeConnections.some(existingConnection => existingConnection.id === connection.id)){
        state.activeConnections.push(connection);
      }
    },
    //Removed connection from active connection if existing
    removeActiveConnection(state, connection) {
      state.activeConnections = state.activeConnections.filter(existingConnection => existingConnection.id !== connection.id)
    },
    addEvent(state, event) {
      state.events = [event, ...state.events];
    },
    setHeight(state, height) {
      height = height-25;
      state.contentHeight = height;
    },
    setWebsocketStatus(state, status) {
      state.websocketStatus = status;
    },
    resetEvents(state) {
      state.events = [];
      state.eventSelection = [];
    }
  },
  getters: {
    activeConnections: state => {
      return state.activeConnections;
    },
    events: state => {
      return state.events;
    },
    contentHeight: state => {
      return state.contentHeight;
    },
    websocketStatus: state => {
      return state.websocketStatus;
    }
  }
})



let url = "http://localhost:5000/connection/all/active";
axios.get(url)
.then((result) => {
  store.commit('setActiveConnections', result.data);
});

socket.on("databaseEvent", event => {
  store.commit('addEvent', event)
});

socket.on("connect", () => {
  console.log("%c WebsocketStatus: %cConnected", "font-weight: bold;", "color: green;");
  store.commit('setWebsocketStatus', true);
});

socket.on("disconnect", () => {
  console.log("%c WebsocketStatus: %cNot Connected", "font-weight: bold;", "color: red;");
  store.commit('setWebsocketStatus', false);
  store.commit('setActiveConnections', []);
});

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
