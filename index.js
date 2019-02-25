const util = require("./util");

/*
This function filter the BC Wildfire data
and write to the file ./data/parsed_wildfire_data.json.
Feel free to modify the filter function to build a different dataset.
*/
function parseWildFireData() {
    util.parseWildfireData((params) => {
        const { cause, year, size } = params;
        return cause != "Person"
            && year >= 2017
            && size >= 20000;
    }, {
            chunkSize: 500,
            limit: 2500
        });
    console.log('Parsed wildfire data');
}
/*
BE CAREFUL: This function will call the weather api that we have 500 requests per day.

This function will read the filtered dataset from ./data/parsed_wildfire_data.json.
And it for each wildfire record it will fetch the historical weather data from the API,
since we don't want all the data returned from the api,
there's also a filter function that filters out the undesired weather data.

For the format of the returned data.

See https://www.worldweatheronline.com/developer/api/docs/historical-weather-api.aspx#weather_element

This function will combine the data into a dataset that will be eventually feed into the AI Model.
The data will be saved to the file ./data/AIML_dataset.json

Feel free to modify the filter function to build a different dataset.
*/
function fetchWeatherData() {
    util.buildDataset((params) => {
        let { maxtempC, mintempC, hourly } = params;
        maxtempC = parseFloat(maxtempC);
        mintempC = parseFloat(mintempC);
        const avgHourly = hourly.reduce((prev, cur) => {
            for (let key in prev) {
                prev[key] += parseFloat(cur[key]);
            }
            return prev;
        }, {
                humidity: 0,
                precipMM: 0,
                pressure: 0
            });
        for (let key in avgHourly) {
            avgHourly[key] /= hourly.length;
        }
        return { maxtempC, mintempC, ...avgHourly };
    }, {
            file: 1, // <= the file number you want to get weather data for
        });
    console.log('Fetched and combined weather data with wildfire data');
}

const mode = process.argv[2];

switch (mode) {
    case '--parse':
        parseWildFireData();
        break;
    case '--weather':
        fetchWeatherData();
        break;
    default:
        parseWildFireData();
        fetchWeatherData();
        break;
}