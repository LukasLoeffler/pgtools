export default {
    methods: {
        getColorForAction(action) {
            if (action === "INSERT") return "green";
            if (action === "UPDATE") return "orange";
            if (action === "DELETE") return "red";
        },
        getColorForSeverity(severity) {
            if (severity === "LOW") return "green"
            if (severity === "MEDIUM") return "orange"
            if (severity === "HIGH") return "red"
        },
    }
}