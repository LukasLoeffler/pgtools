<template>
  <v-row>
        <div style="display: flex; flex-direction: row; flex-wrap: nowrap">
          <v-btn icon class="mr-1" @click="executeCommand">
            <v-icon color="green">mdi-play-circle-outline</v-icon>
          </v-btn>
            <CommandCreateEdit 
              mode="EDIT"
            >
              <template v-slot:activator>
                <v-btn icon class="mr-1">
                  <v-icon color="#46a2d4">mdi-pencil-circle-outline</v-icon>
                </v-btn>
              </template>
            </CommandCreateEdit>
          <v-btn icon class="mr-1" @click="deleteCommand">
            <v-icon color="red">mdi-delete-circle-outline</v-icon>
          </v-btn>
        </div>

    <v-snackbar color="warning" v-model="alert" timeout="3000" top>{{alertMessage}}</v-snackbar>
  </v-row>
</template>

<script>
import CommandCreateEdit from "./CommandCreateEdit";

export default {
  name: 'ManageCommand',
  components: { CommandCreateEdit },
  props: {
    command: Object,
    connection: Object
  },
  data () {
    return {
      baseUrl: `http://${location.hostname}:5000`,
      dialog: false,
      valid: false,
      rules: {
        required: value => !!value || 'Required.',
      },
      name: null,
      query_string: null,
      localCommand: JSON.parse(JSON.stringify(this.command)),
      severities: ["LOW", "MEDIUM", "HIGH", "CRITICAL"],
      alert: false,
      alertMessage: null
    }
  },
  methods: {
    executeCommand() {
      let url = `${this.baseUrl}/connection/execute`
      let data = {
        connection_id: this.connection.id,
        db_query: this.command.query_string
      }
      this.$http.post(url, data)
        .then((result) => {
          this.$emit('commandData', result.data);
          if (result.data.status !== "success") {
            this.alertMessage = result.data.message;
            this.alert = true;
          }
      })
    },
    saveCommand() {
      let url = `${this.baseUrl}/command/${this.command.id}`
      this.$http.put(url, this.localCommand)
      .then((result) => {
        this.$emit('commandChange', result)
        this.dialog = false;
      })
    },
    deleteCommand() {
      let url = `${this.baseUrl}/command/${this.command.name}`
      this.$http.delete(url)
      .then((result) => {
        this.$emit('commandChange', result)
        this.dialog = false;
      })
    },
    getSeverityColor(severity) {
      if (severity === "LOW") return "green  lighten-2"
      if (severity === "MEDIUM") return "orange  lighten-2"
      if (severity === "HIGH") return "red  lighten-2"
    }
  },
  created() {},
}
</script>


<style scoped>
</style>