<template>
    <v-row class="ma-auto">
        <v-col cols="6" class="pr-2">
            <v-btn color="primary" block @click="downloadConfig()">
                Config
                <v-icon right dark>
                    mdi-cloud-download
                </v-icon>
            </v-btn>
        </v-col>
        <v-col cols="6" class="pl-1">
            <v-btn color="teal" block @click="downloadConfig()">
                Config
                <v-icon right dark>
                    mdi-cloud-upload
                </v-icon>
            </v-btn>
        </v-col>
    </v-row>
</template>

<script>
import { BASE_URL } from '@/main';

export default {
    methods: {
        downloadConfig() {
            let url = `${BASE_URL}/config/download`;
            this.$http.get(url).then((response) => {
                var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(response.data, null, 4));
                var downloadAnchorNode = document.createElement('a');
                downloadAnchorNode.setAttribute("href", dataStr);
                downloadAnchorNode.setAttribute("download", "pgtools_config.json");
                document.body.appendChild(downloadAnchorNode);
                downloadAnchorNode.click();
                downloadAnchorNode.remove();
            });
        }
    }
}
</script>

<style>
</style>