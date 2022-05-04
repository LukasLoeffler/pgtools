<template>
    <v-row class="ma-auto">
        <v-col
            class="container">
            <h4>Darkmode</h4>
            <v-switch
                v-model="$vuetify.theme.dark"
                inset @change="saveDarkmode"
                hide-details
                class="switch">
            </v-switch>
        </v-col>
    </v-row>
</template>

<script>
export default {
    methods: {
        saveDarkmode() {
            localStorage.setItem("darkmode", this.$vuetify.theme.dark);
        },
    }
}
</script>

<style scoped>
    .container {
        display: flex;
        flex-direction: row;
        align-items:center;
        border: 1px solid #9e9e9e;
        margin: 10px;
        border-radius: 5px
    }

    .switch {
        margin-left: auto;
        margin-top: 0;
        margin-bottom: 0
    }
</style>