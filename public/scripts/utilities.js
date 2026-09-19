const ip = "127.0.0.1";
const port = "3000";

export const URL = `${ip}:${port}`;


export function makeTable(data, id=null, columnClasses=null){
    const table = document.createElement("table");

    for(let layerIndex = 0; layerIndex < data.length; layerIndex++){
        let row = document.createElement("tr");
        
        for(let column = 0; column < data[layerIndex].length; column++){
            if(layerIndex === 0){
                row.innerHTML += `<th>${data[layerIndex][column]}</th>`;
                continue
            }
            
            if(columnClasses != null){
                row.innerHTML += `<td class="${columnClasses[column]}">${data[layerIndex][column]}</td>`;
            }
            else{
                row.innerHTML += `<td>${data[layerIndex][column]}</td>`;
            }
        }
        table.append(row);
    }

    if(id != null){
        table.id = id;
    }

    return table;
}

export function parseCSV(text){
    const data = [];
    for(let line of text.split("\r\n")){
        data.push(line.split(","));
    }
    return data;
}