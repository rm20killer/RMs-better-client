const fs = require('fs');
const readline = require('readline');
const axios = require('axios');

let data = {}
let decoration = {};
let utility = {}
let social = {};
let storage = {}
let optimization ={}
let library = {}

let decorationArray = [];
let utilityArray = [];
let socialArray = [];
let storageArray = [];
let optimizationArray = [];
let libraryArray = [];

let decorationLinks = [];
let utilityLinks = [];
let socialLinks = [];
let storageLinks = [];
let optimizationLinks = [];
let libraryLinks = [];
module.exports = {
    execute: async function (log) {
        await processLineByLine()
    }
}

async function findInfo(mod) {
    //replace https://modrinth.com/mod/ to https://api.modrinth.com/v2/project/
    let modrinth = mod.replace("https://modrinth.com/mod/", "https://api.modrinth.com/v2/project/");
    //fetch using modrinth 
    let modrinthData = await axios.get(modrinth);
    console.log(modrinthData.data);
    let modData = {
        name: modrinthData.data.title,
        url:mod,
        description:modrinthData.data.description,
        categories:modrinthData.data.categories,
        copyPate: `(${modrinthData.data.title} - ${mod}]`
    }
    if (modrinthData.data.categories.includes("library")) {
        libraryArray.push(modData);
        libraryLinks.push(modData.copyPate);
    }
    else if(modrinthData.data.categories.includes("decoration")){
        decorationArray.push(modData);
        decorationLinks.push(modData.copyPate);
    }
    else if(modrinthData.data.categories.includes("utility")){
        if(modrinthData.data.categories.includes("social")){
            socialArray.push(modData);
            socialLinks.push(modData.copyPate);
        }
        else{
            utilityArray.push(modData);
            utilityLinks.push(modData.copyPate);
        }
    }
    else if(modrinthData.data.categories.includes("storage")){
        storageArray.push(modData);
        storageLinks.push(modData.copyPate);
    }
    else if(modrinthData.data.categories.includes("optimization")){
        optimizationArray.push(modData);
        optimizationLinks.push(modData.copyPate);
    }

    saveData();
}

async function processLineByLine() {
    var itemsProcessed = 0;
    const fileStream = fs.createReadStream('mod-list.txt');

    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });
    // Note: we use the crlfDelay option to recognize all instances of CR LF
    // ('\r\n') in input.txt as a single line break.
    ItemCount = rl.length;
    console.log(ItemCount);
    for await (const line of rl) {
        //sleep for 2 sec


        itemsProcessed++;
        // Each line in input.txt will be successively available here as `line`.
        console.log(`Line from file: ${line}`);
        let mod = line;
        if (mod) {
            findInfo(mod)
        }
        if (itemsProcessed === rl.length) {
            saveData();
        }
    }
}


async function saveData() {
    decoration = {
        Array: decorationArray,
        Links: decorationLinks
    }
    utility = {
        Array: utilityArray,
        Links: utilityLinks
    }
    social = {
        Array: socialArray,
        Links: socialLinks
    }
    storage = {
        Array: storageArray,
        Links: storageLinks
    }
    optimization = {
        Array: optimizationArray,
        Links: optimizationLinks
    }
    library = {
        Array: libraryArray,
        Links: libraryLinks
    }
    data = {
        decoration:decoration,
        utility:utility,
        social:social,
        storage:storage,
        optimization:optimization,
        library:library
    }
    //save data to json file
    fs.writeFile('modinfo.json', JSON.stringify(data,null,2), (err) => {
        if (err) {
            throw err;
        }
        console.log("JSON data is saved.");
    }
    );
}