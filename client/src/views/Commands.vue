<template>
  <v-container fluid class="p-0 mb-5">
    <v-card :height="$store.getters.contentHeight">
      <v-row>
        <v-col>
          <v-row class="ml-1" ref="selRow">
            <v-col cols="6" class="pt-0">
              <v-select :items="connections" label="Connection" item-text="name" v-model="selectedConnection"
                return-object outlined dense hide-details :no-data-text="noDataText">
              </v-select>
            </v-col>
            <v-col cols="1" class="pt-0" :height="tableHeight">
              <CreateCommand @commandChange="loadCommands"/>
            </v-col>
            </v-row>
              <v-simple-table :height="tableHeight" class="mr-1">
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
                      <ManageCommand :command="command" :connection="selectedConnection" @commandChange="loadCommands" @commandData="handleCommandData"/>
                    </td>
                  </tr>
                </tbody>
              </template>
            </v-simple-table>    
        </v-col>
        <transition name="fade">
          <v-col v-if="commandData">
            <CommandOutput :commandData="commandData" class="mr-1" style="position: absolute; bottom: 12px; top: 12px; right: 12px; left: 50%"/>
          </v-col>
        </transition>
      </v-row>
    </v-card>
  </v-container>
</template>

<script>
import CreateCommand from "../components/CreateCommand";
import ManageCommand from "../components/ManageCommand";
import CommandOutput from "../components/CommandOutput";

export default {
  name: 'Commands',
  components: { CreateCommand, ManageCommand, CommandOutput },
  
  data: () => {
    return {
      connections: [],
      selectedConnection: null,
      noDataText: "Keine Verbindungen vorhanden",
      baseUrl: `http://${location.hostname}:5000`,
      commands: [],
      commandData: null,
      tableHeight: null
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
    },
    handleCommandData(data) {
      this.commandData = data;
    }
  },
  created() {
    this.loadConnections();
    this.loadCommands();
    console.log("Commands Created");
  },
  updated() {
    let selectionRowHeight = this.$refs.selRow.clientHeight;
    this.tableHeight = this.$store.getters.contentHeight-selectionRowHeight-16+"px";
    console.log(this.tableHeight);
  },
}
</script>

<style scoped>

.fade-enter-active, .fade-leave-active {
  transition: opacity .7s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
