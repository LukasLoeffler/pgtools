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
          <span class="headline">Create command</span>
        </v-card-title>
        <v-form v-model="valid" ref="form">
          <v-container class="pl-7">
            <v-row>
              <v-col cols="12">
                <v-text-field label="Name" v-model="name" :rules="[rules.required]"></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field label="Query" v-model="query_string" :rules="[rules.required]"></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-select :items="severities" label="Severty" v-model="selectedSeverity" chips>
                  <template v-slot:selection="{ item }">
                    <v-chip class="ml-0" small label :color=getSeverityColor(item)>
                      <span>{{ item }}</span>
                    </v-chip>
                  </template>
                </v-select>
              </v-col>
            </v-row>
          </v-container>
        </v-form>
        <v-divider></v-divider>
        <v-card-actions>
          <v-btn color="green" class="ml-6" outlined left @click="createQuery" :disabled="!valid">Create</v-btn>
          <v-btn color="blue" class="ml-1" outlined left @click="checkQuery" :loading="checkingCommand">Execute</v-btn>
          <v-spacer></v-spacer>
          <v-btn color="blue" text @click="dialog = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-snackbar color="error" v-model="alert" timeout="3000" top>Invalid connection properties. Try again with changed properties.</v-snackbar>
  </v-row>
</template>


<script>

export default {
  name: 'CommandCreate',
  components: { },
  data () {
    return {
      dialog: false,
      checkingCommand: false,
      alert: false,
      valid: false,
      rules: {
        required: value => !!value || 'Required.',
      },
      name: null,
      query_string: null,
      severities: ["LOW", "MEDIUM", "HIGH", "CRITICAL"],
      selectedSeverity: "LOW"
    }
  },
  methods: {
    setConnection(newConnection) {
      this.connection = newConnection;
    },
    changeValidity(validity) {
      this.valid = validity;
    },
    createQuery() {
      let url = `http://${location.hostname}:5000/command`

      let data = {
        name: this.name,
        query_string: this.query_string,
        severity: this.selectedSeverity
      }

      this.$http.post(url, data)
      .then((result) => {
        this.$emit('commandChange', result)
        this.resetDialog();
      })
      .catch((err) => {
        console.error(err);
        this.alert = true;
      })
    },
    checkQuery() {
      this.checkingCommand = true;
      let url = `http://${location.hostname}:5000/connection/execute`

      let data = {
        connection_id: 6,
        db_query: this.query
      }
      
      this.$http.post(url, data)
      .then((result) => {
        this.checkingCommand = false;
      })
    },
    resetDialog() {
      this.name = null;
      this.query_string = null;
      this.selectedSeverity = "LOW"
      // Required due to dirty form validation. Input fields red otherwise after save and reopen.
      this.$refs.form.resetValidation();  
      this.dialog = false;
    },
    getSeverityColor(severity) {
      if (severity === "LOW") return "green"
      if (severity === "MEDIUM") return "yellow"
      if (severity === "HIGH") return "orange"
      if (severity === "CRITICAL") return "red"
    }
  }
}
</script>


<style scoped>
</style>