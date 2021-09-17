<template>
  <v-container fluid class="p-0 mb-5" v-resize="updateTableDistance">
      <v-row>
        <v-col class="px-0">
          <v-row class="ml-1">
            <v-col cols="6">
              <v-select :items="connections" label="Connection" item-text="name" v-model="selectedConnection"
                return-object outlined dense hide-details :no-data-text="noDataText">
              </v-select>
            </v-col>
            <v-col class="ml-1" cols="2">
              <CreateCommand @commandChange="loadCommands" class="mt-0"/>
            </v-col>
          </v-row>
          <CommandTable
            :height="`calc(100vh - ${tableDistanceTop}px)`"
            :commands="commands" 
            :selectedConnection="selectedConnection"                         
            @commandChange="loadCommands" 
            @commandData="handleCommandData"
          />
        </v-col>
        <transition name="fade">
          <v-col v-if="commandData">
            <CommandOutput :commandData="commandData" class="mr-1"/>
          </v-col>
        </transition>
      </v-row>
  </v-container>
</template>

<script>
import CreateCommand from "../components/CreateCommand";
import CommandOutput from "../components/CommandOutput";
import CommandTable from '../components/commands/CommandTable.vue';

export default {
  name: 'Commands',
  components: { CreateCommand, CommandOutput, CommandTable },
  
  data: () => {
    return {
      connections: [],
      selectedConnection: null,
      noDataText: "Keine Verbindungen vorhanden",
      baseUrl: `http://${location.hostname}:5000`,
      commands: [],
      commandData: null,
      tableDistanceTop: 115
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
    },
    updateTableDistance() {
      try {
        // 24px for padding of col
        this.tableDistanceTop = this.$refs.table.getBoundingClientRect().top + 24;
      } catch {/** */}
    },
  },
  created() {
    this.loadConnections();
    this.loadCommands();
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
