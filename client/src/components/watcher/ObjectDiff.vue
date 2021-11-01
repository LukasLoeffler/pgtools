<template>
    <v-simple-table>
        <template v-slot:default>
            <thead>
                <tr>
                    <th>
                        Key
                    </th>
                    <th>
                        OldValue
                    </th>
                    <th class="d-flex justify-space-between">
                        <span class="align-self-center">NewValue</span>
                        
                        <v-tooltip left>
                            <template v-slot:activator="{ on, attrs }">
                                <v-btn
                                    v-if="item.action ==='UPDATE'"
                                    class="align-self-center"
                                    right
                                    elevation="2"
                                    fab
                                    x-small
                                    color="blue"
                                    v-bind="attrs"
                                    v-on="on"
                                    @click="wholeObject = !wholeObject"
                                >
                                    <v-icon color="white">{{(wholeObject) ? 'mdi-minus' : 'mdi-plus' }}</v-icon>
                                </v-btn>
                            </template>
                            <span>{{(wholeObject) ? 'Only differences' : 'Whole object' }}</span>
                        </v-tooltip>
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr
                    v-for="(diffPr, index) of getObjectDifferences()" 
                    :key="index"
                    :style="{'background-color': (diffPr.old === diffPr.new) ? '': 'rgba(134, 206, 250, 0.2)'}"
                >
                    <td>{{ diffPr.key }}</td>
                    <td>{{ String(diffPr.old) }}</td>
                    <td>{{ String(diffPr.new) }}</td>
                </tr>
            </tbody>
        </template>
    </v-simple-table>
</template>

<script>
export default {
    props: {
        item: Object,
        autoExpand: {
            type: Boolean,
            default: false
        }
    },
    data: () => {
        return {
            wholeObject: false
        }
    },
    created() {
        if (this.autoExpand) this.wholeObject = true;
    },
    methods: {
        getAllKeys() {
            const keysOld = Object.keys(this.item.data_old);
            const keysNew = Object.keys(this.item.data);
            return [...new Set([...keysOld ,...keysNew])].filter(key => key !== "");
        },
        getDiffKeys() {
            return Object.keys(this.diff(this.item.data_old, this.item.data)).filter(key => key !== "")
        },
        getObjectDifferences() {
            const keysToShowDiffFor = (this.wholeObject) ? this.getAllKeys(): this.getDiffKeys();

            return keysToShowDiffFor.map(key => {
                return {
                    key: key,
                    old: this.item.data_old[key],
                    new: this.item.data[key]
                }
            });
        },
        diff(obj1, obj2) {
            const result = {};
            if (Object.is(obj1, obj2)) {
                return undefined;
            }
            if (!obj2 || typeof obj2 !== 'object') {
                return obj2;
            }
            Object.keys(obj1 || {}).concat(Object.keys(obj2 || {})).forEach(key => {
                if(obj2[key] !== obj1[key] && !Object.is(obj1[key], obj2[key])) {
                    result[key] = obj2[key];
                }
                if(typeof obj2[key] === 'object' && typeof obj1[key] === 'object') {
                    const value = this.diff(obj1[key], obj2[key]);
                    if (value !== undefined) {
                        result[key] = value;
                    }
                }
            });
            return result;
        }
    }
}
</script>