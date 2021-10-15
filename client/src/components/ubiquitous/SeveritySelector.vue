<template>
    <v-btn-toggle 
        value="value"
        @change="input"
        dense
        mandatory
    >
        <v-btn :color="value === 'LOW' ? 'green lighten-2' : 'white'" value="LOW">
        LOW
        </v-btn>

        <v-btn :color="value === 'MEDIUM' ? 'orange lighten-2' : 'white'" value="MEDIUM">
        MEDIUM
        </v-btn>

        <v-btn :color="value === 'HIGH' ? 'red lighten-2' : 'white'" value="HIGH">
        HIGH
        </v-btn>
    </v-btn-toggle>
</template>

<script>
export default {
    props: ['value'],
    methods: {
        input(value) {
            this.$emit('input', value);
        }
    }
}
</script>

<style>

</style>