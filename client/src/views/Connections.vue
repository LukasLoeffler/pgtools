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
import ManageDatabaseConnection from "../components/ManageDatabaseConnection";
import CreateDatabaseConnection from "../components/CreateDatabaseConnection";
import ConnectionInfoModal from "../components/info_modals/ConnectionInfoModal"

export default {
  name: 'Connections',
  components: { ManageDatabaseConnection, CreateDatabaseConnection, ConnectionInfoModal },
  data: function () {
    return {
      baseUrl: `http://${location.hostname}:5000`,
      connections: [],
      search: '',
      headers: [
        { text: 'Id', value: 'id' },
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
      let url = `${this.baseUrl}/connection/all`;
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
