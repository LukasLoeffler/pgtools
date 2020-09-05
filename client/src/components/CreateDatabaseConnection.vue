<template>
  <v-row>
    <v-dialog v-model="dialog" max-width="600px">
      <template v-slot:activator="{ on, attrs }">
          <v-btn color="green" class="mr-1" outlined v-bind="attrs" v-on="on">
            <unicon name="channel-add" fill="green"></unicon>
          </v-btn>
      </template>
      <v-card>
        <v-card-title>
          <span class="headline">Create connection</span>
        </v-card-title>
        <ConnectionEditor :connection="connection" @validityChange="changeValidity" @connectionChange="setConnection"/>
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
import ConnectionEditor from "../components/ConnectionEditor";

export default {
  name: 'CreateDatabaseConnection',
  components: {
    ConnectionEditor
  },
  data () {
    return {
      dialog: false,
      checkingConnection: false,
      alert: false,
      successSnackbar: false,
      valid: false,
      connected: false,
      connection: {
        name: '',
        host: '',
        port: '5432',
        database: '',
        user: '',
        password: ''
      }
    }
  },
  props: {},
  computed: {},
  methods: {
    setConnection(newConnection) {
      this.connection = newConnection;
    },
    changeValidity(validity) {
      this.valid = validity;
    },
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
      this.$http.post(url, this.connection)
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