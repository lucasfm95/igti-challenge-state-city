console.log("application starting");
import { promises as fs } from "fs";
import { stringify } from "querystring";

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
    largestNameCity();

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

    console.log("The five largest states:");
    console.log(result);
}

function fiveSmallestSates() {
    let sortedList = amountCitiesByState.sort((a, b) => b.amount - a.amount);

    let result = sortedList.slice(22, 27);

    console.log("The five smallest states:");
    console.log(result);
}

function largestNameCity() {

    let sort = cities.sort((a, b) => {
        b.Nome.length - a.Nome.length
    });

    let sortedList = cities.sort((a, b) => b.Nome.length - a.Nome.length);

    let result = sortedList.slice(0, 1);
    console.log(sortedList);
    console.log("The largest name city:");
    console.log(result[0].Nome.length);
}

init();

