<template>
  <v-row>
    <v-dialog v-model="dialog" max-width="600px">
      <template v-slot:activator="{ on, attrs }">
        <div>
          <v-btn text x-small class="mr-1" :disabled="connected" @click="connect">
            <unicon name="play" :fill="!connected ? 'green' : 'grey'"></unicon>
          </v-btn>
          <v-btn text x-small class="mr-1" :disabled="!connected" @click="disconnect">
            <unicon name="pause-circle" :fill="connected ? 'red' : 'grey'"></unicon>
          </v-btn>
          <v-btn text x-small class="mr-1" :disabled="connected" v-bind="attrs" v-on="on">
            <unicon name="pen" :fill="!connected ? '#46a2d4' : 'grey'"></unicon>
          </v-btn>
        </div>
      </template>
      <v-card>
        <v-card-title>
          <span class="headline">Edit connection</span>
        </v-card-title>
        <ConnectionEditor :connection="localConnection" @validityChange="changeValidity" @connectionChange="setConnection"/>
        <v-divider></v-divider>
        <v-card-actions>
          <v-btn color="green" outlined @click="updateConnection" :disabled="!valid" left class="ml-7">Save</v-btn>
          <v-btn color="red" outlined @click="deleteConnection" left>Delete</v-btn>
          <v-spacer></v-spacer>
          <v-btn color="blue" text @click="dialog = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-snackbar color="warning" v-model="alert" timeout="3000" top>Invalid connection properties. Try again with changed properties.</v-snackbar>
  </v-row>
</template>

<script>
import ConnectionEditor from "../components/ConnectionEditor";


export default {
  data () {
    return {
      baseUrl: `http://${location.hostname}:5000`,
      dialog: false,
      valid: false,
      connected: false,
      alert: false,
      localConnection: JSON.parse(JSON.stringify(this.connection)),
      updatedConnection: null
    }
  },
  components: {
    ConnectionEditor
  },
  props: {
    connection: Object
  },
  methods: {
    changeValidity(validity) {
      this.valid = validity;
    },
    setConnection(newConnection) {
      this.updatedConnection = newConnection;
    },
    connect() {
      let url = `${this.baseUrl}/connection/${this.connection.id}/listen-start`
      this.$http.get(url)
      .then((result) => this.loadStatus())
      .catch((error) => this.alert = true);
    },
    disconnect() {
      let url = `${this.baseUrl}/connection/${this.connection.id}/listen-end`
      this.$http.get(url)
      .then((result) => {
        this.loadStatus();
      });
    },
    loadStatus() {
      let url = `${this.baseUrl}/connection/${this.connection.id}/status`
      this.$http.get(url)
      .then((result) => {
        this.connected = result.data.connected;
        if(this.connected) {
          this.$store.commit('addActiveConnection', this.connection);
        } else {
          this.$store.commit('removeActiveConnection', this.connection);
        }
      });
    },
    deleteConnection() {
      let url = `${this.baseUrl}/connection/${this.connection.id}`;
      this.$http.delete(url)
      .then((result) => {
        this.$emit('connectionDelete', result)
        this.dialog = false;
      });
    },
    updateConnection() {
      let url = `${this.baseUrl}/connection`;
      this.$http.put(url, this.updatedConnection)
      .then((result) => {
        this.$emit('connectionDelete', result)
        this.dialog = false;
      });
    }
  },
  created() {
    this.loadStatus();
  },
}
</script>


<style scoped>
</style>