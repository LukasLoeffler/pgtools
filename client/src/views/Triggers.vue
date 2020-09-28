<template id="temp">
  <v-card class="ma-2" :height="cardHeight">
    <v-row ref="ctrlBar">
      <v-col cols="8">
        <v-btn small class="ma-1" color="primary" @click="selectAll">Select All</v-btn>
        <v-btn small class="ma-1" color="error" @click="deselectAll">Deselect All</v-btn>
        <v-btn small class="ma-1" color="success" :loading="loading" @click="save" :disabled="!saveRequired">Save changes</v-btn>
      </v-col>
      <v-col cols="4">
        <v-select :items="connections" label="Connection" item-text="name" v-model="selectedConnection" return-object outlined dense hide-details
        class="mr-2" :no-data-text="noDataText"></v-select>
      </v-col>
    </v-row>
    <v-data-table v-if="tables" :headers="headers" :items="tables" class="elevation-1" :hide-default-footer="true"  :disable-pagination="true" :height="tableHeight" :no-data-text="noDataText">
      <template v-slot:[`item.trigger_enabled`]="{ item }">
        <v-simple-checkbox v-model="item.trigger_enabled" @click="requireSave"></v-simple-checkbox>
      </template>
    </v-data-table>
  </v-card>
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
  computed: {
    tableHeight() {
      return (this.$store.getters.contentHeight-this.ctrlBarHeight)+"px";
    },
    cardHeight() {
      return (this.$store.getters.contentHeight)+"px";
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
  mounted() {
    this.ctrlBarHeight = this.$refs.ctrlBar.clientHeight;
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
