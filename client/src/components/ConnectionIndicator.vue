<template>
  <div>
    <v-btn x-small v-if="numberActiveConnections > 0" color="green" @click="gotoConnections">Connections: [{{numberActiveConnections}}]</v-btn>
    <v-btn x-small v-else color="red" @click="gotoConnections">No listener active</v-btn>
    <v-tooltip bottom color="cyan">
      <template v-slot:activator="{ on }">
        <v-btn x-small class="ml-2" :color="getColor()" v-on="on">WS</v-btn>
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
    numberActiveConnections() {
      return this.$store.getters.activeConnections.length;
    }
  },
  methods: {
    gotoConnections() {
      if (this.$route.path !== '/connections') {
        this.$router.push('connections');
      }
    },
    getColor() {
      if (this.$store.getters.websocketStatus) return "green";
      else return 'red';
    }
  }
}
</script>


<style scoped>
</style>