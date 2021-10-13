<template>
    <v-sheet
        :outlined="outlined"
        rounded
        class="d-flex button-container"
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
        border-color: rgba(0,0,0,.42) !important; 
        padding: 1px 1px 1px 1px;
    }
</style>