<template>
  <v-container fluid class="pa-2" v-resize="updateTableHeight">
      <v-row ref="filterRow" align="center" justify="center" class="px-4">
        <v-text-field class="ml-1 mr-1" v-model="database" append-icon="mdi-magnify" outlined dense hide-details label="Database" placeholder="Database"/>
        <v-text-field class="ml-1 mr-1" v-model="table" append-icon="mdi-magnify" outlined dense hide-details label="Table" placeholder="Table" :disabled="!database"/>
        <v-text-field class="ml-1 mr-1" v-model="dataId" append-icon="mdi-magnify" outlined dense hide-details label="Data ID" placeholder="Data ID" :disabled="!table"/>
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-switch class="ml-1 mr-1" v-on="on" inset v-model="detailActive" :disabled="!table&&!dataId">Toggle detail mode</v-switch>
          </template>
          <span>Toggle detail mode</span>
        </v-tooltip>
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-btn class="mr-2" v-on="on" @click="resetFilter()" :disabled="!table&&!dataId&&!database">
              <unicon name="filter-slash"></unicon>
            </v-btn>
          </template>
          <span>Reset filter</span>
        </v-tooltip>
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-btn class="mr-2" v-on="on"  @click="clearEvents()">
              <v-icon color="red">mdi-delete-sweep-outline</v-icon>
            </v-btn>
          </template>
          <span>Clear events</span>
        </v-tooltip>
      </v-row>
      <v-row>
        <v-col ref="table">
          <v-data-table
            v-if="!detailActive" 
            id="event-table" 
            item-key="index" 
            fixed-header 
            :headers="headers" 
            :items="$store.getters.events" 
            :hide-default-footer="true" 
            :disable-pagination="true" 
            multi-sort 
            :sort-by="['index']" 
            :sort-desc="[true]" 
            :search="database" 
            :custom-filter="filter" 
            :height="`calc(100vh - ${tableDistanceTop}px)`"
          >
            <template v-slot:[`item.action`]="{ item }">
              <v-chip label small :color="getColor(item.action)">{{ item.action }}</v-chip>
            </template>
            <template v-slot:[`item.database`]="{ item }">
              <a @click="setDatabaseFilter(item)">{{ item.database }}</a>
            </template>
            <template v-slot:[`item.table`]="{ item }">
              <a @click="setTableFilter(item)">{{ item.table }}</a>
            </template>
            <template v-slot:[`item.data.id`]="{ item }">
              <a @click="setDataIdFilter(item)">{{ item.data.id }}</a>
            </template>
          </v-data-table>
        </v-col>
      </v-row>
      <!-- Detail table to view data. -->
      <DetailTable ref="detailTable" v-show="detailActive" :table="table" :dataId="dataId" :rootVisible="detailActive"/>
    <v-snackbar v-model="alert" color="warning" timeout="3000" top>
      Invalid filter. Database and table are required. Automatically resetting to event mode now.
    </v-snackbar>
  </v-container>
</template>


<script>
import DetailTable from "../components/DetailTable";

export default {
  name: 'Watcher',
  components: { DetailTable },
  data: function () {
    return {
      search: "",
      headers: [
        { text: 'Index', value: 'index' },
        { text: 'Time', value: 'timestamp' },
        { text: 'Database', value: 'database' },
        { text: 'Table', value: 'table' },
        { text: 'Data ID', value: 'data.id' },
        { text: 'Operation', value: 'action' }
      ],
      headersDetailed: [],
      table: null,
      dataId: null,
      database: null,
      detailActive: false,
      filteredEvents: [],
      keys: [],
      alert: false,
      filterBarHeight: null,
      tableDistanceTop: 115
    }
  },
  methods: {
    getColor (action) {
      if (action === "INSERT") return "green";
      if (action === "UPDATE") return "orange";
      if (action === "DELETE") return "red";
      else return 'blue';
    },
    filter(value, search, item) {
      if(this.database && this.table && this.dataId && this.database === item.database && this.table === item.table && this.dataId === item.data.id) {
        return true;
      }
      if(this.database && this.table && !this.dataId && this.database === item.database && this.table === item.table) {
        return true;
      }     
      if(this.database &&!this.table && !this.dataId && this.database === item.database) {
        return true;
      }
      return false;
    },
    setDatabaseFilter(item) {
      this.database = item.database;
      this.table = null;
      this.dataId = null;
    },
    setTableFilter(item) {
      this.database = item.database;
      this.table = item.table;
      this.dataId = null;
    },
    setDataIdFilter(item) {
      this.database = item.database;
      this.table = item.table;
      this.dataId = item.data.id;
    },
    /**
     * Resets the current filter (table and dataId)
     * Refreshes the table and the selection accordingly by calling the respective method.
     * Sets the mode to 0 (event view) because without filter multiple incompatible events can occur.
     */
    resetFilter() {
      this.table = null;
      this.dataId = null;
      this.database = null;
      this.detailActive = false;
    },
    clearEvents() {
      let url = `http://${location.hostname}:5000/connection/reset-index`;
      this.$http.get(url)
      .then((result) => {
        console.log(result);
        this.$store.commit("resetEvents");
      });
    },
    updateTableHeight() {
      try {
        // 24px for padding of col
        this.tableDistanceTop = this.$refs.table.getBoundingClientRect().top + 24;
      } catch {/** */}
    },
  },
  computed: {
    events() {
      return this.$store.getters.events;
    },
  },
  watch: {
    detailActive(newState, oldState) {
      if (newState && !this.table && !this.dataId) {
        this.alert = true;
      }
    },
    alert(newState){
      if (!newState) {
        this.detailActive = false;
      }
    },
    // Resetting dataId if no table is selected
    table() {
      if (!this.table) {
        this.dataId = null;
        this.detailActive = false;
      }
    },
    // Resetting table and dataId if no database is selected
    database() {
      if (!this.database) {
        this.table = null;
        this.dataId = null;
        this.detailActive = false;
      }
    }
  }
}
</script>