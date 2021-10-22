export default {
    methods: {
        getColorForAction(action) {
            if (action === "INSERT") return "green lighten-2";
            if (action === "UPDATE") return "orange lighten-2";
            if (action === "DELETE") return "red lighten-2";
        },
        getColorForSeverity(severity) {
            if (severity === "LOW") return "green lighten-2"
            if (severity === "MEDIUM") return "orange lighten-2"
            if (severity === "HIGH") return "red lighten-2"
        },
    }
}