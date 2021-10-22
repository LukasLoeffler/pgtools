<template>
  <v-card 
    class="ml-1" 
    v-resize="updateTableDistance"
  >
    <v-card-title>
      <v-row>
        <v-col cols="8"> 
            <span class="headline">Command output</span>
          </v-col>
          <v-col 
            cols="4" 
            class="text-right"
          >
            <v-chip
              label
              small
              :color="getColor(  commandData.status )"
            >
              {{ commandData.status }}
            </v-chip>
          </v-col>
        </v-row>
    </v-card-title>

    <v-divider class="mb-12"></v-divider>

    <v-card-text class="pa-1">
      <v-row class="ml-1">
        <v-col cols="10">
          <p v-if="commandData.message">>{{ commandData.message }}</p>
        </v-col>
      </v-row>
      <v-simple-table 
        v-if="commandData.payload" 
        ref="table" 
        :height="`calc(100vh - ${tableDistanceTop}px)`"
        dense
      >
        <thead>
          <tr>
            <th v-for="object in Object.entries(commandData.payload[0])" :key="object[0]">
              {{object[0]}}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr 
            v-for="item in commandData.payload" 
            :key="item.name"
          >
            <td 
              v-for="object in Object.entries(item)" 
              :key="object[0]"
            >
              {{object[1]}}
            </td>
          </tr>
        </tbody>
      </v-simple-table>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: "CommandOutput",
    data: () => {
    return {
      name: "CommandOutput",
      toggle_one: 0,
      tableDistanceTop: 200
    }
  },
  props: {
      commandData: Object
  },
  methods: {
    getColor (status) {
      if (status === "error") return "red";
      if (status === "success") return "green";
      else return 'blue';
    },
    updateTableDistance() {
      try {
        this.tableDistanceTop = this.$refs.table.$el.getBoundingClientRect().top + 24;
      } catch (error) {/** */}
    }
  },
}
</script>