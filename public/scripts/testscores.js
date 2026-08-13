document.getElementById("entry").addEventListener("keypress", event => {
    if(event.key === "Enter"){
        testScores();
    }
})


function testScores(){
    const output = document.getElementById("output");
    const message = document.getElementById("message");
    
    // Check if year is valid
    let year = document.getElementById("entry").value;
    if(year.includes(".")){
        message.textContent = "Invalid year entry.";
        resetOutput();
        return null;
    }
    if(year === ""){
        message.textContent = "Invalid year entry.";
        resetOutput();
        return null;
    }
    year = parseInt(year);
    if(year < 2000 || year > 2050){
        message.textContent = "Year out of range.";
        resetOutput();
        return null;
    }

    // Make panel selection thing
    output.innerHTML = `<h3>${year} Test Scores</h3>`;
    const panelContainer = document.createElement("div");
    panelContainer.style.display = "flex";
    
    const headings = ["Fall Standard", "Spring Standard", "SAT"];
    const desc = ["View tests scores for quarter 1.",
                  "View test scores for quarter 3.",
                  "View SAT scores."];
    const ids = ["fall", "spring", "sat"];
    
    new Promise((resolve, reject) => {
        for(let i = 0; i <= 2; i++){
            let tmp = document.createElement("div");
            tmp.innerHTML = `<h4>${headings[i]}</h4>`;
            tmp.innerHTML += `<p>${desc[i]}</p>`;
            tmp.classList.add("scorePanel");
            tmp.id = year + ids[i];
            
            panelContainer.append(tmp);
        }
        output.append(panelContainer);
        resolve(1);
    }).then(value => addListeners());

    output.append(document.createElement("hr"));
}


function addListeners(){
    // im so freeging smart
    document.querySelectorAll(".scorePanel").forEach(element => {
        element.addEventListener("click", async event => {
            const output = document.getElementById("output");
            let target;
            // Get id
            if(event.target.id === ""){
                target = event.target.parentNode;
            }
            else{
                target = event.target;
            }
            
            // Get data from server
            const scoreData = await fetchScores(target.id);
            if(scoreData === 404){
                resetOutput();
                document.getElementById("message").textContent = "Scores could not be found";
                return null;
            }
            
            // Add table to output
            if(document.getElementById("scoreTable") != null){
                output.removeChild(document.getElementById("scoreTable"));
            }
            output.append(makeTable(scoreData));
        })
    })
}


async function fetchScores(id){
    const data = [];

    const year = id.slice(0, 4);
    const type = id.slice(4);

    const response = await fetch(`http://localhost:3000/data/testScores/${year}/${type}.csv`);
    
    if(response.status === 404){
        return 404;
    }
    const text = await response.text();
    for(let row of text.split("\r\n")){
        data.push(row.split(","));
    }
    return data;
}


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
    table.id = "scoreTable";
    return table;
}


function resetOutput(){
    const output = document.getElementById("output");
    output.innerHTML = "<h3>No data</h3>Enter year to view test scores.";
}