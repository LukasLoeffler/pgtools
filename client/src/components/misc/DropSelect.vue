<template>
    <v-select 
        :items="items" 
        label="Connection" 
        item-text="name" 
        :value="value"
        @change="input"
        :menu-props="{ bottom: true, offsetY: true, transition: 'slide-y-transition' }"
        return-object 
        outlined 
        dense 
        hide-details
    >

        <template v-slot:no-data>
            <slot name="no-data">
                <v-list-item>
                    <v-list-item-action-text>
                    No data
                    </v-list-item-action-text>
                </v-list-item>
            </slot>
        </template>
    </v-select>
</template>

<script>
export default {
    props: {
        items: Array,
        value: Object
    },
    methods: {
        input(value) {
            this.$emit('input', value);
        }
    }
}
</script>

<style>

</style>