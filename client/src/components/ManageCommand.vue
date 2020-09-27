<template>
  <v-row>
    <v-dialog v-model="dialog" max-width="600px">
      <template v-slot:activator="{ on, attrs }">
        <div>
          <v-btn text x-small class="mr-1" @click="executeCommand">
            <unicon name="play" fill="green"></unicon>
          </v-btn>
          <v-btn text x-small class="mr-1" v-bind="attrs" v-on="on">
            <unicon name="pen" fill="#46a2d4"></unicon>
          </v-btn>
          <v-btn text x-small class="mr-1" @click="deleteCommand">
            <unicon name="trash-alt" fill="red"></unicon>
          </v-btn>
        </div>
      </template>
      <v-card>
        <v-card-title>
          <span class="headline">Edit command</span>
        </v-card-title>
        <v-form v-model="valid">
          <v-container class="pl-7">
            <v-row>
              <v-col cols="12">
                <v-text-field label="Name" v-model="localCommand.name" :rules="[rules.required]"></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field label="Query" v-model="localCommand.query_string" :rules="[rules.required]"></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-select :items="severities" label="Severty" v-model="localCommand.severity" chips>
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
          <v-btn color="green" outlined left class="ml-7" @click="saveCommand">Save</v-btn>
          <v-spacer></v-spacer>
          <v-btn color="blue" text @click="dialog=false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-snackbar color="warning" v-model="alert" timeout="3000" top>{{alertMessage}}</v-snackbar>
  </v-row>
</template>

<script>


export default {
  name: 'ManageCommand',
  components: {  },
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
      console.log(`Executing Command ${this.command.name} onto ${this.connection.id}`)
      let url = `${this.baseUrl}/connection/execute`
      let data = {
        connection_id: this.connection.id,
        db_query: this.command.query_string
      }
      this.$http.post(url, data)
        .then((result) => {
          console.log("QueryResult: ", result.data)

          if (result.data.status === "success") {
            console.log("Success");
          } else {
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
      let url = `${this.baseUrl}/command/${this.command.id}`
      this.$http.delete(url)
      .then((result) => {
        this.$emit('commandChange', result)
        this.dialog = false;
      })
    },
    getSeverityColor(severity) {
      if (severity === "LOW") return "green"
      if (severity === "MEDIUM") return "yellow"
      if (severity === "HIGH") return "orange"
      if (severity === "CRITICAL") return "red"
    }
  },
  created() {},
}
</script>


<style scoped>
</style>