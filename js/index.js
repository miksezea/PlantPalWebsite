const baseUrl = "https://plantpalweb.azurewebsites.net/api/sensordatas"

Vue.createApp({
    data() {
        return {
            plants: [],
            error: null, 

            Id: null, 
            Name: "",
            Type: "",
        }
    },

    async created() {
        console.log("Created method called");
        try {
            const response = await axios.get(baseUrl);
            this.plants = await response.data;
            this.error = null;
        } catch (e) {
            this.plants = [];
            this.error = e.message;
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