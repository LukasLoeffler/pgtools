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
          <v-btn text x-small class="mr-1">
            <unicon name="trash-alt" fill="red"></unicon>
          </v-btn>
        </div>
      </template>
      <v-card>
        <v-card-title>
          <span class="headline">Manage command</span>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-actions>
          <v-btn color="green" outlined left class="ml-7">Save</v-btn>
          <v-btn color="red" outlined left>Delete</v-btn>
          <v-spacer></v-spacer>
          <v-btn color="blue" text>Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
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
    }
  },
  methods: {
    executeCommand() {
      console.log(`Executing Command ${this.command.name} onto ${this.connection.id}`)
      let url = `http://${location.hostname}:5000/connection/execute`
      let data = {
        connection_id: this.connection.id,
        db_query: this.command.query_string
      }
      this.$http.post(url, data)
        .then((result) => {
          console.log(result)
      })
    }
  },
  created() {},
}
</script>


<style scoped>
</style>