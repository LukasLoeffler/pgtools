<template>
  <v-row>
    <v-dialog v-model="dialog" persistent max-width="600px">
      <template v-slot:activator="{ on, attrs }">
        <div>
          <v-btn text x-small class="mr-1" :disabled="connected" @click="connect">
            <unicon name="play" v-if="!connected" fill="green"></unicon>
            <unicon name="play" v-else fill="grey"></unicon>
          </v-btn>
          <v-btn text x-small class="mr-1" :disabled="!connected" @click="disconnect">
            <unicon name="pause-circle" v-if="connected" fill="red"></unicon>
            <unicon name="pause-circle" v-else fill="grey"></unicon>
          </v-btn>
          <v-btn text x-small class="mr-1" v-bind="attrs" v-on="on">
            <unicon name="pen" fill="#46a2d4"></unicon>
          </v-btn>
        </div>
      </template>
      <v-card>
        <v-card-title>
          <span class="headline">Edit connection</span>
        </v-card-title>
        <v-card-text>
          <v-form v-model="valid">
            <v-container>
              <v-row>
                <v-col cols="12">
                  <v-text-field id="name" label="Name" v-model="connection.name" :rules="[rules.required]"></v-text-field>
                </v-col>
                <v-col cols="6">
                  <v-text-field id="host" label="Host" v-model="connection.host" :rules="[rules.required]"></v-text-field>
                </v-col>
                <v-col cols="6">
                  <v-text-field id="port" type="number" label="Port" v-model="connection.port" :rules="[rules.required, rules.max]"></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field id="db" label="Database" v-model="connection.database" :rules="[rules.required]"></v-text-field>
                </v-col>
                <v-col cols="6">
                  <v-text-field id="user" label="User" v-model="connection.user" :rules="[rules.required]"></v-text-field>
                </v-col>
                <v-col cols="6">
                  <v-text-field id="password" type="password" label="Password" v-model="connection.password" :rules="[rules.required]"></v-text-field>
                </v-col>
              </v-row>
            </v-container>
          </v-form>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-btn color="green" outlined @click="updateConnection" left class="ml-7">Save</v-btn>
          <v-btn color="red" outlined @click="deleteConnection" left>Delete</v-btn>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="dialog = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-snackbar color="warning" v-model="alert" timeout="3000" top>Invalid connection properties. Try again with changed properties.</v-snackbar>
  </v-row>
</template>

<script>
export default {
  data () {
    return {
      dialog: false,
      rules: {
        required: value => !!value || 'Required.',
        max: v => v.length <= 6 || 'Max 6 characters',
      },
      valid: false,
      connected: false,
      alert: false
    }
  },
  props: {
    connection: Object
  },
  computed: {},
  methods: {
    connect() {
      let url = 'http://localhost:5000/connection/listen-start/'+this.connection.id;
      this.$http.get(url)
      .then((result) => this.loadStatus())
      .catch((error) => this.alert = true);
    },
    disconnect() {
      let url = 'http://localhost:5000/connection/listen-end/'+this.connection.id;
      this.$http.get(url)
      .then((result) => {
        this.loadStatus();
      });
    },
    loadStatus() {
      let url = 'http://localhost:5000/connection/'+this.connection.id+"/status";
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
      let url = 'http://localhost:5000/connection/'+this.connection.id;
      this.$http.delete(url)
      .then((result) => {
        this.$emit('connectionDelete', result)
        this.dialog = false;
      });
    },
    updateConnection() {
      let url = 'http://localhost:5000/connection';
      this.$http.put(url, this.connection)
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