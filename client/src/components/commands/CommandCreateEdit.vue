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
          <v-container class="px-7">
            <v-row>
              <v-col cols="6">
                <v-text-field 
                  label="Name" 
                  v-model="commandCopy.name" 
                  :rules="[rules.required]"
                  outlined
                  dense
                  hide-details
                ></v-text-field>
              </v-col>
              <v-col cols="3">
                <SeveritySelector v-model="commandCopy.severity"/>
              </v-col>
              <v-col cols="12">
                <prism-editor
                  class="my-editor height-300"
                  v-model="commandCopy.query"
                  :highlight="highlighter"
                  :line-numbers="false"
                ></prism-editor>
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
            @click="(mode === 'CREATE') ? createCommand() : updateCommand()" 
            :disabled="!valid"
          >{{(mode === 'CREATE') ? 'Create' : 'Update'}}</v-btn>
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
import SeveritySelector from '../misc/SeveritySelector.vue';
import { BASE_URL } from '@/main'
import { PrismEditor } from "vue-prism-editor";
import "vue-prism-editor/dist/prismeditor.min.css"; // import the styles somewhere

// import highlighting library (you can use any library you want just return html string)
import { highlight, languages } from "prismjs/components/prism-core";
import "prismjs/components/prism-clike";
import "prismjs/components/prism-javascript";
import "prismjs/themes/prism-tomorrow.css"; // import syntax highlighting styles
import "prismjs/components/prism-sql";

export default {
  name: 'CommandCreateEdit',
  components: { SeveritySelector, PrismEditor },
  props: {
    mode: {
      type: String,
      required: true,
      validator: function (value) {
        return ['EDIT', 'CREATE'].indexOf(value) !== -1
      }
    },
    command: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data () {
    return {
      commandCopy: null,
      dialog: false,
      alert: false,
      valid: false,
      rules: {
        required: value => !!value || 'Required.',
      },
      severities: ["LOW", "MEDIUM", "HIGH"],
    }
  },
  created() {
    this.commandCopy = JSON.parse(JSON.stringify(this.command));
  },
  methods: {
    changeValidity(validity) {
      this.valid = validity;
    },
    createCommand() {
      let url = `${BASE_URL}/command`
      this.$http.post(url, this.commandCopy)
      .then((result) => {
        this.$emit('commandChange', result.data)
        this.resetDialog();
      })
      .catch((err) => {
        console.error(err);
        this.alert = true;
      })
    },
    updateCommand() {
      let url = `${BASE_URL}/command`
      this.$http.put(url, this.commandCopy)
      .then((result) => {
        this.$emit('commandChange', result)
        this.dialog = false;
      })
    },
    resetDialog() {
      this.commandCopy.name = null;
      this.commandCopy.query = null;
      this.commandCopy.severity = "LOW"
      // Required due to dirty form validation. Input fields red otherwise after save and reopen.
      this.$refs.form.resetValidation();  
      this.dialog = false;
    },
    highlighter(code) {
      return highlight(code, languages.sql);
    },
  },
}
</script>


<style scoped>

.my-editor {
  background: #2d2d2d;
  color: #ccc;

  font-family: Fira code, Fira Mono, Consolas, Menlo, Courier, monospace;
  font-size: 18px;
  line-height: 1.5;
  padding: 5px;
  border-radius: 2px;
}
</style>