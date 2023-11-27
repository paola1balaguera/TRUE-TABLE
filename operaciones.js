function llenarSelectores() {
    const numVariables = document.getElementById('variablesInput').valueAsNumber;

    const varSelects = document.getElementById('var1Select');
    const var2Select = document.getElementById('var2Select');
    varSelects.innerHTML = '';
    var2Select.innerHTML = '';

    for (let i = 0; i < numVariables; i++) {
        
        const option = document.createElement('option');
        option.value = i;
        option.text = String.fromCharCode(65 + i);
        varSelects.appendChild(option);

        const option2 = document.createElement('option');
        option2.value = i;
        option2.text = String.fromCharCode(65 + i);
        var2Select.appendChild(option2);

        const negatedOption = document.createElement('option');
        negatedOption.value = -1 * (i + 1); 
        negatedOption.text = '~' + String.fromCharCode(65 + i);
        varSelects.appendChild(negatedOption);

        const negatedOption2 = document.createElement('option');
        negatedOption2.value = -1 * (i + 1); 
        negatedOption2.text = '~' + String.fromCharCode(65 + i);
        var2Select.appendChild(negatedOption2);
    }
}

function calcular() {
    const numVariables = document.getElementById('variablesInput').valueAsNumber;
    const operation = document.getElementById('operacionSelect').value;
    const var1 = parseInt(document.getElementById('var1Select').value);
    const var2 = parseInt(document.getElementById('var2Select').value);
    let negationCounter = 0;

    const headers = [];
    for (let i = 0; i < numVariables; i++) {
        headers.push(String.fromCharCode(65 + i));
    }
    if (var1 < 0) {
        headers.push('~' + String.fromCharCode(65 + (Math.abs(var1)-1) ));
        negationCounter = negationCounter + 1;
    }
    if (var2 < 0) {
        headers.push('~' + String.fromCharCode(65 + (Math.abs(var2)-1) ));
        negationCounter = negationCounter + 1;
    }
    headers.push('Resultado');

    const combinations = [];
    for (let i = 0; i < Math.pow(2, numVariables); i++) {
        const combination = [];
        for (let j = numVariables - 1; j >= 0; j--) {
            combination.push((i & Math.pow(2, j)) ? 0 : 1);
        }
        if (negationCounter > 0) {
            if (var1 < 0) {
                combination.push((i & Math.pow(2, Math.abs(var1+numVariables) )) ? 1 : 0);
            }
            if (var2 < 0) {
                combination.push((i & Math.pow(2, Math.abs(var2+numVariables) )) ? 1 : 0);
            }
        }
        combinations.push(combination);
    }

    const tablaVerdad = [];
    combinations.forEach(combination => {
        let result;
        let var1Value = combination[Math.abs(var1)];
        let var2Value = combination[Math.abs(var2)];

        if (var1 < 0) var1Value = 1 - combination[Math.abs(var1) - 1];
        if (var2 < 0) var2Value = 1 - combination[Math.abs(var2) - 1];

        switch (operation) {
            case 'AND':
                result = var1Value * var2Value ? 1 : 0;
                break;
            case 'OR':
                result = var1Value + var2Value ? 1 : 0;
                break;
            case 'IMPLIES':
                result = !var1Value + var2Value ? 1 : 0;
                break;
            case 'XOR':
                result = var1Value !== var2Value ? 1 : 0;
                break;
            default:
                result = 0;
        }

        tablaVerdad.push([...combination, result]);
    });

    const tablaDiv = document.getElementById('tablaVerdad');
    tablaDiv.innerHTML = '<h2>Tabla de Verdad:</h2>';
    const tabla = document.createElement('table');
    const thead = document.createElement('thead');
    const tbody = document.createElement('tbody');

    const headerRow = document.createElement('tr');
    headers.forEach(header => {
        const th = document.createElement('th');
        th.appendChild(document.createTextNode(header));
        headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);

    tablaVerdad.forEach(fila => {
        const tr = document.createElement('tr');
        fila.forEach((valor, index) => {
            const td = document.createElement('td');
            let valueToDisplay = valor; 
            if (index === Math.abs(var1) || index === Math.abs(var2)) {
                
                const negatedIndex = Math.abs(index) - 1; 
                const isNegated = index < 0; 

                if (isNegated) {
                    
                    valueToDisplay = 1 - fila[negatedIndex];
                    td.appendChild(document.createTextNode('¬' + valueToDisplay));
                } else {
                    td.appendChild(document.createTextNode(valueToDisplay));
                }
            } else {
                td.appendChild(document.createTextNode(valueToDisplay));
            }
            tr.appendChild(td);
        });
        tbody.appendChild(tr);
    });

    tabla.appendChild(thead);
    tabla.appendChild(tbody);
    tablaDiv.appendChild(tabla);
}


llenarSelectores();
