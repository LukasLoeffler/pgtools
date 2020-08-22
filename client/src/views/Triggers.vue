<template>
  <v-container fluid fill-height>
    <v-row>
      <v-col lg="12" id=toolbar>
        <v-card>
          <v-btn small class="toolbar-btn" color="primary" @click="selectAll">Select All</v-btn>
          <v-btn small class="toolbar-btn" color="error" @click="deselectAll">Deselect All</v-btn>
          <v-btn small class="toolbar-btn" color="success" :loading="loading" @click="save" :disabled="!saveRequired">Save changes</v-btn>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col lg="12" id="content">
        <v-card>
          <v-data-table v-if="tables" :headers="headers" :items="tables" class="elevation-1" :hide-default-footer="true"  :disable-pagination="true" height="85vh">
            <template v-slot:item.trigger_enabled="{ item }">
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
      loading: false
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
        this.$http.post(this.url, this.tables)
        .then((result) => {
          this.tables = result.data;
          this.saveRequired = false;
          this.loading = false;
      });
    },
    requireSave() {
      this.saveRequired = true;
    },
    loadData() {
      this.$http.get(this.url)
      .then((result) => {
        this.tables = result.data;
      });
    }
  },
  computed: {
    connected() {
      return this.$store.getters.connectionStatus;
    }
  },
  mounted() {
    this.loadData();
  },
  watch: {
    connected(newStatus) {
      if(newStatus) {
        this.loadData();
      }
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
