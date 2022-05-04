<template>
  <v-container fluid class="p-0 mb-5" v-resize="updateTableDistance">
      <v-row>
        <v-col class="px-0">
          <v-row class="ml-1">
            <v-col cols="6">
              <DropSelect 
                v-model="selectedConnection" 
                :items="connections"
              />
            </v-col>
            <v-col class="ml-1" cols="2">
              <CommandCreateEdit 
                @commandChange="loadCommands" 
                class="mt-0"
                mode="CREATE"
              />
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
          <v-col v-if="commandData" class="pr-1">
            <CommandOutput :commandData="commandData" class="mr-1"/>
          </v-col>
        </transition>
      </v-row>
  </v-container>
</template>

<script>
import CommandCreateEdit from "../components/commands/CommandCreateEdit";
import CommandOutput from "../components/commands/CommandOutput";
import CommandTable from '../components/commands/CommandTable.vue';
import DropSelect from '../components/misc/DropSelect.vue'
import { BASE_URL } from '@/main'

export default {
  name: 'Commands',
  components: { CommandCreateEdit, CommandOutput, CommandTable, DropSelect },
  data: () => {
    return {
      connections: [],
      selectedConnection: null,
      noDataText: "Keine Verbindungen vorhanden",
      commands: [],
      commandData: null,
      tableDistanceTop: 115
    }
  },
  methods: {
    async loadConnections() {
      let url = `${BASE_URL}/connection/all`;
      this.connections = (await this.$http.get(url)).data;

      let urlActive = `${BASE_URL}/connection/all/active`;
      const activeConnections = (await this.$http.get(urlActive)).data;

      if (activeConnections.length === 0 && this.connections[0]) {
        this.selectedConnection = this.connections[0];
      } else {
        this.selectedConnection = this.connections.find(connection => connection.id === activeConnections[0].id);
      }
    },
    loadCommands() {
      let url = `${BASE_URL}/command/all`;
      this.$http.get(url)
      .then((result) => {
        this.commands = result.data;
      });
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
