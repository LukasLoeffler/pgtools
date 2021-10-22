<template>
    <v-chip label small :color="getColorForAction(event.action)">{{ event.action }}</v-chip>
</template>

<script>
import colorHelper from '../../mixins/color-helper.js'

export default {
    mixins: [ colorHelper ],
    props: {
        event: Object
    },
}
</script>

<style>

</style>