<template id="temp">
  <v-container fluid class="pr-1 pb-1">
    <v-row class="ma-1">
      <v-col cols="4">
        <DropSelect v-model="selectedConnection" :items="connections">
          <template slot="no-data">
            <v-list-item>
              <v-list-item-action-text>
              No active connection. Go to <router-link to="/">Connections</router-link> and create at least one
              </v-list-item-action-text>
            </v-list-item>
          </template>
        </DropSelect>
      </v-col>
      <v-col cols="2">
        <v-btn color="success" :loading="loading" @click="save" :disabled="!saveRequired">
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
      <template v-slot:[`item.hookEnabled`]="{ item }">
        <v-simple-checkbox v-model="item.hookEnabled" @click="requireSave"></v-simple-checkbox>
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
import DropSelect from '../components/ubiquitous/DropSelect.vue';

export default {
  name: 'Triggers',
  components: { DropSelect  },
  
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
        element['hookEnabled'] = true;
        this.saveRequired = true;
      });
    },
    deselectAll() {
      this.tables.forEach(element => {
        element['hookEnabled'] = false;
        this.saveRequired = true;
      });
    },
    save() {
        this.loading = true;


        this.tables = this.tables
          .filter((table) => !this.selected.some(selectedTable => selectedTable.table === table.table))
          .map((table) => {
            table.hookEnabled = false;
            return table;
          });

        this.selected = this.selected
          .map((table) => {
            table.hookEnabled = true;
            return table;
          });

        const payload = this.tables.concat(this.selected);

        let url = `${this.baseUrl}/hooks/set/${this.selectedConnection.name}`;
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
      let url = `${this.baseUrl}/connection/all`;
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
      let url = `${this.baseUrl}/hooks/${newValue.name}`;
      this.$http.get(url)
      .then((result) => {
        this.tables = result.data;

        this.selected = this.tables.filter((table) => table.hookEnabled);
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
