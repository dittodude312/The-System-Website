import { makeTable, URL } from "./utilities.js"


document.getElementById("entry").addEventListener("keypress", (event) => {
    if(event.key === "Enter"){
        fetchGrades();
    }
})


document.getElementById("enter").addEventListener("click", fetchGrades)


async function fetchGrades(){
    const name = document.getElementById("entry").value.trimEnd();
    const message = document.getElementById("message");
    const output = document.getElementById("output");

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
    const gradeDataJSON = await fetchData(tmp[0] + tmp[1]);
    if(gradeDataJSON === 404){
        message.textContent = "Student could not be found.";
        resetOutput();
        return null;
    }

    // Make into 2d list
    const gradeDataArray = [["Subject", "Grade"]];
    for(let key of Object.keys(gradeDataJSON)){
        gradeDataArray.push([key, `<input disabled value="${gradeDataJSON[key]}">`])
    }
    
    // Display grades 
    message.textContent = "Grades found.";
    output.innerHTML = `<h3 id='studentTag'>Student ${tmp[0] + " " + tmp[1]}</h3>`;
    const table = makeTable(gradeDataArray, null, ["subject", "gradeEntry"]);
    output.append(table);
    
    // Change grade button
    const changeGradeButton = document.createElement("button");
    changeGradeButton.textContent = "Change Grade";
    changeGradeButton.id = "changeGradeBtn";
    output.append(changeGradeButton);

    document.getElementById("changeGradeBtn").addEventListener("click", changeGrade);
}


async function fetchData(name){
    const response = await fetch(`http://${URL}/data/grades/${name}.json`);
    if(response.status === 404){
        return 404;
    }
    const data = await response.json();
    return data;
}


function resetOutput(){
    output.innerHTML = "<h3>No data</h3>Enter student's name to view grades.";
}


function changeGrade(){
    const changeGradeButton = document.getElementById("changeGradeBtn");
    document.querySelectorAll(".gradeEntry input").forEach(element => {
        element.removeAttribute("disabled");
    });
    changeGradeButton.textContent = "Submit";
    changeGradeButton.removeEventListener("click", changeGrade);
    changeGradeButton.addEventListener("click", submitGrade);
}


function submitGrade(){
    const changeGradeButton = document.getElementById("changeGradeBtn");
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
    fetch(`http://${URL}/data/grades/${name}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(gradeString)
    }).then(async repsonse => {
        if(await repsonse.text() === "good"){
            // Change button stuff
            changeGradeButton.textContent = "Change Grade";
            changeGradeButton.removeEventListener("click", submitGrade);
            changeGradeButton.addEventListener("click", changeGrade);
            document.querySelectorAll(".gradeEntry input").forEach(element => {
            element.setAttribute("disabled", "");
            });
        }
        else{
            window.alert("Grade submission was invalid. Refresh and try again.")
        }
    });
}