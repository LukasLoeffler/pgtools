<template>
    <v-simple-table 
        class="mr-1" 
        :height="height"
        :fixed-header="true"
    >
        <template v-slot:default>
            <thead>
                <tr>
                <th>Index</th>
                <th>Name</th>
                <th>Severity</th>
                <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="command in commands" :key="command.id">
                <td>{{command.id}}</td>
                <td>{{command.name}}</td>
                <td><v-chip label small :color="getSeverityColor(command.severity)">{{ command.severity }}</v-chip></td>
                <td>
                    <ManageCommand 
                        :command="command" 
                        :connection="selectedConnection" 
                        @commandChange="handleCommandChange" 
                        @commandData="handleCommandData"/>
                </td>
                </tr>
            </tbody>
        </template>
    </v-simple-table>    
</template>

<script>
import ManageCommand from '../ManageCommand.vue'

export default {
    name: 'CommandTable',
    components: {  ManageCommand },
    props: {
        commands: Array,
        selectedConnection: Object,
        height: String
    },
    methods: {
        getSeverityColor(severity) {
            if (severity === "LOW") return "green"
            if (severity === "MEDIUM") return "yellow"
            if (severity === "HIGH") return "orange"
            if (severity === "CRITICAL") return "red"
        },
        handleCommandChange(data) {
            this.$emit("commandChange", data)
        },
        handleCommandData(data) {
            this.$emit("commandData", data)
        }
    }
}
</script>