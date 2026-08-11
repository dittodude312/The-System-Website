const entry = document.getElementById("entry");
const output = document.getElementById("output");
const message = document.getElementById("message");

const changeGradeButton = document.createElement("button");
changeGradeButton.textContent = "Change Grade";
changeGradeButton.id = "changeGradeBtn";
changeGradeButton.onclick = changeGrade;


entry.addEventListener("keypress", (event) => {
    if(event.key === "Enter"){
        fetchGrades();
    }
})

async function fetchGrades(){
    const name = entry.value.trimEnd();

    // Empty string
    if(name == ""){
        message.textContent = "Cannot be empty.";
        resetOutput();
        return null;
    }

    // Wrong format
    const tmp = name.split(" ");
    
    if(tmp.length != 2 || tmp[1] == " "){
        message.textContent = "Invalid name input.";
        resetOutput();
        return null;
    }
    tmp.forEach((element, index, array) => {
        array[index] = element[0].toUpperCase() + element.slice(1).toLowerCase();
    });

    // Not found
    const gradeData = await fecthData(tmp[0] + tmp[1]);
    if(gradeData === 404){
        message.textContent = "Student could not be found.";
        resetOutput();
        return null;
    }
    
    // Display grades 
    message.textContent = "Grades found.";
    output.innerHTML = `<h3 id='studentTag'>Student ${tmp[0] + " " + tmp[1]}</h3>`;
    const table = makeTable(gradeData);
    output.append(table);


    output.append(changeGradeButton);
}


async function fecthData(name){
    const response = await fetch(`http://localhost:3000/data/grades/${name}.json`);
    if(response.status === 404){
        return 404;
    }
    const data = await response.json();
    return data;
}


function makeTable(gradeData){
    const table = document.createElement("table");
    table.innerHTML = "<tr><th>Subject</th><th>Grade</th></tr>";

    for(let key of Object.keys(gradeData)){
        table.innerHTML += `<tr><td class='subject'>${key}</td><td class='gradeEntry'><input disabled value='${gradeData[key]}'></td></tr>`;
    }
    return table;
}


function resetOutput(){
    output.innerHTML = "<h3>No data</h3>Enter student's name to view grades.";
}


function changeGrade(){
    document.querySelectorAll(".gradeEntry input").forEach(element => {
        element.removeAttribute("disabled");
    });
    changeGradeButton.textContent = "Submit";
    changeGradeButton.onclick = submitGrade;
}

function submitGrade(){
    let name = document.getElementById("studentTag").textContent.slice(8);
    name = name.slice(0, name.indexOf(" ")) + name.slice(name.indexOf(" ") + 1);

    // Get keys and values
    const keys = [];
    const values = [];

    document.querySelectorAll(".subject").forEach(element => {
        keys.push(element.textContent);
    });
    document.querySelectorAll(".gradeEntry input").forEach(element => {
        values.push(element.value);
    });

    // Check if grade inputs are valid
    const tmp = values.filter(element => {
        return !["A", "B", "C", "D", "E", "F"].includes(element);
    });

    if(tmp.length != 0){
        window.alert("One or more grade entries is invalid.");
        return null;
    }

    // Make JSON thing
    let gradeString = "{";
    for(let i = 0; i < keys.length; i++){
        gradeString += `"${keys[i]}":"${values[i]}",`;
    }
    gradeString = gradeString.slice(0, gradeString.length - 1) + "}";
    gradeString = JSON.parse(gradeString);

    // Send data to server
    fetch(`http://localhost:3000/data/grades/${name}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(gradeString)
    });

    // Change button stuff
    changeGradeButton.textContent = "Change Grade";
    changeGradeButton.onclick = changeGrade;
    document.querySelectorAll(".gradeEntry input").forEach(element => {
        element.setAttribute("disabled", "");
    });
}