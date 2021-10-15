<template>
  <div>
    <v-dialog 
      v-model="dialog" 
      max-width="90%"
    >
      <template v-slot:activator="{ on, attrs }">
        <div v-bind="attrs" v-on="on">
          <slot name="activator">
            <v-btn color="grey darken-1" class="mr-1" outlined>
              <v-icon>mdi-playlist-plus</v-icon>
            </v-btn>
          </slot>
        </div>
      </template>
      <v-card v-if="dialog">
        <v-card-title>
          <span class="headline">{{(mode ==='CREATE') ? 'Create command' : 'Edit command'}}</span>
        </v-card-title>
        <v-form v-model="valid" ref="form">
          <v-container class="pl-7">
            <v-row>
              <v-col cols="6">
                <v-text-field 
                  label="Name" 
                  v-model="name" 
                  :rules="[rules.required]"
                  outlined
                  dense
                  hide-details
                ></v-text-field>
              </v-col>
              <v-col cols="3">
                <SeveritySelector v-model="selectedSeverity"/>
              </v-col>
              <v-col cols="12">
                <v-textarea 
                  label="Query"
                  outlined
                  filled
                  v-model="query_string" 
                  :rules="[rules.required]"
                  hide-details=""
                ></v-textarea>
              </v-col>
            </v-row>
          </v-container>
        </v-form>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn 
            color="green" 
            text
            @click="createQuery" 
            :disabled="!valid"
          >Create</v-btn>
          <v-btn 
            color="red" 
            text @click="dialog = false"
          >Abort</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-snackbar color="error" v-model="alert" timeout="3000" top>Invalid connection properties. Try again with changed properties.</v-snackbar>
  </div>
</template>


<script>
import SeveritySelector from '../ubiquitous/SeveritySelector.vue';

export default {
  name: 'CommandCreate',
  components: {SeveritySelector },
  props: {
    mode: {
      type: String,
      required: true,
      validator: function (value) {
        return ['EDIT', 'CREATE'].indexOf(value) !== -1
      }
    }
  },
  data () {
    return {
      dialog: false,
      checkingCommand: false,
      alert: false,
      valid: false,
      rules: {
        required: value => !!value || 'Required.',
      },
      name: null,
      query_string: null,
      severities: ["LOW", "MEDIUM", "HIGH"],
      selectedSeverity: "LOW"
    }
  },
  methods: {
    setConnection(newConnection) {
      this.connection = newConnection;
    },
    changeValidity(validity) {
      this.valid = validity;
    },
    createQuery() {
      let url = `http://${location.hostname}:5000/command`

      let data = {
        name: this.name,
        query_string: this.query_string,
        severity: this.selectedSeverity
      }

      this.$http.post(url, data)
      .then((result) => {
        this.$emit('commandChange', result)
        this.resetDialog();
      })
      .catch((err) => {
        console.error(err);
        this.alert = true;
      })
    },
    updateCommand() {
      let url = `${this.baseUrl}/command/${this.command.id}`
      this.$http.put(url, this.localCommand)
      .then((result) => {
        this.$emit('commandChange', result)
        this.dialog = false;
      })
    },
    resetDialog() {
      this.name = null;
      this.query_string = null;
      this.selectedSeverity = "LOW"
      // Required due to dirty form validation. Input fields red otherwise after save and reopen.
      this.$refs.form.resetValidation();  
      this.dialog = false;
    },
    getSeverityColor(severity) {
      if (severity === "LOW") return "green"
      if (severity === "MEDIUM") return "yellow"
      if (severity === "HIGH") return "orange"
      if (severity === "CRITICAL") return "red"
    }
  },
}
</script>


<style scoped>
</style>