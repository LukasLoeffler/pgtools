<template>
  <v-card dark class="ml-1" ref="cardMain" style="height: calc(100vh - 75px)">

    <v-card-title ref="cardTitle">
      <v-row class="ml-1">
            <v-col cols="6"> 
              <span class="headline">Command output</span>
            </v-col>
            <v-col>
              <v-btn-toggle v-model="toggle_one" dense mandatory style="float: right;">
                <v-btn small>Overview</v-btn>
                <v-btn small :disabled="!commandData.payload">Table</v-btn>
            </v-btn-toggle>
            </v-col>
          </v-row>
    </v-card-title>

    <v-card-text class="pr-1">
      <v-simple-table v-if="toggle_one === 1 && commandData.payload" >
        <thead>
          <tr>
            <th v-for="object in Object.entries(commandData.payload[0])" :key="object[0]">
              {{object[0]}}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in commandData.payload" :key="item.name">
            <td v-for="object in Object.entries(item)" :key="object[0]">
            {{object[1]}}
            </td>
          </tr>
        </tbody>
      </v-simple-table>

      <v-simple-table v-if="toggle_one === 0">
        <tbody>
          <tr>
            <th>Status</th>
            <td><v-chip label small :color="getColor(  commandData.status )">{{   commandData.status }}</v-chip></td>
          </tr>
          <tr>
            <th>Message</th>
            <td v-if="  commandData.message">{{   commandData.message }}</td>
            <td v-else>-</td>
          </tr>
          <tr v-if="  commandData.status === 'error'">
            <th>Error type</th>
            <td>{{   commandData.error_type }}</td>
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
      tableHeight: null
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
  },
  watch: {
    toggle_one(new_val, old_val) {
    },
    commandData() {
      this.toggle_one = 0;
    }
  },
  updated() {
    this.tableHeight = this.$store.getters.contentHeight-118+'px'
  }
}
</script>