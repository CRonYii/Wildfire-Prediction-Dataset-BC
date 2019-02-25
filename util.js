const fs = require('promise-fs');
const axios = require('axios');
require('dotenv').config('.env');

const WILDFIRE_DATASET = './data/Historical_Wildfire_Data_BC.json';
const PARSED_WILDFIRE_DATASET = (num) => `./data/parsed_wildfire_data_${num}.json`;
const AIML_DATASET = (num) => `./data/AIML_dataset_${num}.json`;

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
    fs.writeFileSync(filename, JSON.stringify(data, null, 4));
}

function parseWildfireData(filter, option) {
    option = option || {};

    const data = getWildfireData()
        .filter(filter);

    if (option.limit) {
        shuffle(data);
        data.splice(option.limit);
    }

    if (option.chunkSize) {
        const { chunkSize } = option;
        let i = 0;
        do {
            const chunk = data.slice(i, chunkSize);
            writeToFile(PARSED_WILDFIRE_DATASET(i / chunkSize + 1), chunk);

            i += chunkSize;
        } while (i < data.length);
    } else {
        writeToFile(PARSED_WILDFIRE_DATASET(1), data);
    }

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

async function buildDataset(filter, option) {
    option = Object.assign({ file: 1, limit: null }, option);
    const { file, limit } = option;
    let data = require(PARSED_WILDFIRE_DATASET(file));

    if (limit) {
        data.splice(limit);
    }

    for (let i = 0; i < data.length; i++) {
        const record = data[i];
        try {
            let weather = await getWeatherData(record)
                .then(w => {
                    if (w.error) {
                        throw new Error(JSON.stringify(w.error));
                    }
                    return w;
                })
                .then(w => w.weather[0]);
            if (filter) {
                weather = filter(weather);
            }
            data[i] = {
                ...record,
                weather
            };
        } catch (err) {
            console.error(err.message);
            delete data[i];
        }
    }

    data = data.filter(e => e != null);

    writeToFile(AIML_DATASET(file), data);
}

function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

module.exports = {
    getWildfireData,
    writeToFile,
    parseWildfireData,
    getWeatherData,
    buildDataset
};

