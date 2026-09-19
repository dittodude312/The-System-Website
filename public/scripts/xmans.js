import { makeTable, parseCSV, URL } from "./utilities.js"


window.addEventListener("DOMContentLoaded", async event => {
    const container = document.getElementById("tableContainer");

    const response = await fetch(`http://${URL}/data/xmans/memberlist.csv`);
    if(response.status === 404){
        container.textContent = "An error occurred fetching inventory data.";
        return null;
    }
    const text = await response.text();
    const data = parseCSV(text);

    const table = makeTable(data);
    container.append(table);
})


document.getElementById("year").addEventListener("keypress", event => {
    if(event.key === "Enter"){
        fetchHours();
    }
})


document.getElementById("hourSubmit").addEventListener("click", fetchHours);


async function fetchHours(){
    const month = document.getElementById("month").value;
    const monthAbbr = month.slice(0, 3).toLowerCase();
    const year = document.getElementById("year").value;
    const outputContainer = document.getElementById("hourOutput");
    const outputMessage = document.getElementById("message");

    // Fetch data
    const response = await fetch(`http://${URL}/data/xmans/missionLogs/${year}/${monthAbbr}.csv`);
    if(response.status === 404){
        outputMessage.textContent = "Log could not be found.";
        outputContainer.innerHTML = "<h3>No data</h3>Enter month and year to view mission log.";
        return null;
    }
    const body = await response.text();

    // Add table
    outputContainer.innerHTML = `<h3>Missions for ${month} ${year}</h3>`;
    const table = makeTable(parseCSV(body));
    outputContainer.append(table);

    outputMessage.textContent = "Mission log found.";
}