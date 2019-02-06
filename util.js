const fs = require('promise-fs');
const axios = require('axios');
require('dotenv').config('.env');

const WILDFIRE_DATASET = './data/Historical_Wildfire_Data_BC.json';
const PARSED_WILDFIRE_DATASET = './data/parsed_wildfire_data.json';
const AIML_DATASET = './data/AIML_dataset.json';

function getWildfireData() {
    const FILE_NAME = WILDFIRE_DATASET;

    let data = require(FILE_NAME).features.map(({ properties }) => {
        let date = properties.IGNITION_DATE;
        if (date) {
            date = date.substring(0, 4) + '-' + date.substring(4, 6) + '-' + date.substring(6, 8);
        }
        return {
            year: properties.FIRE_YEAR,
            date,
            lat: properties.LATITUDE,
            lon: properties.LONGITUDE,
            cause: properties.FIRE_CAUSE,
            size: properties.CURRENT_SIZE,
            location: properties.GEOGRAPHIC_DESCRIPTION
        };
    });

    return data;
}

function writeToFile(filename, data) {
    fs.writeFileSync(filename, JSON.stringify(data, null, 2));
}

function parseWildfireData(filter) {
    const data = getWildfireData()
        .filter(filter);

    writeToFile(PARSED_WILDFIRE_DATASET, data);
}

function getWeatherData({ date, lat, lon }) {
    return axios.get("https://api.worldweatheronline.com/premium/v1/past-weather.ashx", {
        params: {
            format: 'json',
            key: process.env.WEATHER_API_KEY,
            q: lat + ',' + lon,
            date
        }
    })
        .catch(e => {
            console.error(e);
        })
        .then(res => res.data.data);

}

async function buildDataset(filter) {
    let data = require(PARSED_WILDFIRE_DATASET);

    for (let i = 0; i < data.length; i++) {
        const record = data[i];
        let weather = await getWeatherData(record).then(w => w.weather[0]);
        if (filter) {
            weather = filter(weather);
        }
        data[i] = {
            ...record,
            weather
        };
    }

    writeToFile(AIML_DATASET, data);
}

module.exports = {
    getWildfireData,
    writeToFile,
    parseWildfireData,
    getWeatherData,
    buildDataset
};

