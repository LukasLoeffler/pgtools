<template>  
  <div id="app">
    <v-app>
      <div id="nav">
        <router-link to="/">Home</router-link> |
        <router-link to="/connections">Connections</router-link> |
        <router-link to="/triggers">Triggers</router-link> |
        <router-link to="/watcher">Watcher</router-link>
        <ConnectionIndicator id="dbCon"/>
      </div>
      <router-view></router-view>
    </v-app>
  </div>
</template>

<script>
import ConnectionIndicator from "./components/ConnectionIndicator";

export default {
  name: 'App',
  data: function () {
    return {}
  },
  components: { ConnectionIndicator },
  methods: {}
};
</script>


<style scoped>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;

}

body {
  margin: 0;
}

#nav {
  padding: 20px;
  background-color: #3e5770;
  color: #50e2a1;
}

#nav a {
  font-weight: bold;
  color: #50e2a1;
}

#nav a.router-link-exact-active {
  color: white;
}

#dbCon {
  float: right;
}
</style>

