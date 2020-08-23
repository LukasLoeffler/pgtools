<template>  
  <div id="app">
    <v-app>
      <div id="nav">
        <router-link to="/">Home</router-link> |
        <router-link to="/triggers">Triggers</router-link> |
        <router-link to="/watcher">Watcher</router-link>
        <DbConnectDialog id="dbCon"/>
      </div>
      <router-view></router-view>
    </v-app>
  </div>
</template>

<script>
import DbConnectDialog from "./components/DbConnectDialog";

export default {
  name: 'App',
  data: function () {
    return {}
  },
  components: { DbConnectDialog },
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
  background-color: #2c3e50;
  color: #42b983;
}

#nav a {
  font-weight: bold;
  color: #42b983;
}

#nav a.router-link-exact-active {
  color: white;
}

#dbCon {
  float: right;
}
</style>

