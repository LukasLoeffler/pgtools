<template>
  <v-card 
    class="ml-1" 
    height="calc(100vh - 70px)"
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
              v-if="commandData.status"
              label
              small
              :color="getColor(commandData.status)"
            >
              {{ commandData.status }}
            </v-chip>
          </v-col>
        </v-row>
    </v-card-title>

    <v-divider class="mb-3"></v-divider>

    <v-card-text class="pa-1">
      <v-simple-table 
        v-if="commandData && commandData.payload && Array.isArray(commandData.payload) && commandData.payload.length > 0" 
        ref="table" 
        height="calc(100vh - 155px)"
        dense
        fixed-header
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
  props: ["commandData"],
  methods: {
    getColor (status) {
      if (status === "error") return "warning";
      if (status === "success") return "green";
      else return 'blue';
    }
  },
}
</script>