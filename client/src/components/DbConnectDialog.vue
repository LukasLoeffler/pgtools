<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" persistent max-width="600px">
      <template v-slot:activator="{ on, attrs }">
        <v-btn x-small v-if="$store.getters.connectionStatus" v-bind="attrs" v-on="on" :color="color">Connected</v-btn>
        <v-btn x-small v-else v-bind="attrs" v-on="on" :color="color">Not Connected</v-btn>
      </template>
      <v-card>
        <v-card-title>
          <span class="headline">Database connection</span>
        </v-card-title>
        <v-card-text>
          <v-form v-model="valid">
            <v-container>
              <v-row>
                <v-col cols="6" sm="6" md="6">
                  <v-text-field id="host" label="Host" v-model="hostname" :rules="[rules.required]"></v-text-field>
                </v-col>
                <v-col cols="6" sm="6" md="6">
                  <v-text-field id="port" type="number" label="Port" v-model="port" :rules="[rules.required, rules.max]"></v-text-field>
                </v-col>
                <v-col md="12">
                  <v-text-field id="db" label="Database" v-model="database" :rules="[rules.required]"></v-text-field>
                </v-col>
                <v-col cols="12" sm="6" md="6">
                  <v-text-field id="user" label="User" v-model="username" :rules="[rules.required]"></v-text-field>
                </v-col>
                <v-col cols="12" sm="6" md="6">
                  <v-text-field id="password" type="password" label="Password" v-model="password" :rules="[rules.required]"></v-text-field>
                </v-col>
                <v-col v-if="connectionEstablished === false" cols="12" style="color: red">
                  <p>Error connecting to database. Retry with other parameters.</p>
                </v-col>
              </v-row>
            </v-container>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="dialog = false">Close</v-btn>
          <v-btn color="blue darken-1" :disabled="!valid" @click="connectToDB">Connect</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
  export default {
    data () {
      return {
        dialog: false,
        connectionEstablished: null,
        hostname: '',
        port: '5432',
        username: '',
        password: '',
        database: '',
        valid: false,
        rules: {
          required: value => !!value || 'Required.',
          max: v => v.length <= 6 || 'Max 6 characters',
        },
      }
    },
    computed: {
      color() {
        let color = (this.$store.getters.connectionStatus) ? 'green' : '#fce674';
        return color;
      }
    },
    methods: {
      connectToDB() {
        let url = 'http://localhost:5000/init'
        let data = {
          hostname: this.hostname,
          port: this.port,
          database: this.database,
          username: this.username,
          password: this.password
        };
        this.$http.post(url, data)
        .then((result) => {
          this.$store.commit('connectionStatus', result.data.connected)
          if (result.data.connected) {
            this.$emit('connected', result.data.connected);
            this.dialog = false;
            this.connectionEstablished = true;
          } else {
            this.connectionEstablished = false;
          }
        }).catch((err) => {
          console.error(err);
        })
      }
    },
    mounted() {
      let url = 'http://localhost:5000/status';
      this.$http.get(url)
      .then((result) => {
        this.$store.commit('connectionStatus', result.data.connected)
      });
    }
  }
</script>