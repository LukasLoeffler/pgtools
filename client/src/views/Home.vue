<template>
  <v-app>
  </v-app>
</template>

<script>


export default {
  name: 'Home',
  components: { },
  data: function () {
    return {
      users: null,
      uri: 'http://localhost:5000/data',
      host: null,
      port: null,
      username: null,
      password: null,
      database: null
    }
  },
  methods: {

  },

}
</script>

<style scoped>
</style>
