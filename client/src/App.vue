<template>  
  <v-app id="app">
    <div id="nav" ref="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/connections">Connections</router-link> |
      <router-link to="/triggers">Triggers</router-link> |
      <router-link to="/watcher">Watcher</router-link> |
      <router-link to="/commands">Commands</router-link>
      <ConnectionIndicator id="dbCon"/>
    </div>
    <router-view></router-view>
  </v-app>
</template>

<script>
import ConnectionIndicator from "./components/ConnectionIndicator";

export default {
  name: 'App',
  data: function () {
    return {}
  },
  components: { ConnectionIndicator },
  methods: {
    setInnerHeight(innerHeight) {
      this.$store.commit('setHeight', innerHeight);
    }
  },
  mounted() {
      let navbarHeight = this.$refs.nav.clientHeight;
      this.setInnerHeight(window.innerHeight-navbarHeight);
      window.addEventListener('resize', () => {
        this.setInnerHeight(window.innerHeight-navbarHeight);
      })
  }
};
</script>


<style scoped>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;

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

@media only screen and (max-width: 500px) {
  #dbCon {
    display: none;
  }
}
</style>

<style>
/* width */
::-webkit-scrollbar {
  width: 7px;
}

/* Track */
::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 2px;
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 2px;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: #555; 
}
</style>

