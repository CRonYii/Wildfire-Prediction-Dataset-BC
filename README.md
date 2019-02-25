# Wildfire Prediction Dataset

To run the code, make sure you have [Node.js](https://nodejs.org/en/) version 8 and up installed.
1. Install the dependency
```sh
$ npm install
```

2. Create a .env file under the project root, put your [Historical Weather API](https://www.worldweatheronline.com/developer/api/docs/historical-weather-api.aspx#weather_element) Key there
```
WEATHER_API_KEY=YOUR_API_KEY_GOES_HERE
```

3. Download the Wildfire dataset from [BC Government](https://catalogue.data.gov.bc.ca/dataset/fire-incident-locations-historical), or use this [copy(January 2019)](https://drive.google.com/file/d/10smbxPCpOpW4sNQWaG5obkZCLDx9ZLYz/view?usp=sharing)

    Rename it to Historical_Wildfire_Data_BC.json and place it under the ./data folder

4. Run the code
to parse wildfire data and fetch weather data
```sh
$ npm start
```
or to only parse wildfire data
```sh
$ npm run parse
```
or to only fetch weather data
```sh
$ npm run weather
```

# Customize dataset
Modify the code in index.js to get customized result