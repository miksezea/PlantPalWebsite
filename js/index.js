const baseUrl = "https://plantpalweb.azurewebsites.net/api/sensordatas"

Vue.createApp({
    data() {
        return {
            sensorDatas: [],
        }
    },
    methods: {
        getAllSensorDatas() {
            this.helperGetAndShow(baseUrl)
        },
        async helperGetAndShow(url) {
            try {
                const response = await axios.get(url)
                this.sensorDatas = await response.data
            } catch (ex) {
                alert(ex.message)
            }
        },
        clearList() {
            this.sensorDatas = [];
        }
    }
}).mount("#app")