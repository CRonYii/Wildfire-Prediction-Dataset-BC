export as namespace util;

export interface WildfireRecord {
    year: number,
    date: String,
    lat: number,
    lon: number,
    cause: String,
    size: number,
    location: String
}

export interface Weather {
    date: String,
    astronomy: Astronomy[],
    maxtempC: String,
    maxtempF: String,
    mintempC: String,
    mintempF: String,
    totalSnow_cm: String,
    sunHour: String,
    uvIndex: String,
    hourly: HourlyWeather[]
}

export interface HourlyWeather {
    time: String,
    tempC: String,
    tempF: String,
    windspeedMiles: String,
    windspeedKmph: String,
    winddirDegree: String,
    winddir16Point: String,
    weatherCode: String,
    precipMM: String,
    humidity: String,
    visibility: String,
    pressure: String,
    cloudcover: String,
    HeatIndexC: String,
    HeatIndexF: String,
    DewPointC: String,
    DewPointF: String,
    WindChillC: String,
    WindChillF: String,
    WindGustMiles: String,
    WindGustKmph: String,
    FeelsLikeC: String,
    FeelsLikeF: String
}

export interface Astronomy {
    sunrise: String,
    sunset: String,
    moonrise: String,
    moonset: String,
    moon_phase: String,
    moon_illumination: String
}

export function parseWildfireData(filter: (record: WildfireRecord) => boolean, option?: { chunkSize: number, limit: number }): void;

export function getWildfireData(): WildfireRecord[];

export function writeToFile(filename: String, data: any): void;

export function getWeatherData(wildfire: WildfireRecord): Promise<Weatehr>;

export function buildDataset(filter: (record: Weather) => any, option: { number: number, limit: number }): void;