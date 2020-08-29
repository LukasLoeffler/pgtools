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
          
          <v-btn color="green darken-1" class="ml-7" left @click="createConnection">Create</v-btn>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="dialog = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
export default {
  name: 'CreateDatabaseConnection',
  data () {
    return {
      dialog: false,
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
    createConnection() {
      let url = `http://${location.hostname}:5000/connection`
      let data = {
        name: this.name,
        host: this.host,
        port: this.port,
        database: this.database,
        user: this.user,
        password: this.password
      };
      this.$http.post(url, data)
      .then((result) => {
        this.$emit('connectionCreate', result)
        this.dialog = false;
      }).catch((err) => {
        console.error(err);
      })
    }
  }

}
</script>


<style scoped>
</style>