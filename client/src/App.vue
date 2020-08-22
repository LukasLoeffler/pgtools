<template>  
  <div id="app">
    <v-app>
      <div id="nav">
        <div>
          <router-link to="/triggers">Triggers</router-link> |
          <router-link to="/events">Events</router-link> |
          <router-link to="/comparison">Comparison</router-link> |
          <router-link to="/watcher">Watcher</router-link>
          <DbConnectDialog id="dbCon"/>
        </div>
      </div>

      <router-view></router-view>
    </v-app>
  </div>
</template>

<script>
import DbConnectDialog from "./components/DbConnectDialog";

export default {
  
  name: 'App',
  
  components: { DbConnectDialog },

  data: () => ({
    //
  }),
  methods: {
    openDbDialog() {
      console.log("Open");
    }
  }
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

