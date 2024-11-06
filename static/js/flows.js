const rules = [];

function GetFlows(){
    fetch('http://localhost:5000/app/v1/getFlows')
     .then(response => response.json())
     .then(json => {
        console.log(json)
        rules.push(...json);
        populateTable()
     })
     .catch(error => console.error('Error fetching dashboard:', error));
}
function populateTable() {
    const tableBody = document.getElementById('rules-table').getElementsByTagName('tbody')[0];
    tableBody.innerHTML = '';
    rules.forEach(rule => {
        const row = tableBody.insertRow();
        row.insertCell(0).innerText = rule.flow;
        //row.insertCell(1).innerText = rule.priority;
        //row.insertCell(2).innerText = rule.match;
        //row.insertCell(3).innerText = rule.actions;
        //row.insertCell(4).innerHTML = `<button onclick="editRule(${rule.id})">Edit</button>`;
        //row.insertCell(5).innerHTML = `<button onclick="deleteRule(${rule.id})">Delete</button>`;
    });
}
/*
const dialog = document.getElementById('add_edit_flow_dialog')
function openDialog(){
    
    dialog.showModal();
}

function closeDialog(){
    dialog.close();
}



function editRule(id) {
    openDialog()
    const rule = rules.find(r => r.id === id);
    document.getElementById('rule-id').value = rule.id;
    document.getElementById('switch').value = rule.switch;
    document.getElementById('priority').value = rule.priority;
    document.getElementById('match').value = rule.match.split('=')[0];
    document.getElementById('match-value').value = rule.match.split('=')[1];
    document.getElementById('actions').value = rule.actions.split('=')[0];
    document.getElementById('action-value').value = rule.actions.split('=')[1];
    
}

function deleteRule(id) {
    const index = rules.findIndex(r => r.id === id);
    if (index !== -1) {
        rules.splice(index, 1);
        populateTable();
    }
}

function saveRule() {
    const id = document.getElementById('rule-id').value;
    const switchName = document.getElementById('switch').value;
    const priority = document.getElementById('priority').value;
    const match = document.getElementById('match').value;
    const matchValue = document.getElementById('match-value').value;
    const action = document.getElementById('actions').value;
    const actionValue = document.getElementById('action-value').value;

    if (!switchName || !priority || !match || !matchValue || !action || !actionValue) {
        alert('Please fill in all fields.');
        return;
    }

    const rule = {
        id: id ? parseInt(id) : Date.now(),
        switch: switchName,
        priority: parseInt(priority),
        match: `${match}=${matchValue}`,
        actions: `${action}=${actionValue}`
    };

    if (id) {
        const index = rules.findIndex(r => r.id === parseInt(id));
        rules[index] = rule;
    } else {
        rules.push(rule);
    }

    populateTable();
    document.getElementById('rule-form').reset();
    closeDialog()
}

*/


GetFlows()
