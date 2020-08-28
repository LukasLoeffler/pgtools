<template>
  <v-container fluid fill-height>
    <v-row>
      <v-col lg="12" id=toolbar>
        <v-card>
          <v-row>
            <v-col cols="8">
              <v-btn small class="toolbar-btn" color="primary" @click="selectAll">Select All</v-btn>
              <v-btn small class="toolbar-btn" color="error" @click="deselectAll">Deselect All</v-btn>
              <v-btn small class="toolbar-btn" color="success" :loading="loading" @click="save" :disabled="!saveRequired">Save changes</v-btn>
            </v-col>
            <v-col cols="4">
              <v-select :items="connections" label="Connection" item-text="name" v-model="selectedConnection" return-object outlined dense hide-details
              class="mr-2" no-data-text="No active connection. Go to connections and select at least one"></v-select>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col lg="12" id="content">
        <v-card>
          <v-data-table v-if="tables" :headers="headers" :items="tables" class="elevation-1" :hide-default-footer="true"  :disable-pagination="true" height="85vh">
            <template v-slot:[`item.trigger_enabled`]="{ item }">
              <v-simple-checkbox v-model="item.trigger_enabled" @click="requireSave"></v-simple-checkbox>
            </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>
  </v-container>


</template>

<script>

export default {
  name: 'Triggers',
  components: {  },
  
  data: function () {
    return {
      url: 'http://localhost:5000/tables/triggers',
      tables: [],
      headers: [
        {text: 'Table', value: 'table'},
        {text: 'Trigger enabled', value: 'trigger_enabled'},
      ],
      saveRequired: false,
      loading: false,
      connections: [],
      selectedConnection: null
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
        let url = "http://localhost:5000/connection/"+this.selectedConnection.id+"/trigger";
        this.$http.post(url, this.tables)
        .then((result) => {
          this.tables = result.data;
          this.saveRequired = false;
          this.loading = false;
        })
        .catch((error) => {
          console.log(error);
          this.loading = false;
        });
    },
    requireSave() {
      this.saveRequired = true;
    },
    loadConnections() {
      let url = "http://localhost:5000/connection/all/active";
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
      let url = "http://localhost:5000/connection/"+newValue.id+"/trigger";
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
#toolbar {
  margin-bottom: 5px;
  padding: 6px;
  padding-bottom: 0;
  padding-top: 0;
}

.toolbar-btn {
  margin: 5px;
}

#content {
  padding: 6px;
}
</style>
