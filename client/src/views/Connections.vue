<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <v-row>
          <v-col 
            cols="5" 
            class="pl-2"
          >
            <v-text-field
              class="ma-1" 
              v-model="search" 
              append-icon="mdi-magnify"
              outlined
              dense 
              hide-details 
              label="Connection" 
              placeholder="Connection"
            />
          </v-col>
          <v-col cols="1">
            <CreateDatabaseConnection @connectionCreate="loadData" class="mt-1"/>
          </v-col>
          <v-col>
            <ConnectionInfoModal style="float: right;" class="mt-1"/>
          </v-col>
        </v-row>
        <v-data-table
          fixed-header 
          :headers="headers"
          :disable-pagination="true"
          :hide-default-footer="true"
          :items="connections" 
          :search="search"
          height="calc(100vh - 120px)"
          sort-by="name"
        >
          <template v-slot:[`item.status`]="{ item }">
            <ManageDatabaseConnection :connection="item" @connectionDelete="loadData"/>
          </template>
          
          <template v-slot:[`item.hooks`]="{ item }">
            <HookIndicator :connection="item"/>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import ManageDatabaseConnection from "../components/connection/ManageDatabaseConnection.vue";
import CreateDatabaseConnection from "../components/connection/CreateDatabaseConnection.vue";
import ConnectionInfoModal from "../components/info-modals/ConnectionInfoModal"
import { BASE_URL } from '@/main'
import HookIndicator from '../components/connection/HookIndicator.vue';

export default {
  name: 'Connections',
  components: { ManageDatabaseConnection, CreateDatabaseConnection, ConnectionInfoModal, HookIndicator },
  data: function () {
    return {
      connections: [],
      search: '',
      headers: [
        { text: 'Name', value: 'name' },
        { text: 'Database', value: 'database' },
        { text: 'User', value: 'user' },
        { text: 'Host', value: 'host' },
        { text: 'Port', value: 'port' },
        { text: 'Status', value: 'status' },
        { text: 'Hooked', value: 'hooks' },
      ],
    }
  },
  methods: {
    loadData() {
      this.$http.get(`${BASE_URL}/connection/all`)
        .then((result) => {
          this.connections = result.data;
        });
    }
  },
  created() {
    this.loadData();
  },
  watch: {
    '$store.getters.websocketStatus': function(connected) {
      if (connected) this.loadData();
    }
  }
}
</script>

<style scoped>
</style>
