<template>
  <v-row>
        <div style="display: flex; flex-direction: row; flex-wrap: nowrap">
          <v-btn icon class="mr-1" @click="executeCommand">
            <v-icon color="green">mdi-play-circle-outline</v-icon>
          </v-btn>
            <CommandCreateEdit 
              mode="EDIT"
              :command="commandCopy"
              @commandChange="handleCommandChange"
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
import colorHelper from '@/mixins/color-helper.js'
import { BASE_URL } from '@/main'

export default {
  name: 'ManageCommand',
  components: { CommandCreateEdit },
  mixins: [colorHelper],
  props: {
    command: Object,
    connection: Object
  },
  data () {
    return {
      dialog: false,
      valid: false,
      rules: {
        required: value => !!value || 'Required.',
      },
      name: null,
      commandCopy: JSON.parse(JSON.stringify(this.command)),
      severities: ["LOW", "MEDIUM", "HIGH"],
      alert: false,
      alertMessage: null
    }
  },
  methods: {
    executeCommand() {
      let url = `${BASE_URL}/command/execute`
      let data = {
        connectionId: this.connection.id,
        query: this.command.query
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
    handleCommandChange(data) {
      this.$emit('commandChange', data);
    },
    saveCommand() {
      let url = `${BASE_URL}/command/${this.command.id}`
      this.$http.put(url, this.localCommand)
      .then((result) => {
        this.$emit('commandChange', result)
        this.dialog = false;
      })
    },
    deleteCommand() {
      let url = `${BASE_URL}/command/${this.command.id}`
      this.$http.delete(url)
      .then((result) => {
        this.$emit('commandChange', result)
        this.dialog = false;
      })
    },
  },
  created() {},
}
</script>


<style scoped>
</style>