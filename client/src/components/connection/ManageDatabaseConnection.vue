<template>
  <v-row>
    <v-dialog v-model="dialog" max-width="600px">
      <template v-slot:activator="{ on, attrs }">
        <ButtonContainer>
          <v-btn icon small class="mr-1" :disabled="connected" @click="connect">
            <v-icon :color="!connected ? 'green' : 'grey'">mdi-play-circle-outline</v-icon>
          </v-btn>
          <v-btn icon small class="mr-1" :disabled="!connected" @click="disconnect">
            <v-icon :color="connected ? 'red' : 'grey'">mdi-pause-circle-outline</v-icon>
          </v-btn>
          <v-btn icon small class="mr-1" :disabled="connected" v-bind="attrs" v-on="on">
            <v-icon :color="!connected ? '#46a2d4' : 'grey'">mdi-pencil-circle-outline</v-icon>
          </v-btn>
        </ButtonContainer>
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
import ButtonContainer from '../misc/ButtonContainer.vue';
import ConnectionEditor from "./ConnectionEditor";
import { BASE_URL } from '@/main'

export default {
  data () {
    return {
      dialog: false,
      valid: false,
      connected: false,
      alert: false,
      localConnection: JSON.parse(JSON.stringify(this.connection)),
      updatedConnection: null
    }
  },
  components: {
    ConnectionEditor, ButtonContainer
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
      let url = `${BASE_URL}/connection/listen-start/${this.connection.id}`
      this.$http.get(url)
      .then((result) => this.loadStatus())
      .catch((error) => {
        this.alert = true
        this.loadStatus();
      });
    },
    disconnect() {
      let url = `${BASE_URL}/connection/listen-end/${this.connection.id}`
      this.$http.get(url)
        .then((result) => {
          this.loadStatus();
        })
        .catch(error => {
          this.loadStatus();
        });
    },
    loadStatus() {
      let url = `${BASE_URL}/connection/status/${this.connection.id}`
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
      let url = `${BASE_URL}/connection/${this.connection.id}`;
      this.$http.delete(url)
      .then((result) => {
        this.$emit('connectionDelete', result)
        this.dialog = false;
      });
    },
    updateConnection() {
      let url = `${BASE_URL}/connection`;
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
  watch: {
    '$store.getters.websocketStatus': function(connected) {
      this.loadStatus();
    }
  }
}
</script>


<style scoped>
</style>