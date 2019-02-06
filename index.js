const util = require("./util");

/* 
This function filter the BC Wildfire data 
and write to the file ./data/parsed_wildfire_data.json.
Feel free to modify the filter function to build a different dataset.
*/
util.parseWildfireData(({ cause, year, size }) =>
    cause != "Person"
    && year >= 2017
    && size >= 200000
);
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
util.buildDataset(({ maxtempC, mintempC, uvIndex }) => {
    return { maxtempC, mintempC, uvIndex };
});