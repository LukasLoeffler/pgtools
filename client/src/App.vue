<template>
  <v-app 
    id="app"
  >
    <v-app-bar
      app
      color="blue-grey darken-2"
      clipped-left
      height="50"
    >
      <v-app-bar-nav-icon>
        <v-btn 
          color="white"
          icon
        >
          <v-icon>{{currentIcon}}</v-icon>
        </v-btn>
      </v-app-bar-nav-icon>
      <v-toolbar-title 
        style="color: white"
        class="pl-1"
      >{{ $route.name || 'pgtools'}}</v-toolbar-title>
      <v-spacer></v-spacer>
      <ConnectionIndicator id="dbCon" :clickable="true"/>
      <v-btn
        icon
        color="white"
        @click="settingsDrawer = !settingsDrawer"
      >
        <v-icon>
          mdi-cog
        </v-icon>
      </v-btn>
    </v-app-bar>

    <v-navigation-drawer
      app
      :mini-variant="$vuetify.breakpoint.width <= 900"
      permanent
      :expand-on-hover="$vuetify.breakpoint.width > 900"
      clipped
    >
      <v-list>
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

    <v-navigation-drawer
      v-model="settingsDrawer"
      clipped
      temporary
      app
      right
      
      hide-overlay
      width="300"
    >
      <v-toolbar
        height="50"
      >
        <v-toolbar-title 
          class="text-h6 font-weight-medium"
        >Settings</v-toolbar-title>

        <v-spacer></v-spacer>
        <v-btn
          icon
          @click="settingsDrawer = false"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      
      <v-row class="ma-auto">
        <v-col class="pl-5">
          <v-switch
            v-model="$vuetify.theme.dark"
            inset
            label="Toggle darkmode"
            @change="saveDarkmode"
          ></v-switch>
        </v-col>
      </v-row>
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
    dark: false,
    drawer: null,
    settingsDrawer: false,
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
  created() {
    this.$vuetify.theme.dark = Boolean(localStorage.getItem("darkmode") === "true");
  },
  computed: {
    currentIcon() {
      return this.sidebarElements.find(element => element.name === this.$route.name).icon;
    },
  },
  methods: {
    saveDarkmode(value) {
      console.log("Saving:", value);
      localStorage.setItem("darkmode", this.$vuetify.theme.dark);
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