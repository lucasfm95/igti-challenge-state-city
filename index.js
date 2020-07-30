console.log("application starting");
import { promises as fs } from "fs";

var states = [];
var cities = [];
var amountCitiesByState = [];

async function init() {
    console.log("application started");
    //1
    await readStates();
    //1
    await readCities();
    //1
    createFilesByState();
    //2
    for (let i = 0; i < states.length; i++) {
        await getAmountCitiesByState(states[i].Sigla);
    }
    //3
    fiveLargestSates();
    //4
    fiveSmallestSates();
    //5
    let largestNameList = [];
    for (let i = 0; i < states.length; i++) {
        let city = await largestNameCityByState(states[i].Sigla);
        largestNameList.push(city);
    }
    console.log("5 -", "largest name list: ", largestNameList);

    //6
    let smallestNameList = [];
    for (let i = 0; i < states.length; i++) {
        let city = await smallestNameCityByState(states[i].Sigla);
        smallestNameList.push(city);
    }
    console.log("6 -", "smallest name list: ", smallestNameList);

    //7
    console.log("7 -", "largest name city: ", largestNameCity(largestNameList));

    //8
    console.log("8 -", "smallest name city: ", smallestNameCity(smallestNameList));

    console.log("application ended");
}

async function readStates() {
    try {
        states = JSON.parse(await fs.readFile("Estados.json", "utf-8"));
    } catch (error) {
        console.log(error);
    }
}

async function readCities() {
    try {
        cities = JSON.parse(await fs.readFile("Cidades.json", "utf-8"));
    } catch (error) {
        console.log(error);
    }
}

function createFilesByState() {
    states.forEach(state => {
        let citiesByState = cities.filter(city => city.Estado === state.ID);

        let obj = {
            id: state.ID,
            stateName: state.Nome,
            fs: state.Sigla,
            cities: citiesByState
        }

        fs.writeFile(`states/${state.Sigla}.json`, JSON.stringify(obj));
    });
}

async function getAmountCitiesByState(state) {
    let data = JSON.parse(await fs.readFile(`states/${state}.json`, "utf-8"));

    let stateObj = {
        fs: data.fs,
        amount: Number(data.cities.length)
    }

    amountCitiesByState.push(stateObj);

    return data.cities.lenght;
}

function fiveLargestSates() {
    let sortedList = amountCitiesByState.sort((a, b) => b.amount - a.amount);

    let result = sortedList.slice(0, 5);

    console.log("3 - ", "The five largest states: ", result);
}

function fiveSmallestSates() {
    let sortedList = amountCitiesByState.sort((a, b) => b.amount - a.amount);

    let result = sortedList.slice(22, 27);

    console.log("4 - ", "The five smallest states: ", result);
}

async function largestNameCityByState(state) {

    let data = JSON.parse(await fs.readFile(`states/${state}.json`, "utf-8"));

    let citiesSorted = data.cities.sort((a, b) => {
        return a.Nome - b.Nome
    });

    let cityName = '';

    for (let i = 0; i < citiesSorted.length; i++) {
        if (citiesSorted[i].Nome.length > cityName.length) {
            cityName = citiesSorted[i].Nome;
        }
    }

    return { name: cityName, lengthName: cityName.length, state: state };
}

async function smallestNameCityByState(state) {

    let data = JSON.parse(await fs.readFile(`states/${state}.json`, "utf-8"));

    let citiesSorted = data.cities.sort((a, b) => {
        return a.Nome - b.Nome
    });

    let cityName = '';

    for (let i = 0; i < citiesSorted.length; i++) {
        if (cityName.length === 0 || citiesSorted[i].Nome.length < cityName.length) {
            cityName = citiesSorted[i].Nome;
        }
    }

    return { name: cityName, lengthName: cityName.length, state: state };
}

function largestNameCity(cities) {
    let sorted = cities.sort((a, b) => {
        if (a.name > b.name) {
            return 1;
        }
        if (a.name < b.name) {
            return -1;
        }
        // a must be equal to b
        return 0;
    });

    let city;

    for (let i = 0; i < sorted.length; i++) {
        if (city === undefined || sorted[i].lengthName > city.lengthName) {
            city = sorted[i];
        }
    }

    return city;
}

function smallestNameCity(cities) {

    let sorted = cities.sort((a, b) => {
        if (a.name > b.name) {
            return 1;
        }
        if (a.name < b.name) {
            return -1;
        }
        // a must be equal to b
        return 0;
    });

    let city;

    for (let i = 0; i < sorted.length; i++) {
        if (city === undefined || sorted[i].lengthName < city.lengthName) {
            city = sorted[i];
        }
    }

    return city;
}

init();

