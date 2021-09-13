<template id="temp">
  <v-sheet>
    <v-row class="mt-0">
      <v-col cols="8">
        <v-btn class="ma-1" outlined color="primary" @click="selectAll">Select All</v-btn>
        <v-btn class="ma-1" outlined color="error" @click="deselectAll">Deselect All</v-btn>
        <v-btn class="ma-1" outlined color="success" :loading="loading" @click="save" :disabled="!saveRequired">Save changes</v-btn>
      </v-col>
      <v-col cols="4">
        <v-select :items="connections" label="Connection" item-text="name" v-model="selectedConnection" return-object outlined dense hide-details
        class="mr-2" :no-data-text="noDataText"></v-select>
      </v-col>
    </v-row>
    <v-data-table v-if="tables" :headers="headers" :items="tables" class="elevation-1" :hide-default-footer="true"  :disable-pagination="true" :no-data-text="noDataText">
      <template v-slot:[`item.trigger_enabled`]="{ item }">
        <v-simple-checkbox v-model="item.trigger_enabled" @click="requireSave"></v-simple-checkbox>
      </template>
    </v-data-table>
  </v-sheet>
</template>

<script>

export default {
  name: 'Triggers',
  components: {  },
  
  data: function () {
    return {
      baseUrl: `http://${location.hostname}:5000`,
      tables: [],
      headers: [
        {text: 'Table', value: 'table'},
        {text: 'Trigger enabled', value: 'trigger_enabled'},
      ],
      saveRequired: false,
      loading: false,
      connections: [],
      selectedConnection: null,
      ctrlBarHeight: 0,
      noDataText: "No active connection. Go to Connections and activate at least one"
    }
  },
  methods: {
    selectAll() {
      this.tables.forEach(element => {
        element['trigger_enabled'] = true;
        this.saveRequired = true;
      });
    },
    deselectAll() {
      this.tables.forEach(element => {
        element['trigger_enabled'] = false;
        this.saveRequired = true;
      });
    },
    save() {
        this.loading = true;
        let url = `${this.baseUrl}/connection/${this.selectedConnection.id}/trigger`;
        this.$http.post(url, this.tables)
        .then((result) => {
          this.tables = result.data;
          this.saveRequired = false;
          this.loading = false;
        })
        .catch((error) => {
          console.error(error);
          this.loading = false;
        });
    },
    requireSave() {
      this.saveRequired = true;
    },
    loadConnections() {
      let url = `${this.baseUrl}/connection/all/active`;
      this.$http.get(url)
      .then((result) => {
        this.connections = result.data;
        if (result.data[0]){
          this.selectedConnection = result.data[0];
        }
      });
    }
  },
  created() {
    this.loadConnections();
  },
  watch: {
    selectedConnection(newValue) {
      let url = `${this.baseUrl}/connection/${newValue.id}/trigger`;
      this.$http.get(url)
      .then((result) => {
        this.tables = result.data;
      })
      .catch((error) => {
        console.log(error);
      })
    }
  }
}
</script>

<style scoped>
</style>
