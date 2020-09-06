<template>
  <v-simple-table height="80vh">
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
                <p label small v-bind="attrs" v-on="on">
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
</template>

<script>
export default {
  name: 'DetailTable',
  data: function () {
    return {
      headersDetailed: [],
      filteredEvents: [],
    }
  },
  props: ["table", "dataId", "rootVisible"],
  computed: {
    events() {
      return this.$store.getters.events;
    },
    visible() {
      return this.rootVisible;
    }
  },
  methods: {
        /**
     * Method is called when filter is refreshed.
     * Filters the events and the headers for the table according the filter.
     * Current fields used for filtering are dataId and table.
     */
    refreshTableAndSelection() {
      this.headersDetailed = [];
      if (this.table && this.dataId) {
        this.filteredEvents = this.$store.getters.events.filter(event => event.data.id === this.dataId && event.table === this.table);
      }
      if(this.table && !this.dataId) {
        this.filteredEvents = this.$store.getters.events.filter(event => event.table === this.table);
      }

      //Getting first event of filteres events and extracting keys of data objects to populate header of the detail table
      if (this.filteredEvents[0]) {
        this.headersDetailed = Object.keys(this.filteredEvents[0]["data"]);
      }
    },
    getColor (action) {
      if (action === "INSERT") return "green";
      if (action === "UPDATE") return "orange";
      if (action === "DELETE") return "red";
      else return 'blue';
    },
    changed(item, key) {
      if(item["data"][key] === item["data_old"][key] || item["action"] === "INSERT" || item["action"] === "DELETE") {
        return false;
      } else {
        return true;
      }
    },
  },
  watch: {
    events() {
      this.refreshTableAndSelection();
    },
    visible(newValue) {
      console.log(this.dataId +" "+this.table);
      this.refreshTableAndSelection();
    }
  }
}
</script>


<style scoped>
.changed {
  background-color: rgba(255, 0, 0, 0.2);
}
</style>