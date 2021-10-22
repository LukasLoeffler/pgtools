<template>
  <v-app id="app">

    <v-app-bar
      app
      color="blue-grey darken-2"
      dark
      clipped-left
      height="50"
    >
      <v-app-bar-nav-icon>
        <v-btn icon>
          <v-icon>{{currentIcon}}</v-icon>
        </v-btn>
      </v-app-bar-nav-icon>
      <v-toolbar-title 
        color="white"
        class="pl-1"
      >{{ $route.name || 'pgtools'}}</v-toolbar-title>
      <v-spacer></v-spacer>
      <ConnectionIndicator id="dbCon" :clickable="true"/>
    </v-app-bar>

    <v-navigation-drawer
      app
      dark
      :mini-variant="$vuetify.breakpoint.width <= 900"
      permanent
      :expand-on-hover="$vuetify.breakpoint.width > 900"
      clipped
    >
      <v-list dark>
        <v-list-item class="pl-2">
          <v-list-item-avatar color="teal lighten-2" size="37">
            <v-img :src="'/favicon.ico'" width="25" height="25" contain></v-img>
          </v-list-item-avatar>
  
          <v-list-item-title class="text-h6">pgtools</v-list-item-title>
  
          <v-btn
            icon
            href="https://github.com/LukasLoeffler/pgtools"
            target="_blank"
          >
            <v-icon>mdi-github</v-icon>
          </v-btn>
        </v-list-item>
      </v-list>

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
    <v-main>
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script>
import ConnectionIndicator from './components/connection/ConnectionIndicator.vue';

export default {
  name: 'App',
  components: {ConnectionIndicator },
  data: () => ({
    mini: false,
    drawer: null,
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
  }),
  computed: {
    currentIcon() {
      return this.sidebarElements.find(element => element.name === this.$route.name).icon;
    }
  }
}
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
  height: 7px;
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