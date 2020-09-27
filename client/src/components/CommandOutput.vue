<template>
  <v-card dark class="ml-1">

    <v-card-title>
      
      <v-row class="ml-1">
            <v-col cols="5"> 
              <span class="headline">Command output</span>
            </v-col>
            <v-col>
              <v-btn-toggle v-model="toggle_one" dense mandatory style="float: right;">
                <v-btn>Table</v-btn>
                <v-btn>JSON</v-btn>
                <v-btn>C</v-btn>
            </v-btn-toggle>
            </v-col>
          </v-row>
    </v-card-title>

    <v-simple-table>
    
    <thead>
      <tr>
        <th v-for="object in Object.entries(data.payload[0])" :key="object[0]">
          {{object[0]}}
        </th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="item in data.payload" :key="item.name">
        <td v-for="object in Object.entries(item)" :key="object[0]">
        {{object[1]}}
        </td>
      </tr>
    </tbody>
    </v-simple-table>
  </v-card>
</template>

<script>
export default {
  name: "CommandOutput",
  data: () => {
    return {
      name: "CommandOutput"
    }
  },
  props: {
    data: Object
  },
  methods: {}
}
</script>