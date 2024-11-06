let block_to_insert = "add_flow_Block"
let data_item = ''

var myTextArea = document.getElementById("jsonTextarea");
var editor = CodeMirror.fromTextArea(myTextArea, {
    lineNumbers: true,
    mode: { name: "javascript", json: true },
});



document.getElementById('block_to_insert').addEventListener('change', function () {
    block_to_insert = this.value
    var selectedIndex = this.selectedIndex;
    if (this.options[selectedIndex].dataset.cmdItem) {
        data_item = this.options[selectedIndex].dataset.cmdItem
    }

});



function showLoadingSpinner() {
    document.getElementById('loading-spinner').style.display = 'block';
}

function hideLoadingSpinner() {
    document.getElementById('loading-spinner').style.display = 'none';
}

function printToscreen(message) {
    let response_div = document.getElementById("response")
    let clear_response_btn = document.createElement('button')
    clear_response_btn.innerText = "clear"
    clear_response_btn.addEventListener('click', () => {
        response_div.innerHTML = ""
    })
    document.getElementById("response").innerText = message
    response_div.appendChild(clear_response_btn)


}

function method_controller() {
    switch (method) {
        case 'GET':
            GetRulesBlockObjectFromErgBtn(`${document.getElementById("ipv4Input").value}`)
            break;
        case 'POST':
            SendRulesBlockObjectToErgBtn(`${document.getElementById("ipv4Input").value}`)
            break;
        case 'PUT':

            break;
        case 'DELETE':

            break;

        default:
            break;
    }
}

/*
function GetRulesBlockObjectFromErgBtn(endpoint) {
    showLoadingSpinner();
    fetch(endpoint)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            // document.getElementById("jsonTextarea").value = JSON.stringify(data, null, 2);
            editor.setValue(JSON.stringify(data, null, 2));
            hideLoadingSpinner();
            console.log('Success:', data);
        })
        .catch(error => {
            //document.getElementById("response").innerText = "Error: " + error.message;
            printToscreen("Error: " + error.message)
            hideLoadingSpinner();
            console.error('Error:', error);
        });
}
function SendRulesBlockObjectToErgBtn(endpoint) {
    //var textareaValue = document.getElementById("jsonTextarea").value;
    var textareaValue = editor.getValue()
    var jsonData;
    try {
        jsonData = JSON.parse(textareaValue);
    } catch (error) {
        printToscreen("Error: " + error.message)
        return;
    }
    showLoadingSpinner();
    fetch(endpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(jsonData),
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            printToscreen("Success: Data posted successfully")
            console.log('Success:', data);
            hideLoadingSpinner();
        })
        .catch(error => {
            printToscreen("Error: " + error.message)
            hideLoadingSpinner();
            console.error('Error:', error);
        });

}
        */

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function validateJSON() {
    // Get the content from the CodeMirror editor
    var editorValue = editor.getValue();
    try {
        JSON.parse(editorValue);
        //document.getElementById("validationResult").innerHTML = "Valid JSON";
        printToscreen("Valid JSON")
    } catch (error) {
        //document.getElementById("validationResult").innerHTML = "Invalid JSON: " + error.message;
        printToscreen("Invalid JSON: " + error.message)
    }
}

/*
function addBlockToJson(newObject) {

    var textarea = document.getElementById("jsonTextarea");
    var cursorPos = textarea.selectionStart;
    var textBeforeCursor = textarea.value.substring(0, cursorPos);
    var textAfterCursor = textarea.value.substring(cursorPos);

    var newText = textBeforeCursor + JSON.stringify(newObject, null, 2) + textAfterCursor;

    // Update the textarea value with the new text
    textarea.value = newText;
    // Set cursor position after the inserted JSON block
    textarea.setSelectionRange(cursorPos + JSON.stringify(newObject, null, 2).length, cursorPos + JSON.stringify(newObject, null, 2).length);
}
*/


function addBlockToJson(newObject) {
    // Get the current cursor position
    var cursorPos = editor.getCursor();
    // Get the content before and after the cursor
    var textBeforeCursor = editor.getRange({ line: 0, ch: 0 }, cursorPos);
    var textAfterCursor = editor.getRange(cursorPos, { line: editor.lineCount(), ch: 0 });

    // Construct the new text with the JSON block inserted
    var newText = textBeforeCursor + JSON.stringify(newObject, null, 2) + textAfterCursor;

    // Replace the content of the editor with the new text
    editor.setValue(newText);

    // Set cursor position after the inserted JSON block
    var newPos = {
        line: cursorPos.line + 1,
        ch: JSON.stringify(newObject, null, 2).length
    };
    editor.setCursor(newPos);
}

function addTextToJson(newText) {
    // Get the current cursor position
    var cursorPos = editor.getCursor();
    // Get the content before and after the cursor
    var textBeforeCursor = editor.getRange({ line: 0, ch: 0 }, cursorPos);
    var textAfterCursor = editor.getRange(cursorPos, { line: editor.lineCount(), ch: 0 });

    // Construct the new text with the JSON block inserted
    var newText = textBeforeCursor + newText + textAfterCursor;

    // Replace the content of the editor with the new text
    editor.setValue(newText);

    // Set cursor position after the inserted JSON block
    var newPos = {
        line: cursorPos.line + 1,
        ch: newText.length
    };
    editor.setCursor(newPos);
}


function json_block_insertion_controller() {
    var newObject = {}
    switch (block_to_insert) {
        case 'add_flow_Block':
            newObject = {
                "cmd": "add-flow",
                "PRIORITY": "<number>",
                "MATCH": [],
                "ACTIONS": []
            }
            addBlockToJson(newObject)
            break;
        case 'del_flow_block_by_flowId':
            newObject = {
                "cmd": "del-flows",
                "flow_id": "<number/flow_id>"
            }
            addBlockToJson(newObject)
            break;
        default:
            addTextToJson(`"${data_item}"`)
            break;
    }

}

function sendJson() {
    showLoadingSpinner();
    fetch('http://localhost:5000/app/v1/sendCmd', {
        method: 'POST', // Specify the request method
        headers: {
            'Content-Type': 'application/json' // Set the content type to JSON
        },
        body: JSON.stringify(editor.getValue()) // Convert the data object to a JSON string
    })
        .then(response => response.json()) // Parse the JSON response
        .then(data => {
            printToscreen('Success:', data); // Handle the response data
            hideLoadingSpinner();
        })
        .catch(error => {
            printToscreen('Error:', error); // Handle any errors
            hideLoadingSpinner();
        });
}


document.getElementById("ClearBtn").addEventListener("click", function () {
    document.getElementById("jsonTextarea").value = "";
    editor.setValue("");
    document.getElementById("validationResult").innerHTML = "";

});

