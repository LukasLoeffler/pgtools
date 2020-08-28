<template>
    <v-btn x-small v-if="connected.length > 0" color="green" @click="gotoConnections">{{connected.length}} Connections</v-btn>
    <v-btn x-small v-else color="red" @click="gotoConnections">Not Connected</v-btn>
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