<template>
    <v-sheet
        :outlined="outlined"
        rounded
        class="button-container"
        style="display: inline-flex;"
        :style="{ 'border-color': ($vuetify.theme.dark) ? 'rgba(75,75,75,1)' : 'rgba(0,0,0,.42) !important' }"
    >
        <slot></slot>
    </v-sheet>
</template>

<script>
export default {
    props: {
        outlined: {
            type: Boolean,
            default: false
        }
    }
}
</script>

<style scoped>
    .button-container {
        background-color: transparent !important;
        padding: 1px 1px 1px 1px;
    }
</style>