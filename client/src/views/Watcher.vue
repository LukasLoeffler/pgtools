<template>
  <v-container fluid class="pa-2" v-resize="updateTableHeight">
      <v-row
        align="center" 
        justify="center" 
        class="pl-2 pr-3 pt-4"
      >
        <transition name="fade">
          <FilterField 
            label="Database" 
            placeholder="Database" 
            v-model="database"
            prepend-inner-icon="mdi-database-outline"
          />
        </transition>
        <transition name="fade">
          <FilterField 
            label="Table" 
            placeholder="Table" 
            v-model="table"  
            v-if="database"
            prepend-inner-icon="mdi-table"
          />
        </transition>
        <transition name="fade">
          <FilterField 
            label="Data ID" 
            placeholder="Data ID" 
            v-model="dataId" 
            v-if="table"
            prepend-inner-icon="mdi-identifier"
          />
        </transition>

        <ButtonContainer outlined>
          <transition name="fade">
            <v-tooltip bottom v-if="table || dataId || database">
              <template v-slot:activator="{ on }">
                <v-btn 
                  icon 
                  v-on="on" 
                  @click="resetFilter()"
                >
                  <v-icon>mdi-filter-remove-outline</v-icon>
                </v-btn>
              </template>
              <span>Reset filter</span>
            </v-tooltip>
          </transition>
          <watcher-settings @settingsChange="applySettings"></watcher-settings>
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-btn 
                icon 
                v-on="on"
                @click="clearEvents()"
              >
                <v-icon>mdi-delete-sweep-outline</v-icon>
              </v-btn>
            </template>
            <span>Clear events</span>
          </v-tooltip>
        </ButtonContainer>
      </v-row>
      <v-row>
        <v-col ref="table">
          <v-data-table
            item-key="index" 
            fixed-header 
            show-expand
            multi-sort 
            :headers="headers" 
            :items="$store.getters.events" 
            :hide-default-footer="true" 
            :disable-pagination="true" 
            :sort-by="['index']" 
            :sort-desc="true" 
            :search="database" 
            :custom-filter="filter" 
            :height="`calc(100vh - ${tableDistanceTop}px)`"
            :single-expand="false"
            :expanded.sync="expanded"
          >
            <template v-slot:[`item.action`]="{ item }">
              <OperationBadge :event="item"/>
            </template>
            <template v-slot:[`item.timestamp`]="{ item }">
              <span>{{formatTimestamp(item.timestamp)}}</span>
            </template>
            <template v-slot:[`item.database`]="{ item }">
              <a @click="setDatabaseFilter(item)">{{ item.database }}</a>
            </template>
            <template v-slot:[`item.table`]="{ item }">
              <a @click="setTableFilter(item)">{{ item.table }}</a>
            </template>
            <template v-slot:[`item.id`]="{ item }">
              <a @click="setDataIdFilter(item)">{{ item.id }}</a>
            </template>
            <template v-slot:expanded-item="{ headers, item }">
              <td :colspan="headers.length" class="px-1 box-expanded">
                <v-sheet>
                  <ObjectDiff
                    class="my-2"
                    :item="item"
                    :autoExpand="detailActive"
                  />
                </v-sheet>
              </td>
            </template>
          </v-data-table>
        </v-col>
      </v-row>
    <v-snackbar v-model="alert" color="warning" timeout="3000" top>
      Invalid filter. Database and table are required. Automatically resetting to event mode now.
    </v-snackbar>
  </v-container>
</template>


<script>
import ButtonContainer from '../components/misc/ButtonContainer.vue';
import OperationBadge from '../components/misc/OperationBadge.vue';
import FilterField from '../components/watcher/FilterField.vue';
import ObjectDiff from '../components/watcher/ObjectDiff.vue';
import WatcherSettings from '../components/watcher/WatcherSettings.vue';
import { BASE_URL } from '@/main'

export default {
  name: 'Watcher',
  components: { ObjectDiff, OperationBadge, WatcherSettings, FilterField, ButtonContainer },
  data: function () {
    return {
      headers: [
        { text: 'Index', value: 'index' },
        { text: 'Time', value: 'timestamp' },
        { text: 'Database', value: 'database' },
        { text: 'Table', value: 'table' },
        { text: 'Data ID', value: 'id' },
        { text: 'Operation', value: 'action' }
      ],
      expanded: [],
      headersDetailed: [],
      table: null,
      dataId: null,
      database: null,
      detailActive: false,
      autoExpandNew: false,
      filteredEvents: [],
      keys: [],
      alert: false,
      filterBarHeight: null,
      tableDistanceTop: 115,
    }
  },
  methods: {
    filter(value, search, item) {
      if(this.database && this.table && this.dataId && this.database === item.database && this.table === item.table && this.dataId == item.data.id) {
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
      this.dataId = item.id;
    },
    formatTimestamp(timestamp) {
      const date = new Date(timestamp);
      const dateString = date.toLocaleString(navigator.language);
      const millis = date.getMilliseconds();
      return `${dateString}:${millis}`;
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
      let url = `${BASE_URL}/connection/reset-index`;
      this.$http.get(url)
      .then((result) => {
        this.$store.commit("resetEvents");
      });
    },
    updateTableHeight() {
      try {
        // 24px for padding of col
        this.tableDistanceTop = this.$refs.table.getBoundingClientRect().top + 24;
      } catch {/** */}
    },
    applySettings(settings) {
      this.detailActive = settings.detailActive;
      this.autoExpandNew = settings.autoExpandNew;
    }
  },
  computed: {
    events() {
      return this.$store.getters.events;
    },
  },
  watch: {
    events(newEventList){
      // this.expanded.push(newEventList[0])
      if (this.autoExpandNew) this.expanded = [newEventList[0]];
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
    },
  }
}
</script>

<style scoped>
.fade-enter-active {
  transition: opacity 0.3s;
}

.fade-leave-active {
  transition: opacity 0.1s;
}


.fade-enter, .fade-leave-to {
  opacity: 0;
}

.box-expanded {
  box-shadow: inset 0 0 8px gray;
}
</style>