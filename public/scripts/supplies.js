import { makeTable, URL } from "./utilities.js";


window.addEventListener("DOMContentLoaded", async event => {
    const container = document.getElementById("tableContainer");
    const selection = document.getElementById("selection");
    const data = [];

    // Get inventory data
    const response = await fetch("http://localhost:3000/data/supplies/inventory.csv");
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

    // Make options
    for(let line of data.slice(1)){
        let option = document.createElement("option");
        option.textContent = line[0];
        selection.append(option);
    }
});


document.getElementById("submit").addEventListener("click", submitRequest);


function submitRequest(){
    const supplyName = document.getElementById("selection").value;
    const supplyQuantity = Number(document.getElementById("quantity").value);
    const message = document.getElementById("message");

    // Check quantity
    if(supplyQuantity === 0){
        message.textContent = "Invalid number input.";
        return null;
    }
    if(!Number.isInteger(supplyQuantity)){
        message.textContent = "Must be integer.";
        return null;
    }
    if(supplyQuantity < 0){
        message.textContent = "Must be positive number.";
        return null;
    }
    
    // Send request
    const requestBody = {username: sessionStorage.getItem("username"), supply: supplyName, quantity: supplyQuantity};

    fetch(`http://${URL}/data/supplies/requests.csv`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
    }).then(async response => {
        const data = await response.text();
        message.textContent = data;
    });
}