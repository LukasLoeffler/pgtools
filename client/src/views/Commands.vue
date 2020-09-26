<template>
  <v-container fluid class="p-0">
    <v-card>
      <v-row class="ml-1">
        <v-col cols="4" class="">
          <v-select :items="connections" label="Connection" item-text="name" v-model="selectedConnection"
            return-object outlined dense hide-details :no-data-text="noDataText">
          </v-select>
        </v-col>
        <v-col cols="1" class="">
          <CreateCommand/>
        </v-col>
        </v-row>
          <v-simple-table height="80vh">
          <template v-slot:default>
            <thead>
              <tr>
                <th>Index</th>
                <th>Name</th>
                <th>Severity</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="command in commands" :key="command.id">
                <td>{{command.id}}</td>
                <td>{{command.name}}</td>
                <td><v-chip label small :color="getSeverityColor(command.severity)">{{ command.severity }}</v-chip></td>
                <td>
                  <ManageCommand :command="command" :connection="selectedConnection"/>
                </td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>    
    </v-card>
  </v-container>
</template>

<script>
import CreateCommand from "../components/CreateCommand";
import ManageCommand from "../components/ManageCommand";

export default {
  name: 'Commands',
  components: { CreateCommand, ManageCommand },
  
  data: () => {
    return {
      connections: [],
      selectedConnection: null,
      noDataText: "Keine Verbindungen vorhanden",
      baseUrl: `http://${location.hostname}:5000`,
      commands: [],
    }
  },
  methods: {
    loadConnections() {
      let url = `${this.baseUrl}/connection/all`;
      this.$http.get(url)
      .then((result) => {
        this.connections = result.data;
        if (result.data[0]){
          this.selectedConnection = result.data[0];
        }
      });
    },
    loadCommands() {
      let url = `${this.baseUrl}/command/all`;
      this.$http.get(url)
      .then((result) => {
        this.commands = result.data;
      });
    },
    getSeverityColor(severity) {
      if (severity === "LOW") return "green"
      if (severity === "MEDIUM") return "yellow"
      if (severity === "HIGH") return "orange"
      if (severity === "CRITICAL") return "red"
    }
  },
  created() {
    this.loadConnections();
    this.loadCommands();
  },
  mounted() {},
}
</script>

<style scoped>
</style>
