window.addEventListener("DOMContentLoaded", async event => {
    const container = document.getElementById("tableContainer");
    const selection = document.getElementById("selection");
    const data = [];

    const response = await fetch("http://localhost:3000/data/supplies/inventory.csv");
    const text = await response.text();
    for(let line of text.split("\r\n")){
        data.push(line.split(","));
    }
    
    const table = makeTable(data);
    container.append(table);

    for(let line of data.slice(1)){
        let option = document.createElement("option");
        option.textContent = line[0];
        selection.append(option);
    }
});


function makeTable(data){
    const table = document.createElement("table");

    for(let layerIndex = 0; layerIndex < data.length; layerIndex++){
        let row = document.createElement("tr");
        
        for(let element of data[layerIndex]){
            if(layerIndex === 0){
                row.innerHTML += `<th>${element}</th>`;
            }
            else{
                row.innerHTML += `<td>${element}</td>`;
            }
        }
        table.append(row);
    }
    return table;
}


function submitRequest(){
    const supplyName = document.getElementById("selection").value;
    const supplyQuantity = Number(document.getElementById("quantity").value);
    const message = document.getElementById("message");

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
    
    const requestBody = {username: sessionStorage.getItem("username"), supply: supplyName, quantity: supplyQuantity};

    fetch('http://localhost:3000/data/supplies/requests.csv', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
    }).then(async response => {
        const data = await response.text();
        message.textContent = data;
    });
}