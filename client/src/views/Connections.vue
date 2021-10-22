<template>
  <v-container fluid>
    <v-row>
      <v-col id="content">
        <v-row>
          <v-col cols="5">
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

export default {
  name: 'Connections',
  components: { ManageDatabaseConnection, CreateDatabaseConnection, ConnectionInfoModal },
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
        { text: 'Status', value: 'status' }
      ],
    }
  },
  methods: {
    loadData() {
      let url = `${BASE_URL}/connection/all`;
      this.$http.get(url)
      .then((result) => {
        this.connections = result.data;
      });
    }
  },
    created() {
      this.loadData();
  },

}
</script>

<style scoped>
</style>
