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
        <ConnectionEditor 
          :connection="connection" 
          @validityChange="changeValidity" 
          @connectionChange="setConnection"
        />
        <v-divider></v-divider>
        <v-card-actions>
          <v-btn 
            color="blue" 
            text 
            @click="checkConnection" 
            :disabled="!valid"
            left
            :loading="checkingConnection"
          >
            Check:
            {{ status }}
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn 
            color="green" 
            text 
            @click="createConnection" 
            :disabled="!connectionValid"
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
import { BASE_URL } from '@/main'

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
      connectionValid: null,
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
      this.connectionValid = null;
    },
    changeValidity(validity) {
      this.valid = validity;
    },
    createConnection() {
      let url = `${BASE_URL}/connection`
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
      let url = `${BASE_URL}/connection/check`
      this.$http.post(url, this.connection)
        .then((result) => {

          this.connectionValid = result.data.valid;
          if (!result.data.valid) {
            this.alert = true;
          } else {
            this.successSnackbar = true;
          }
          this.checkingConnection = false;
        })
    }
  },
  computed: {
    status() {
      if (this.connectionValid === null) return "Undefined";
      if (!this.connectionValid) return "Invalid";
      if (this.connectionValid) return "Valid";
      return "Undefined";
    }
  }
}
</script>