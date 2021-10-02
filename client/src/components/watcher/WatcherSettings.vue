<template>
    <div class="text-center">
        <v-dialog
          v-model="dialog"
          width="500"
        >
        <template v-slot:activator="{ on, attrs }">
            <v-btn
              v-bind="attrs"
              v-on="on"
              icon
            >
              <v-icon>mdi-cog-outline</v-icon>
            </v-btn>
        </template>

        <v-card>
            <v-card-title>
            Settings Watcher
            </v-card-title>
            <v-divider></v-divider>
            <v-card-text>
              <v-row>
                <v-col>
                  <v-switch 
                    class="ml-1 mr-1" 
                    v-model="detailActive"
                    label="Detail Active"
                    hint="Show whole object by default"
                    persistent-hint
                  />
                </v-col>
                <v-col>
                  <v-switch 
                    class="ml-1 mr-1" 
                    v-model="autoExpandNew"
                    label="Auto Expand New"
                    hint="Expand latest event automatically"
                    persistent-hint
                  />
                </v-col>
              </v-row>
            </v-card-text>

            <v-divider></v-divider>

            <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="red"
              text
              @click="dialog = false"
            >
                Abort
            </v-btn>
            <v-btn
              color="primary"
              text
              @click="save()"
            >
                Save
            </v-btn>
            </v-card-actions>
        </v-card>
        </v-dialog>
    </div>
</template>

<script>
  export default {
    data () {
      return {
        dialog: false,
        detailActive: null,
        autoExpandNew: null
      }
    },
    created() {
      const settings = JSON.parse(localStorage.getItem("watcherSettings"));

      this.detailActive = (settings) ? settings.detailActive : false;
      this.autoExpandNew = (settings) ? settings.autoExpandNew : false;
      this.save()
    },
    methods: {
      getSettings() {
        return {
          detailActive: this.detailActive,
          autoExpandNew: this.autoExpandNew
        }
      },
      save() {
        const settings = this.getSettings();
        localStorage.setItem("watcherSettings", JSON.stringify(settings));
        this.$emit("settingsChange", settings)
        this.dialog = false;
      },
    },
  }
</script>