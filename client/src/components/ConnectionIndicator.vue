<template>
  <div>
    <v-btn x-small v-if="connected.length > 0" color="green" @click="gotoConnections">Connections: [{{connected.length}}]</v-btn>
    <v-btn x-small v-else color="red" @click="gotoConnections">No listener active</v-btn>
    <v-tooltip bottom color="cyan">
      <template v-slot:activator="{ on }">
        <v-btn x-small class="ml-2" v-if="$store.getters.websocketStatus" color="green" v-on="on">WS</v-btn>
        <v-btn x-small class="ml-2" v-else color="red" v-on="on">WS</v-btn>
      </template>
      <span v-if="$store.getters.websocketStatus">Websocket: Connected</span>
      <span v-else>Websocket: Not Connected</span>
    </v-tooltip>
  </div>

</template>

<script>
export default {
  name: 'ConnectionIndicator',
  data: function () {
    return {}
  },
  computed: {
    connected() {
      return this.$store.getters.activeConnections;
    }
  },
  methods: {
    gotoConnections() {
      if (this.$route.path !== '/connections') {
        this.$router.push('connections');
      }
    }
  }
}
</script>


<style scoped>
</style>