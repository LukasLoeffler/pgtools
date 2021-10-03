<template>
    <v-text-field
        :value="value"
        :label="label"
        :placeholder="placeholder"
        @input="input"
        class="mx-1"
        outlined
        dense
        hide-details
        clearable
    />
</template>

<script>
export default {
    props: {
        value: [String, Number],
        label: String,
        placeholder: String
    },
    methods: {
        input(value) {
            this.$emit('input', value)
        }
    }
}
</script>