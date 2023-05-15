const plantUrl = "https://plantpalweb.azurewebsites.net/api/plants"
const dataUrl = "https://plantpalweb.azurewebsites.net/api/sensordatas"

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

            // Plants data
            plants: [],
            error: null, 
            singlePlant: null,
            plantDeleteId: null,
            addPlantData: {name: "", type: "", description: "", status: null},
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
        async deletePlant(plantDeleteId) {
            const url = plantUrl + "/" + plantDeleteId
            try {
                this.deleteDataWithPlant(plantDeleteId)
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
                response = await axios.post(plantUrl, this.addPlantData)
                this.addMessage = "response " + response.status + " " + response.statusText
                this.getAllPlants()
            } catch(ex) {
                alert(ex.message)
            }
        },
        // DONT TOUCH! Ikke pille ved disse tre metoder
        // Lav ny hvis i skal bruge en update metode
        async updateTruePlant(id) {
            const url = plantUrl + "/" + id
            try {
                this.setPlantBoolsToFalse()
                const foundPlant = this.plants.find(plant => plant.plantId == id)
                foundPlant.plantSelected = true
                this.updateBoolOnPlants(foundPlant)
            } catch(ex) {
                alert(ex.message)
            }
        },
        async setPlantBoolsToFalse() {
            const filteredPlants = this.plants.filter(plant => plant.plantSelected == true)
            filteredPlants.forEach(plant => {
                plant.plantSelected = false
                this.updateBoolOnPlants(plant)
            });
        },
        async updateBoolOnPlants(plant) {
            const url = plantUrl + "/" + plant.plantId
            try {
                response = await axios.put(url, plant)
                this.updateMessage = "response " + response.status + " " + response.statusText
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