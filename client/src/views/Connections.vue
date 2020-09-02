<template>
  <v-container fluid class="pt-0">
    <v-row>
      <v-col lg="12" id="content">
        <v-card :height="$store.getters.contentHeight">
            <v-row class="ml-1 mr-1">
              <v-col cols="11">
                <v-text-field class="ml-1 mr-1" v-model="search" append-icon="mdi-magnify" outlined dense hide-details label="Table" placeholder="Table"/>
              </v-col>
              <v-col cols="1">
                <CreateDatabaseConnection @connectionCreate="loadData"/>
              </v-col>
            </v-row>

          <v-data-table fixed-header :headers="headers" :items="connections" :hide-default-footer="true" :disable-pagination="true" :search="search" :height="$store.getters.contentHeight">
            <template v-slot:[`item.status`]="{ item }">
              <DatabaseConnection :connection="item" @connectionDelete="loadData"/>
            </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import DatabaseConnection from "../components/DatabaseConnection";
import CreateDatabaseConnection from "../components/CreateDatabaseConnection";

export default {
  name: 'Connections',
  components: { DatabaseConnection, CreateDatabaseConnection },
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
        { text: 'Status', value: 'status', align: 'left' }
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
