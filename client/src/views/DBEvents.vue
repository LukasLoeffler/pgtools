<template>
  <v-container fluid fill-height>
      <v-col lg="12" id="content">
        <v-card>
            <v-row row>
              <v-col style="height: 60px">
                <v-btn small class="control-elem" color="primary" @click="showSelection" :disabled="selected.length <= 1">Compare</v-btn>
                <v-btn small class="control-elem" color="error" @click="reset" :disabled="$store.getters.events.length === 0">Reset</v-btn>
              </v-col>
              <v-col id="search-bar">
                 <v-text-field v-model="search" append-icon="mdi-magnify" outlined dense hide-details class="control-elem" label="Search" placeholder="Search"/>
              </v-col>
            </v-row>
          <v-data-table id="event-table" item-key="index" :headers="headers" fixed-header :items="$store.getters.events" 
          :hide-default-footer="true" :disable-pagination="true" height="85vh"  v-model="selected" show-select="" :search="search" :sort-by="['index']" :sort-desc="[false]">
            <template v-slot:item.action="{ item }">
              <v-chip label small :color="getColor(item.action)">{{ item.action }}</v-chip>
            </template>
          </v-data-table>
        </v-card>
      </v-col>
  </v-container>
</template>

<script>


export default {
  name: 'DBEvents',
  components: { },
  data: function () {
    return { 
      events: [],
      search: '',
      headers: [
        { text: 'Index', value: 'index' },
        { text: 'Time', value: 'timestamp' },
        { text: 'Tabelle', value: 'table' },
        { text: 'Data ID', value: 'data.id' },
        { text: 'Operation', value: 'action' },
      ],
      selected: []
    }
  },
  methods: { 
    getColor (action) {
      if (action === "INSERT") return "green";
      if (action === "UPDATE") return "orange";
      if (action === "DELETE") return "red";
      else return 'blue';
    },
    showSelection() {
      this.$router.push({path: 'comparison', params: {dbEvents: this.selected}})
    },
    reset() {
      this.$store.commit('resetEvents');
    }
  },
  watch: {
    selected(data) {
      this.$store.commit('selectEvents', data);
    },
    search() {
      this.selected = [];
    }
  },
  mounted() {

  },
  created() {
    if(this.$store.getters.selectedEvents) {
      this.selected = this.$store.getters.selectedEvents;
    }
    
  },
}
</script>


<style scoped>
#event-table {
  height: inherit;
  overflow: hidden;
}

#content {
  padding: 6px;
}

.control-elem {
  margin-left: 4px;
  margin-right: 4px;
}

#search-bar {
  height: 60px;
  margin-right: 10px;
}
</style>
