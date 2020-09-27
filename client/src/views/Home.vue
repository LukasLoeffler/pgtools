<template>
  <v-container fluid grid-list-md>
    <v-row>
      <v-card outline width="350" elevation="10" class="card" color="#ACC1FF">
        <v-card-text>
          <p class="display-1 text--primary">Connections</p>
          <div class="text--primary">
            Manage all your database connections<br>
            Create, Activate, Stop, Edit. <br>
            <span v-if="$store.getters.activeConnections.length === 1">
              Currently <b>{{$store.getters.activeConnections.length}}</b> connection active.
            </span>
            <span v-else>
              Currently <b>{{$store.getters.activeConnections.length}}</b> connections active.
            </span>
          </div>
        </v-card-text>
        <v-card-actions>
          <v-btn text large color="#172BC5" @click="$router.push('connections')"><b>Open Connections</b></v-btn>
        </v-card-actions>
      </v-card>

      <v-card outline width="350" elevation="10" class="card" color="#C7EEFF">
        <v-card-text>
          <p class="display-1 text--primary">Triggers</p>
          <div class="text--primary">
            Select the database tables for which you want to intercept events
          </div>
        </v-card-text>
        <v-card-actions>
          <v-btn text large color="#172BC5" @click="$router.push('triggers')"><b>Open Triggers</b></v-btn>
        </v-card-actions>
      </v-card>

      <v-card outline width="350" elevation="10" class="card" color="#FFAEAE">
        <v-card-text>
          <p class="display-1 text--primary">Watcher</p>
          <div class="text--primary">
            Watch the database events in realtime. <br>
            Tip: The detail mode only becomes active when a certain table is selected. <br>
            <span v-if="$store.getters.activeConnections.length === 1">
              Currently <b>{{$store.getters.events.length}}</b> event in cache.
            </span>
            <span v-else>
              Currently <b>{{$store.getters.events.length}}</b> events in cache.
            </span>
          </div>
        </v-card-text>
        <v-card-actions>
          <v-btn text large color="#172BC5" @click="$router.push('watcher')"><b>Open Watcher</b></v-btn>
        </v-card-actions>
      </v-card>

    
      <v-card outline width="350" elevation="10" class="card" color="#FFEC94">
        <v-card-text>
          <p class="display-1 text--primary">Quick Commands</p>
          <div class="text--primary">
            Create frequently used queries.<br>
            Select database. Execute by a single click.
          </div>
        </v-card-text>
        <v-card-actions>
          <v-btn text large color="#172BC5" @click="$router.push('commands')"><b>Open Commands</b></v-btn>
        </v-card-actions>
      </v-card>
    </v-row>
  </v-container>
</template>

<script>


export default {
  name: 'Home',
}
</script>

<style scoped>
  .card {
    margin: 10px;
  }
</style>
