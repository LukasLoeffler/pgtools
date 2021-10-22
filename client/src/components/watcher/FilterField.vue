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
        :prepend-inner-icon="prependInnerIcon"
    />
</template>

<script>
export default {
    props: {
        value: [String, Number],
        label: String,
        placeholder: String,
        prependInnerIcon: String
    },
    methods: {
        input(value) {
            this.$emit('input', value)
        }
    }
}
</script>