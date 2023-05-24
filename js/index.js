// Define the URLs and API key
const plantUrl = "https://plantpalweb.azurewebsites.net/api/plants"
const dataUrl = "https://plantpalweb.azurewebsites.net/api/sensordatas"
const apiKey = "7475bb99880fc134897706be88936c06f9946567"
const plantAPIUrl = "https://open.plantbook.io/api/v1/plant/"
const customConfig = {
    headers: {
        Authorization: "Token " + apiKey,
      }
}
// Function to collapse the navigation bar when a link is clicked
$(document).ready(function () {
    $(".navbar-nav li a").click(function(event) {
      $(".navbar-collapse").collapse('hide');
    });
  });

// Create the Vue application
Vue.createApp({
    data() {
        return {
            // Messages
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

            // SensorDatas data
            datas: [],
            singleData: null,
            dataDeleteId: null,
        }
    },
    // Create Plants list
    // Execute when the application is created
    async created() {
        // Output a message to the console
        console.log("CreatedPlants method called");
        // Retrieve plants data from the plantUrl
        try {
            // Send an HTTP GET request to the specified URL
            const response = await axios.get(plantUrl);
             // Retrieve the data from the response and assign it to the plants array
            this.plants = await response.data;
        } catch (ex) {
            this.plants = [];
            this.error = ex.message;
        }
        //try catch for the sensor data too
        // Retrieve sensor data from the dataUrl
        try {
            const response = await axios.get(dataUrl);
            this.datas = await response.data;
        } catch (ex) {
            this.datas = [];
            this.error = ex.message;
        }
    },

    methods: {
        // Function to open the popup for adding a plant
        openPopup() {
            document.getElementById("addPopup").style.display = "block";
        },
         // Function to close the popup for adding a plant
        closePopup() {
            document.getElementById("addPopup").style.display = "none";
        },

        // Plant API methods
        async searchForPlants() {
            //Konstruere en URL ved at kombinere vores BaseURL (plantAPIUrl med en query parameter (alias), 
            //der kommer fra this.plant.alias)
            const url = plantAPIUrl + "search?alias=" + this.findPlant.alias
            try {
                //Bruger axios get funktion for at sende en HTTP GET request til vores konstruerede URL.
                const response = await axios.get(url, customConfig)
                //Vi modtager dataen fra vores response.
                this.apiPlants = await response.data
            } catch (ex) {
                //Hvis der sker en exception, bliver displayed en alert med en error message.
                alert(ex.message)
            }
        },
        // Performs a detailed search for a plant based on the provided alias parameter
        async detailedSearch(alias) {
            // Construct the URL by combining the base URL and the alias parameter
            const url = plantAPIUrl + "detail/" + alias
            try {
                // Send an HTTP GET request to the constructed URL
                const response = await axios.get(url, customConfig)
                // Retrieve the data from the response
                this.detailedPlant = await response.data
            } catch (ex) {
                // If an exception occurs, display an alert with the error message
                alert(ex.message)
            }
        },


        // Plants methods
        //Clears the list of plants
        clearPlantList() {
            this.plants = [];
        },
        //Get all plants
        getAllPlants() {
            this.plantsHelperGetAndShow(plantUrl)
        },
        // Helper method to retrieve and show plant data from the specified URL
        async plantsHelperGetAndShow(url) {
            try {
                // Send an HTTP GET request to the specified URL
                const response = await axios.get(url)
                // Retrieve the data from the response
                this.plants = await response.data
            } catch (ex) {
                // If an exception occurs, set 'this.plants' to an empty array
                this.plants = []
                 // Display an alert with the error message
                alert(ex.message)
            }
        },
        // Retrieves a single plant by its ID from the specified API endpoint
        async plantGetById(id) {
            // Construct the URL by combining the base URL and the ID parameter
            const url = plantUrl + "/" + id;
            try {
                // Send an HTTP GET request to the constructed URL
                const response = await axios.get(url)
                // Retrieve the data from the response
                this.singlePlant = await response.data
            } catch (ex) {
                 // If an exception occurs, display an alert with the error message
                alert(ex.message)
            }
        },
        // Confirms the deletion of a plant based on the provided plantId
        confirmDelete(plantId) {
            // Display a confirmation dialog to confirm the deletion
            if (confirm("Are you sure you want to delete this plant?")) {
                // If the user confirms, invoke the 'deletePlant' method with the plantId
                this.deletePlant(plantId);
            }
        },
        async deletePlant(plantDeleteId) {
            // Construct the URL by combining the base URL and the plantDeleteId parameter
            const url = plantUrl + "/" + plantDeleteId
            try {
                // Send an HTTP DELETE request to the constructed URL
                response = await axios.delete(url)
                // Set the deleteMessage to include the response status and statusText
                this.deleteMessage = response.status + " " + response.statusText
                // Call the 'getAllPlants' method to update the list of plants
                this.getAllPlants()

            } catch (ex) {
                // If an exception occurs, display an alert with the error message
                alert(ex.message)
            }
        },
        // Deletes all sensor data associated with a specific plant ID
        async deleteDataWithPlant(id) {
            // Call the 'getAllSensorData' method to update the list of sensor data
            this.getAllSensorData()
            // Filter the datas array to only include data with matching plantId
            const filteredDatas = this.datas.filter(data => data.plantId == id)
             // Iterate over the filtered datas and delete each data item
            filteredDatas.forEach(data => {
                // Invoke the 'deleteData' method with the id of each data item
                this.deleteData(data.id)
            });
        },
        // Adds a new plant by sending a POST request with the provided plant data
        async addPlant() {
            try {
                 // Set the type property of addPlantData based on the detailedPlant's display_pid
                this.addPlantData.type = this.detailedPlant.display_pid
                // Send an HTTP POST request to plantUrl with the addPlantData  
                response = await axios.post(plantUrl, this.addPlantData)
                // Set the addMessage to include the response status and statusText
                this.addMessage = "response " + response.status + " " + response.statusText
                // Call the 'getAllPlants' method to update the list of plants
                this.getAllPlants()
                // Close the popup
                this.closePopup()
            } catch(ex) {
                // If an exception occurs, display an alert with the error message
                alert(ex.message)
            }
        },
        // Updates the 'selected' status of a plant by sending a PUT request with the provided plant ID
        async updateTruePlant(id) {
            // Construct the URL by combining the base URL, '/selected/', and the provided plant ID
            const url = plantUrl + "/selected/" + id
            try {
                // Send an HTTP PUT request to the constructed URL
                response = await axios.put(url)
                // Set the updateMessage to include the response status and statusText
                this.updateMessage = "response " + response.status + " " + response.statusText
                // Call the 'getAllPlants' method to update the list of plants
                this.getAllPlants()
            } catch(ex) {
                 // If an exception occurs, display an alert with the error message
                alert(ex.message)
            }
        },
        // SensorData methods
        // Clears the datas array, removing all sensor data
        clearDataList() {
            // Clear the datas array by assigning an empty array to it
            this.datas = [];
        },
        //Gets all the sensor data
        getAllSensorData() {
             // Call the 'helperGetAndShow' method with the dataUrl parameter
            this.helperGetAndShow(dataUrl)
        },
        // Helper method to retrieve and show sensor data from the specified URL
        async dataHelperGetAndShow(url) {
            try {
                // Send an HTTP GET request to the specified URL
                const response = await axios.get(url)
                 // Retrieve the data from the response and assign it to the datas array
                this.datas = await response.data
            } catch (ex) {
                // If an exception occurs, display an alert with the error message
                alert(ex.message)
            }
        },
        // Retrieves sensor data by ID
        async dataGetById(id) {
            // Construct the URL by combining the base URL and the provided data ID
            const url = dataUrl + "/" + id;
            try {
                // Send an HTTP GET request to the constructed URL
                const response = await axios.get(url)
                 // Retrieve the data from the response and assign it to the singleData property
                this.singleData = await response.data
            } catch (ex) {
                // If an exception occurs, display an alert with the error message
                alert(ex.message)
            }
        },
        // Deletes sensor data by ID
        async deleteData(dataDeleteId) {
            // Construct the URL by combining the base URL and the dataDeleteId parameter
            const url = dataUrl + "/" + dataDeleteId
            try {
                 // Send an HTTP DELETE request to the constructed URL
                response = await axios.delete(url)
                // Set the deleteMessage to include the response status and statusText
                this.deleteMessage = response.status + " " + response.statusText
                 // Call the 'getAllSensorData' method to update the list of sensor data
                this.getAllSensorData()
            } catch (ex) {
                  // If an exception occurs, display an alert with the error message
                alert(ex.message)
            }
        },
    }
    
}).mount("#app")