<template id="temp">
  <v-container fluid class="pr-1 pb-1">
    <v-row class="ma-1">
      <v-col cols="4" class="pr-1 pl-0">
        <v-text-field
          outlined
          dense
          v-model="search"
          placeholder="Search"
          label="Search"
          append-icon="mdi-magnify"
          hide-details
        ></v-text-field>
      </v-col>
      <v-col cols="4" class="pr-1 pl-1">
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
      <v-col cols="1" class="pr-1 pl-1">
        <ButtonContainer outlined>
          <v-btn 
            icon
            :loading="saving" 
            @click="save" 
            :disabled="!saveRequired"
          >
            <v-icon>
              mdi-content-save-outline
            </v-icon>
          </v-btn>
          <v-btn 
            icon
            :loading="loading" 
            @click="reload" 
          >
            <v-icon>
              mdi-reload
            </v-icon>
          </v-btn>
        </ButtonContainer>
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
      :search="search"
    >
      <template v-slot:[`item.hookEnabled`]="{ item }">
        <v-simple-checkbox 
          v-model="item.hookEnabled"
          @click="requireSave"
        ></v-simple-checkbox>
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
import DropSelect from '../components/misc/DropSelect.vue';
import { BASE_URL } from '@/main'
import ButtonContainer from '../components/misc/ButtonContainer.vue';

export default {
  name: 'Triggers',
  components: { DropSelect, ButtonContainer  },
  props: ["connectionId"],
  data: function () {
    return {
      tables: [],
      headers: [
        {text: 'Table', value: 'table'},
        {text: 'Schema', value: 'schema'},
        {text: 'Type', value: 'type'},
      ],
      saveRequired: false,
      loading: false,
      saving: false,
      connections: [],
      selectedConnection: null,
      selected: [],
      search: ""
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
    reload() {
      this.loadHooks();
    },
    save() {
        this.saving = true;
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

        let url = `${BASE_URL}/hooks/set/${this.selectedConnection.id}`;
        this.$http.post(url, payload)
          .then((result) => {
            this.tables = result.data;
            this.saveRequired = false;
          })
          .catch((error) => {
            console.error(error);
          })
          .finally(() => {
            this.saving = false;
          });
    },
    requireSave() {
      this.saveRequired = true;
    },
    loadConnections() {
      let url = `${BASE_URL}/connection/all`;
      this.$http.get(url)
      .then((result) => {
        this.connections = result.data;
        if (result.data[0]){

          if(this.$route.params.connectionId) {
            this.selectedConnection = result.data.find(connection => connection.id === this.$route.params.connectionId);
          }
          if (!this.selectedConnection) this.selectedConnection = result.data[0];
        }
      });
    },
    loadHooks() {
      let url = `${BASE_URL}/hooks/${this.selectedConnection.id}`;
      this.loading = true;
      this.$http.get(url)
        .then((result) => {
          this.tables = result.data;
          this.selected = this.tables.filter((table) => table.hookEnabled);
          this.$nextTick(() => this.saveRequired = false );
        })
        .catch((error) => {
          console.error(error);
        })
        .finally(() => {
          this.loading = false;
        });
    }
  },
  created() {
    this.loadConnections();
  },
  watch: {
    selectedConnection(newSelectedConnection) {
      this.loadHooks();
    },
    selected() {
      this.saveRequired = true;
    }
  }
}
</script>
