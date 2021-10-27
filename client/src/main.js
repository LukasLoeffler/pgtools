import Vue from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
import vuetify from './plugins/vuetify';
import Vuex from 'vuex'
import io from "socket.io-client";


const PROTOCOL = location.protocol;
const HOSTNAME = location.hostname;
const PORT = 5000;
export const BASE_URL = `${PROTOCOL}//${HOSTNAME}:${PORT}`;

let socket = io(BASE_URL);

Vue.use(Vuetify)
Vue.use(Vuex)

Vue.config.productionTip = false
Vue.prototype.$http = axios


const store = new Vuex.Store({
  state: {
    activeConnections: [],
    events: [],
    eventSelection: [],
    websocketStatus: false,
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
    setWebsocketStatus(state, status) {
      state.websocketStatus = status;
    },
    resetEvents(state) {
      state.events = [];
      state.eventSelection = [];
    },
  },
  getters: {
    activeConnections: state => {
      return state.activeConnections;
    },
    events: state => {
      return state.events;
    },
    websocketStatus: state => {
      return state.websocketStatus;
    }
  }
})


const CONNECTION_URL = `${BASE_URL}/connection/all/active`

axios.get(CONNECTION_URL)
  .then((result) => {
    store.commit('setActiveConnections', result.data);
  });

socket.on("databaseEvent", event => {
  event.id = event.data.id || event.data_old.id;
  store.commit('addEvent', event)
});

socket.on("connect", () => {
  console.log("%cWebsocketStatus: %cConnected", "font-weight: bold;", "color: green;");
  store.commit('setWebsocketStatus', true);
});

socket.on("disconnect", () => {
  console.log("%cWebsocketStatus: %cNot Connected", "font-weight: bold;", "color: red;");
  store.commit('setWebsocketStatus', false);
  store.commit('setActiveConnections', []);
});

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')