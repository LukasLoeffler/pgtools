<template>
  <v-card-text>
    <v-form v-model="valid">
      <v-container>
        <v-row>
          <v-col cols="12">
            <v-text-field label="Name" v-model="localConnection.name" :rules="[rules.required]"></v-text-field>
          </v-col>
          <v-col cols="6">
            <v-text-field label="Host" v-model="localConnection.host" :rules="[rules.required]"></v-text-field>
          </v-col>
          <v-col cols="6">
            <v-text-field type="number" label="Port" v-model="localConnection.port" :rules="[rules.required, rules.positive]"></v-text-field>
          </v-col>
          <v-col cols="12">
            <v-text-field label="Database" v-model="localConnection.database" :rules="[rules.required]"></v-text-field>
          </v-col>
          <v-col cols="6">
            <v-text-field label="User" v-model="localConnection.user" :rules="[rules.required]"></v-text-field>
          </v-col>
          <v-col cols="6">
            <v-text-field type="password" label="Password" v-model="localConnection.password" :rules="[rules.required]"></v-text-field>
          </v-col>
        </v-row>
      </v-container>
    </v-form>
  </v-card-text>
</template>

<script>
export default {
  name: 'ConnectionEditor',
  data: function () {
    return {
      valid: false,
      rules: {
        required: value => !!value || 'Required.',
        positive: value => value > 0 || 'Positive number required.'
      },
      localConnection: JSON.parse(JSON.stringify(this.connection))
    }
  },
  props: {
    connection: Object
  },
  methods: {
    isPositive(number) {
      if (number && number > 0) {
        return true;
      }
      return false;
    }
  },
  watch: {
    valid(newValidity) {
      this.$emit('validityChange', newValidity);
    },
    localConnection: {
      handler(newConnection) {
        if (this.valid) {
          this.$emit('connectionChange', newConnection);
        }
      },
      deep: true
    }
  }
}
</script>


<style scoped>
</style>