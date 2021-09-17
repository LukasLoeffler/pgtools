<template>  
  <v-app id="app">
    <v-sheet>
      <v-app-bar
        color="primary"
        dark
        height="50"
      >
      <v-app-bar-nav-icon @click="drawer = true"></v-app-bar-nav-icon>
      <v-toolbar-title>{{ $route.name || 'pgtools'}}</v-toolbar-title>
      <v-spacer></v-spacer>
      <ConnectionIndicator id="dbCon"/>
    </v-app-bar>

    <v-navigation-drawer
      v-model="drawer"
      absolute
      temporary
      dark
    >
      <v-list dark>
        <v-list-item dark>
          <v-list-item-avatar color="teal lighten-2" size="56">
            <v-img :src="'/favicon.ico'" width="30" height="30" contain></v-img>
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title class="text-h6">pgtools</v-list-item-title>
            <v-list-item-subtitle>
              <a
                style="text-decoration: none"
                class="caption" 
                href="https://github.com/LukasLoeffler/pgtools"
              >pgtools Github
                <v-icon color="blue" x-small>mdi-open-in-new</v-icon>
              </a>
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <v-divider></v-divider>
        <ConnectionIndicator class="my-1"/>
      <v-divider></v-divider>
      <v-list
        nav
        dense
      >
        <v-list-item-group v-model="currentRoute">
          <v-list-item 
            v-for="(item, i) in sidebarElements" 
            :key="i" 
            :value="item.name" 
            :to="item.path"
          >
            <v-list-item-icon>
              <v-icon v-text="item.icon"></v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title v-text="item.name"></v-list-item-title>
            </v-list-item-content>
          </v-list-item>

        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>

    <router-view></router-view>
    </v-sheet>
  </v-app>
</template>

<script>
import ConnectionIndicator from './components/ConnectionIndicator.vue';

export default {
  name: 'App',
  components: {ConnectionIndicator },
  data: function () {
    return {
      drawer: false,
      currentRoute: null,
      sidebarElements: [
        {
          name: "Connections",
          path: "/",
          icon: "mdi-connection"
        },
        {
          name: "Hooks",
          path: "/hooks",
          icon: "mdi-hook"
        },
        {
          name: "Watcher",
          path: "/watcher",
          icon: "mdi-microscope"
        },
        {
          name: "Commands",
          path: "/commands",
          icon: "mdi-console"
        }
      ]
    }
  },
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

