<template>
  <v-container fluid class="pt-0">
    <v-row :height="$store.getters.contentHeight">
      <v-col lg="12" id="content">
        <v-card>
          <v-col id="search-bar">
            <v-row align="center" justify="center">
              <v-text-field class="ml-1 mr-1" v-model="table" append-icon="mdi-magnify" outlined dense hide-details label="Table" placeholder="Table"/>
              <v-text-field class="ml-1 mr-1" v-model="dataID" append-icon="mdi-magnify" outlined dense hide-details label="Data ID"  placeholder="Data ID"/>
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-switch class="ml-1 mr-1" v-on="on" v-model="detailActive" hint="">Toggle detail mode</v-switch>
                </template>
                <span>Toggle detail mode</span>
              </v-tooltip>
            </v-row>
          </v-col>
          <v-data-table v-if="!detailActive" id="event-table" item-key="index" fixed-header :headers="headers" :items="$store.getters.events" :hide-default-footer="true" 
          :disable-pagination="true" :sort-by="['index']" :sort-desc="[false]" :search="table" :custom-filter="filter" height="80vh">
            <template v-slot:item.action="{ item }">
              <v-chip label small :color="getColor(item.action)">{{ item.action }}</v-chip>
            </template>
            <template v-slot:item.filter="{ item }">
              <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn label small @click="setFilter(item)" v-bind="attrs" v-on="on">
                      <unicon name="filter"></unicon>
                    </v-btn>
                  </template>
                  <span>Set as Filter</span>
                </v-tooltip>
            </template>
          </v-data-table>
          <v-simple-table v-if="detailActive" height="80vh">
            <template v-slot:default>
              <thead>
                <tr>
                  <th>Index</th>
                  <th>Operation</th>
                  <th v-for="header in headersDetailed" v-bind:key="header">{{header}}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="event in filteredEvents" :key="event.id">
                  <td>{{event.index}}</td>
                  <td><v-chip label small :color="getColor(event.action)">{{ event.action }}</v-chip></td>
                  <td v-for="object in Object.entries(event.data)" :key="object[0]" v-bind:class="{ changed: changed(event, object[0]) }">
                    <v-tooltip v-if="changed(event, object[0])" left>
                      <template v-slot:activator="{ on, attrs }">
                        <p label small @click="setFilter(item)" v-bind="attrs" v-on="on">
                          {{object[1]}}
                        </p>
                      </template>
                      <span>old value: {{event.data_old[object[0]]}}</span>
                    </v-tooltip>
                    <p v-else>
                      {{object[1]}}
                    </p>
                  </td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
        </v-card>
      </v-col>
    </v-row>
    <v-snackbar color="blue-grey" v-model="alert" :vertical="vertical" timeout="3000" top>
        No filter set. Resetting to event mode.
      <template v-slot:action="{ attrs }">
        <v-btn color="primary" small v-bind="attrs" @click="resetToEventMode()">Reset</v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<script>


export default {
  name: 'Watcher',
  components: { },
  data: function () {
    return {
      search: "",
      headers: [
        { text: 'Index', value: 'index' },
        { text: 'Time', value: 'timestamp' },
        { text: 'Tabelle', value: 'table' },
        { text: 'Data ID', value: 'data.id' },
        { text: 'Operation', value: 'action' },
        { text: 'Filter', value: 'filter' },
      ],
      headersDetailed: [],
      table: "",
      dataID: null,
      detailActive: false,
      filteredEvents: [],
      keys: [],
      alert: false
    }
  },
  methods: {
    getColor (action) {
      if (action === "INSERT") return "green";
      if (action === "UPDATE") return "orange";
      if (action === "DELETE") return "red";
      else return 'blue';
    },
    changed(item, key) {
      if(item["data"][key] === item["data_old"][key]) {
        return false;
      } else {
        return true;
      }
    },
    filter(value, search, item) {
      return value != null &&
        typeof value === 'string' &&
        item.table === this.table && item.data.id == this.dataID
    },
    setFilter(item) {
      this.table = item.table;
      this.dataID = item.data.id;
      //this.detailActive = true;
    },
    /**
     * Method is called when filter is refreshed.
     * Filters the events and the headers for the table according the filter.
     * Current fields used for filtering are dataID and table.
     */
    refreshTableAndSelection() {
      if(this.table && this.dataID) {
        this.headersDetailed = [];
        this.filteredEvents = this.$store.getters.events.filter(event => event.data.id === this.dataID && event.table === this.table);
        this.headersDetailed = Object.keys(this.filteredEvents[0]["data"]);
      }
    },
    /**
     * Resets the current filter (table and dataID)
     * Refreshes the table and the selection accordingly by calling the respective method.
     * Sets the mode to 0 (event view) because without filter multiple incompatible events can occur.
     */
    resetFilter() {
      this.table = "";
      this.dataID = null;
      this.refreshTableAndSelection();
      this.detailActive = false;
    },
    resetToEventMode() {
      this.detailActive = false;
      this.alert = false;
    }
  },
  computed: {
    events() {
      return this.$store.getters.events;
    },
    resetEnabled() {
      if (this.table || this.dataID) {
        return true;
      }
      return false;
    }
  },
  watch: {
    detailActive(newState, oldState) {
      if (newState && !this.table && !this.dataID) {
        this.alert = true;
      }
      else {
        this.refreshTableAndSelection();
      }
    },
    events() {
      this.refreshTableAndSelection();
    },
    alert(newState){
      if (!newState) {
        this.detailActive = false;
      }
    }
  },
  mounted() {},
  created() {}
}
</script>


<style scoped>

.changed {
  background-color: lightcoral;
}

</style>
