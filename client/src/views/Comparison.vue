<template>
  <v-container fluid fill-height>
    <v-row>
      <v-col lg="12" id="content">
        <v-card>
          <v-data-table id="event-table" item-key="index" fixed-header :headers="headers" :items="eventDataList" :hide-default-footer="true" 
          :disable-pagination="true" :sort-by="['index']" :sort-desc="[false]" :height="$store.getters.contentHeight">
            <template v-slot:item.action="{ item }">
              <v-chip label small :color="getColor(item.action)">{{ item.action }}</v-chip>
            </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>

export default {
  name: 'Comparison',
  components: {  },
  props: ["dbEvents"],
  data: function () {
    return {
      eventDataList: [],
      headers: [],
    }
  },
  methods: {
    getColor (action) {
      if (action === "INSERT") return "green";
      if (action === "UPDATE") return "orange";
      if (action === "DELETE") return "red";
      else return 'blue';
    },
  },
  created() {
    if(this.$store.getters.selectedEvents.length !== 0) {
      let keys = Object.keys(this.$store.getters.selectedEvents[0]["data"]);

      this.headers.push({text: "Index", value: "index"});
      this.headers.push({ text: 'Operation', value: 'action'});

      keys.forEach(key => {
        let header= {text: key, value: "data."+key}
        this.headers.push(header);
      });


      this.$store.getters.selectedEvents.forEach(element => {
        this.eventDataList = [element, ...this.eventDataList];
      });
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
