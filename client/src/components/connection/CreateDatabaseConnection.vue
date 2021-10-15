<template>
  <v-row>
    <v-dialog v-model="dialog" max-width="600px">
      <template v-slot:activator="{ on, attrs }">
          <v-btn color="green" class="mr-1" outlined v-bind="attrs" v-on="on">
            <v-icon>mdi-playlist-plus</v-icon>
          </v-btn>
      </template>
      <v-card>
        <v-card-title>
          <span class="headline">Create connection</span>
        </v-card-title>
        <ConnectionEditor :connection="connection" @validityChange="changeValidity" @connectionChange="setConnection"/>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn 
            color="blue" 
            text 
            @click="checkConnection" 
            :disabled="!valid" 
            :loading="checkingConnection"
          >Check</v-btn>
          <v-btn 
            color="green" 
            text 
            @click="createConnection" 
            :disabled="!valid"
          >
          Create</v-btn>
          <v-btn 
            color="red" 
            text 
            @click="dialog = false"
          >Abort</v-btn>
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
import ConnectionEditor from "./ConnectionEditor.vue";

export default {
  name: 'CreateDatabaseConnection',
  components: { ConnectionEditor },
  data () {
    return {
      dialog: false,
      checkingConnection: false,
      alert: false,
      successSnackbar: false,
      valid: false,
      connection: {
        name: '',
        host: 'localhost',
        port: '5432',
        database: '',
        user: '',
        password: ''
      }
    }
  },
  methods: {
    setConnection(newConnection) {
      this.connection = newConnection;
    },
    changeValidity(validity) {
      this.valid = validity;
    },
    createConnection() {
      let url = `http://${location.hostname}:5000/connection`
      this.$http.post(url, this.connection)
        .then((result) => {
          this.$emit('connectionCreate', result)
          this.dialog = false;
        })
        .catch((err) => {
          console.error(err);
          this.alert = true;
        })
    },
    checkConnection() {
      this.checkingConnection = true;
      let url = `http://${location.hostname}:5000/connection/check`
      this.$http.post(url, this.connection)
        .then((result) => {
          if (!result.data.valid) {
            this.alert = true;
            console.log(result.data.message)
          } else {
            this.successSnackbar = true;
          }
          this.checkingConnection = false;
        })
    }
  }
}
</script>