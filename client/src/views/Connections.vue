<template>
  <v-container fluid class="pt-0">
    <v-row>
      <v-col lg="12" id="content">
        <v-card :height="$store.getters.contentHeight">
            <v-row class="ml-1 mr-1">
              <v-col cols="5">
                <v-text-field class="mr-1" v-model="search" append-icon="mdi-magnify" outlined dense hide-details label="Connection" placeholder="Connection"/>
              </v-col>
              <v-col cols="1">
                <CreateDatabaseConnection @connectionCreate="loadData"/>
              </v-col>
              <v-col>
                <ConnectionInfoModal style="float: right;"/>
              </v-col>
            </v-row>
          <v-data-table fixed-header :headers="headers" :items="connections" :hide-default-footer="true" :disable-pagination="true" :search="search" :height="$store.getters.contentHeight">
            <template v-slot:[`item.status`]="{ item }">
              <ManageDatabaseConnection :connection="item" @connectionDelete="loadData"/>
            </template>
          </v-data-table>
        </v-card>
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
