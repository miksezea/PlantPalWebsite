const plantUrl = "https://plantpalweb.azurewebsites.net/api/plants"
const dataUrl = "https://plantpalweb.azurewebsites.net/api/sensordatas"
const apiKey = "7475bb99880fc134897706be88936c06f9946567"
const plantAPIUrl = "https://open.plantbook.io/api/v1/plant/"
const customConfig = {
    headers: {
        Authorization: "Token " + apiKey,
      }
}

$(document).ready(function () {
    $(".navbar-nav li a").click(function(event) {
      $(".navbar-collapse").collapse('hide');
    });
  });


Vue.createApp({
    data() {
        return {
            deleteMessage: "",
            addMessage: "",
            updateMessage: "",

            // Plant API data
            apiPlants: {count: 0, next: "", previous: "", results: []},
            findPlant: {alias: "",},
            detailedPlant: null,

            // Plants data
            plants: [],
            error: null, 
            singlePlant: null,
            plantDeleteId: null,
            addPlantData: {name: "", type: "", description: "", status: 0},
            updatePlantData: {plantId: null, name: "", type: "", description: "", status: null, plantSelected: false},

            // SensorDatas data
            datas: [],
            singleData: null,
            dataDeleteId: null,
        }
    },
    // Create Plants list
    async created() {
        console.log("CreatedPlants method called");
        try {
            const response = await axios.get(plantUrl);
            this.plants = await response.data;
        } catch (ex) {
            this.plants = [];
            this.error = ex.message;
        }
        //try catch for the sensor data too
        try {
            const response = await axios.get(dataUrl);
            this.datas = await response.data;
        } catch (ex) {
            this.datas = [];
            this.error = ex.message;
        }
    },

    methods: {
        openPopup() {
            document.getElementById("addPopup").style.display = "block";
        },
        closePopup() {
            document.getElementById("addPopup").style.display = "none";
        },

        // Plant API methods
        async searchForPlants() {
            const url = plantAPIUrl + "search?alias=" + this.findPlant.alias
            try {
                const response = await axios.get(url, customConfig)
                this.apiPlants = await response.data
            } catch (ex) {
                alert(ex.message)
            }
        },
        async detailedSearch(alias) {
            const url = plantAPIUrl + "detail/" + alias
            try {
                const response = await axios.get(url, customConfig)
                this.detailedPlant = await response.data
            } catch (ex) {
                alert(ex.message)
            }
        },


        // Plants methods
        clearPlantList() {
            this.plants = [];
        },
        getAllPlants() {
            this.plantsHelperGetAndShow(plantUrl)
        },
        async plantsHelperGetAndShow(url) {
            try {
                const response = await axios.get(url)
                this.plants = await response.data
            } catch (ex) {
                this.plants = []
                alert(ex.message)
            }
        },
        async plantGetById(id) {
            const url = plantUrl + "/" + id;
            try {
                const response = await axios.get(url)
                this.singlePlant = await response.data
            } catch (ex) {
                alert(ex.message)
            }
        },
        confirmDelete(plantId) {
            if (confirm("Are you sure you want to delete this plant?")) {
                this.deletePlant(plantId);
            }
        },
        async deletePlant(plantDeleteId) {
            const url = plantUrl + "/" + plantDeleteId
            try {
                response = await axios.delete(url)
                this.deleteMessage = response.status + " " + response.statusText
                this.getAllPlants()

            } catch (ex) {
                alert(ex.message)
            }
        },
        async deleteDataWithPlant(id) {
            this.getAllSensorData()
            const filteredDatas = this.datas.filter(data => data.plantId == id)
            filteredDatas.forEach(data => {
                this.deleteData(data.id)
            });
        },
        async addPlant() {
            try {
                this.addPlantData.type = this.detailedPlant.display_pid
                response = await axios.post(plantUrl, this.addPlantData)
                this.addMessage = "response " + response.status + " " + response.statusText
                this.getAllPlants()
                this.closePopup()
            } catch(ex) {
                alert(ex.message)
            }
        },
        async updateTruePlant(id) {
            const url = plantUrl + "/selected/" + id
            try {
                const foundPlant = this.plants.find(plant => plant.plantId == id)
                response = await axios.put(url, foundPlant.plantId)
                this.updateMessage = "response " + response.status + " " + response.statusText
                this.getAllPlants
            } catch(ex) {
                alert(ex.message)
            }
        },
        // SensorData methods
        clearDataList() {
            this.datas = [];
        },
        getAllSensorData() {
            this.helperGetAndShow(dataUrl)
        },
        async dataHelperGetAndShow(url) {
            try {
                const response = await axios.get(url)
                this.datas = await response.data
            } catch (ex) {
                alert(ex.message)
            }
        },
        async dataGetById(id) {
            const url = dataUrl + "/" + id;
            try {
                const response = await axios.get(url)
                this.singleData = await response.data
            } catch (ex) {
                alert(ex.message)
            }
        },
        async deleteData(dataDeleteId) {
            const url = dataUrl + "/" + dataDeleteId
            try {
                response = await axios.delete(url)
                this.deleteMessage = response.status + " " + response.statusText
                this.getAllSensorData()
            } catch (ex) {
                alert(ex.message)
            }
        },
    }
    
}).mount("#app")