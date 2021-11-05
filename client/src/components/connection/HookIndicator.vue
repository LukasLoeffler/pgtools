<template>
    <a @click="openHook">{{ indicatorText }}</a>
</template>

<script>
import { BASE_URL } from '@/main'

export default {
    props: {
        connection: Object
    },
    data: () => {
        return {
            totalTables: null,
            hookedTables: null
        }
    },
    methods: {
        openHook() {
            this.$router.push( { name: `Hooks`, params: {connectionId: this.connection.id } });
        },
        loadData() {
            let url = `${BASE_URL}/hooks/${this.connection.id}/stats`;
            this.$http.get(url)
            .then(response => {
                this.hookedTables = response.data.hookedTables;
                this.totalTables = response.data.totalTables;
            }).
            catch(() => {
                this.resetData();
            })
        },
        resetData() {
            this.hookedTables = null;
            this.totalTables = null;
        }
    },
    computed: {
        indicatorText() {
            if (!this.totalTables && !this.hookedTables) return "n.a.";
            else return `${this.hookedTables} / ${this.totalTables}`
        }
    },
    created() {
        this.loadData();
    },
    watch: {
        '$store.getters.websocketStatus': function(connected) {
            if (connected) {
                this.loadData();
            } else {
                this.resetData();
            }
        },
        connection() {
            this.loadData();
        }
    }
}
</script>