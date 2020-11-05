let axios = require("axios");
let express = require("express");
let app = express();
app.use(express.static("public"));

// load key from JSON file
let apiFile = require("../env.json");
let apiKey = apiFile["api_key"];
let baseUrl = apiFile["base_api_url"];

let port = 3000;
let hostname = "localhost"

app.get("/forecast", function (req, res) {
    clientZip = req.query.zip
    axios.get(`${baseUrl}?zip=${clientZip}&appid=${apiKey}`).then(function (response) {
        console.log(`Sent GET request to api.openweathermap.org/data/2.5/forecast for zip ${clientZip}`);
        data = response.data;
        let resForecast = {}
        let list = data.list
        let city = data.city.name
        for (var obj in list) {
            date = list[obj].dt_txt
            description = list[obj].weather[0].description
            temp = list[obj].main.temp
            icon = list[obj].weather[0].icon
            let json = { date, description, temp, icon, city }
            resForecast[obj] = json
        }
        res.status(200).json(resForecast);
    }).catch(function (error) {
        if (error.response) {
            data = error.response.data
            message = data.message
            status = error.response.status
            json = { "error": message }
            res.status(status).json(json)
        }
    });
    console.log("Sending request...")
});

app.listen(port, hostname, () => {
    console.log(`Listening at: http://${hostname}:${port}`);
});

