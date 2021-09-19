<template id="temp">
  <v-container fluid>
    <v-row class="ma-1">
      <v-col cols="4">
        <v-select 
          :items="connections" 
          label="Connection" 
          item-text="name" 
          v-model="selectedConnection" 
          return-object 
          outlined 
          dense 
          hide-details
          class="mr-2" 
        >
          <template v-slot:no-data>
            <v-list-item>
              <v-list-item-action-text>
                No active connection. Go to <router-link to="/">Connections</router-link> and activate at least one
              </v-list-item-action-text>
            </v-list-item>
          </template>
        </v-select>
      </v-col>
      <v-col cols="2">
        <v-btn class="ma-1" color="success" :loading="loading" @click="save" :disabled="!saveRequired">
          SAVE
          <v-icon right>
            mdi-content-save
          </v-icon>
        </v-btn>
      </v-col>
    </v-row>
    <v-data-table
      fixed-header
      :headers="headers"
      :items="tables"
      :hide-default-footer="true"
      :disable-pagination="true"
      item-key="table"
      show-select
      v-model="selected"
      :single-select="false"
      height="calc(100vh - 150px)"
    >
      <template v-slot:[`item.trigger_enabled`]="{ item }">
        <v-simple-checkbox v-model="item.trigger_enabled" @click="requireSave"></v-simple-checkbox>
      </template>
      <template v-slot:no-data>
        <v-list-item class="justify-center">
          <v-list-item-action-text>
            No active connection. Go to <router-link to="/">Connections</router-link> and activate at least one
          </v-list-item-action-text>
        </v-list-item>
      </template>
    </v-data-table>
  </v-container>
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
        {text: 'Schema', value: 'schema'},
        {text: 'Table', value: 'table'},
        {text: 'Type', value: 'type'},
      ],
      saveRequired: false,
      loading: false,
      connections: [],
      selectedConnection: null,
      selected: []
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


        this.tables = this.tables
          .filter((table) => !this.selected.some(selectedTable => selectedTable.table === table.table))
          .map((table) => {
            table.trigger_enabled = false;
            return table;
          });

        this.selected = this.selected
          .map((table) => {
            table.trigger_enabled = true;
            return table;
          });

        const payload = this.tables.concat(this.selected);

        let url = `${this.baseUrl}/connection/${this.selectedConnection.id}/trigger`;
        this.$http.post(url, payload)
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

        this.selected = this.tables.filter((table) => table.trigger_enabled);
        this.$nextTick(() => this.saveRequired = false );
      })
      .catch((error) => {
        console.log(error);
      })
    },
    selected() {
      this.saveRequired = true;
    }
  }
}
</script>

<style scoped>
</style>
