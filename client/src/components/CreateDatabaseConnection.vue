<template>
  <v-row>
    <v-dialog v-model="dialog" persistent max-width="600px">
      <template v-slot:activator="{ on, attrs }">
          <v-btn color="green" class="mr-1" v-bind="attrs" v-on="on">
            Add
          </v-btn>
      </template>
      <v-card>
        <v-card-title>
          <span class="headline">Create connection</span>
        </v-card-title>
        <v-card-text>
          <v-form v-model="valid">
            <v-container>
              <v-row>
                <v-col cols="12">
                  <v-text-field id="name" label="Name" v-model="name" :rules="[rules.required]"></v-text-field>
                </v-col>
                <v-col cols="6">
                  <v-text-field id="host" label="Host" v-model="host" :rules="[rules.required]"></v-text-field>
                </v-col>
                <v-col cols="6">
                  <v-text-field id="port" type="number" label="Port" v-model="port" :rules="[rules.required, rules.max]"></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field id="db" label="Database" v-model="database" :rules="[rules.required]"></v-text-field>
                </v-col>
                <v-col cols="6">
                  <v-text-field id="user" label="User" v-model="user" :rules="[rules.required]"></v-text-field>
                </v-col>
                <v-col cols="6">
                  <v-text-field id="password" type="password" label="Password" v-model="password" :rules="[rules.required]"></v-text-field>
                </v-col>
              </v-row>
            </v-container>
          </v-form>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          
          <v-btn color="green" class="ml-6" outlined left @click="createConnection" :disabled="!valid">Create</v-btn>
          <v-btn color="blue" class="ml-1" outlined left @click="checkConnection" :loading="checkingConnection">Check</v-btn>
          <v-spacer></v-spacer>
          <v-btn color="blue" text @click="dialog = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-snackbar color="error" v-model="alert" timeout="3000" top>Invalid connection properties. Try again with changed properties.</v-snackbar>
    <v-snackbar color="success" v-model="successSnackbar" timeout="3000" top>
      <p class="ma-0 text-center">Connection valid.</p>
    </v-snackbar>
  </v-row>
</template>

<script>
export default {
  name: 'CreateDatabaseConnection',
  data () {
    return {
      dialog: false,
      checkingConnection: false,
      alert: false,
      successSnackbar: false,
      rules: {
        required: value => !!value || 'Required.',
        max: v => v.length <= 6 || 'Max 6 characters',
      },
      valid: false,
      connected: false,
      name: '',
      host: '',
      port: '5432',
      database: '',
      user: '',
      password: ''
    }
  },
  props: {},
  computed: {},
  methods: {
    getConnectionFromForm() {
      let data = {
        name: this.name,
        host: this.host,
        port: this.port,
        database: this.database,
        user: this.user,
        password: this.password
      };
      return data;
    },
    createConnection() {
      let url = `http://${location.hostname}:5000/connection`
      let data = this.getConnectionFromForm();
      this.$http.post(url, data)
      .then((result) => {
        this.$emit('connectionCreate', result)
        this.dialog = false;
      }).catch((err) => {
        console.error(err);
        this.alert = true;
      })
    },
    checkConnection() {
      this.checkingConnection = true;
      let url = `http://${location.hostname}:5000/check-connection`
      let data = this.getConnectionFromForm();
      this.$http.post(url, data)
      .then((result) => {
        if (result.data.status === "error") {
          this.alert = true;
        } else {
          this.successSnackbar = true;
        }
        this.checkingConnection = false;
      })
    }
  }

}
</script>


<style scoped>
</style>