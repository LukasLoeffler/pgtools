<template>
  <v-row>
    <v-dialog v-model="dialog" max-width="500px">
      <template v-slot:activator="{ on, attrs }">
        <v-btn blue="blue" class="mr-1" text v-bind="attrs" v-on="on">
          <unicon name="info-circle" fill="blue"/>
        </v-btn>
      </template>
      <v-card>
        <v-card-title>
          <v-row class="ml-1">
            <v-col cols="11"> 
              <span class="headline">Connection Info</span>
            </v-col>
            <v-col cols=1>
              <v-btn text color="primary" style="float: right;" @click="dialog=false">Close</v-btn>
            </v-col>
          </v-row>
        </v-card-title>
        <v-card-text class="mt-5">

          <v-row dense>
            <v-col cols="1">
              <v-btn x-small text>
                <unicon name="play" fill="green"></unicon>
              </v-btn>
            </v-col>
            <v-col cols="11">
              <p>Activate a connection. Starts listening to events. Only available if connection is inactive.</p>
            </v-col>
          </v-row>

          <v-row dense>
            <v-col cols="1">
              <v-btn x-small text>
                <unicon name="pause-circle" fill="red"></unicon>
              </v-btn>
            </v-col>
            <v-col cols="11">
              <p>Deactivate a connection. End listening to events. Only available if connection is active.</p>
            </v-col>
          </v-row>

          <v-row dense>
            <v-col cols="1">
              <v-btn x-small text>
                <unicon name="pen" fill="#46a2d4"/>
              </v-btn>
            </v-col>
            <v-col cols="11">
              <p>Edit a connection. Only available if connection is inactive.</p>
            </v-col>
          </v-row>

        </v-card-text>

        


      </v-card>
    </v-dialog>
  </v-row>
</template>


<script>

export default {
  name: 'ConnectionInfoModal',
  components: { },
  data () {
    return {
      dialog: false
    }
  }
}
</script>


<style scoped>
</style>