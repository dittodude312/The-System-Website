import { makeTable, URL } from "./utilities.js"


window.addEventListener("DOMContentLoaded", async event => {
    const container = document.getElementById("tableContainer");
    const data = [];

    const response = await fetch(`http://${URL}/data/xmans/memberlist.csv`);
    if(response.status === 404){
        container.textContent = "An error occurred fetching inventory data.";
        return null;
    }
    const text = await response.text();
    for(let line of text.split("\r\n")){
        data.push(line.split(","));
    }

    const table = makeTable(data);
    container.append(table);
})