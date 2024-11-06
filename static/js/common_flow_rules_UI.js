
const select_action = document.getElementById("action_type")

const add_flow_obj = {
    "cmd": "add-flow",
    "PRIORITY": 1,
    "MATCH": [],
    "ACTIONS": []
}

const NonSpecialsupportedMatches = new Set([
    "dl_dst",
    "dl_src",
    "dl_vlan",
    "dl_vlan_pcp",
    "in_port",
])

const SpecialsupportedMatches = new Set([
    "nw_dst",
    "nw_src",
    "tp_dst",
    "tp_src"
])
const supportedActions = [{ action_type: "output", addtional_prams: ["output_port"] }, { action_type: "drop" }]
/*

Priority
: 
"1"
action_type
: 
"output"
dl_dst
: 
""
dl_src
: 
""
dl_vlan
: 
""
dl_vlan_pcp
: 
""
in_port
: 
""
nw_dst
: 
""
nw_src
: 
""
output_port
: 
""
protocol_type
: 
"tcp"
tp_dst
: 
""
tp_src
: 
""

*/

function sendJson() {
    //showLoadingSpinner();
    fetch('http://localhost:5000/app/v1/sendCmd', {
        method: 'POST', // Specify the request method
        headers: {
            'Content-Type': 'application/json' // Set the content type to JSON
        },
        body: JSON.stringify(add_flow_obj) // Convert the data object to a JSON string
    })
        .then(response => response.json()) // Parse the JSON response
        .then(data => {
            //printToscreen('Success:', data); // Handle the response data
            //hideLoadingSpinner();
            console.log(data)
        })
        .catch(error => {
            //printToscreen('Error:', error); // Handle any errors
            //hideLoadingSpinner();
            console.log(error)
        });
}

const form = document.getElementById('ovs-form');

function buildmatches(formObj) {
    for (let m in NonSpecialsupportedMatches) {
        if (!formObj[m] === "") {
            add_flow_obj.MATCH.push(`${m}=${formObj[m]}`)
        }
    }

    //ip network matching
    if (formObj["nw_dst"] !== "" || formObj["nw_src"] !== "") {
        add_flow_obj.MATCH.push('ip')
    }
    if (formObj["nw_dst"] !== "") {
        add_flow_obj.MATCH.push(`nw_dst=${formObj["nw_dst"]}`)
    }
    if (formObj["nw_src"] !== "") {
        add_flow_obj.MATCH.push(`nw_src=${formObj["nw_src"]}`)
    }


    //port transport matching
    if (formObj["tp_dst"] !== "" || formObj["tp_src"] !== "") {
        add_flow_obj.MATCH.push(`${formObj["protocol_type"]}`)
    }
    if (formObj["tp_dst"] !== "") {
        add_flow_obj.MATCH.push(`tp_dst=${formObj["tp_dst"]}`)
    }
    if (formObj["tp_src"] !== "") {
        add_flow_obj.MATCH.push(`tp_src=${formObj["tp_src"]}`)
    }

}

function testCmd() {
    let cmd = 'ovs-ofctl add-flow'
    let switchOrbridge = 'br1'
    let matches = add_flow_obj['MATCH'].join(',');
    let actions = add_flow_obj['ACTIONS'].join(',');
    alert(cmd + ' ' + switchOrbridge + ' "' + 'priority=' + add_flow_obj['PRIORITY'] + ',' + matches + ',actions=' + actions + '"')

}

function buildactions(formObj) {

    switch (formObj["action_type"]) {
        case "output":
            let outputs = formObj["output_port"].split(",")
            for (let o in outputs) {
                add_flow_obj.ACTIONS.push(`output:${outputs[o]}`)
            }
            break;

        case "drop":
            add_flow_obj.ACTIONS.push("drop")
            break;

        default:
            break;
    }


}

// Add a submit event listener
form.addEventListener('submit', function (event) {
    // Prevent the form from submitting and refreshing the page
    event.preventDefault();
    // Create a FormData object to gather form data
    const formData = new FormData(form);
    // Log form data entries
    /*
    for (let [name, value] of formData) {
        console.log(`${name}: ${value}`);
    }*/
    // If you need the data as an object:
    const formObject = Object.fromEntries(formData);
    //console.log(formObject);

    add_flow_obj.PRIORITY = Number.parseInt(formObject["Priority"])
    buildmatches(formObject)
    buildactions(formObject)
    console.log(add_flow_obj)
    testCmd()
    //sendJson()

});


// JavaScript to handle dynamic action options based on selected type
select_action.addEventListener("change", function () {
    var actionOptions = document.getElementById("action_options");
    actionOptions.innerHTML = ""; // Clear previous options

    switch (this.value) {
        case "output":
            actionOptions.innerHTML = `
                    <label for="output_port">Output Port:</label>
                    <input type="text" name="output_port" id="output_port"  placeholder="1,2,7 or 1" required>
                `;
            break;

        case "drop":
            actionOptions.innerHTML = ``;
            break;

        case "set_field":
            actionOptions.innerHTML = `
                    <label for="set_field_name">Field Name:</label>
                    <input type="text" name="set_field_name" id="set_field_name">
                    <br>

                    <label for="set_field_value">Value:</label>
                    <input type="text" name="set_field_value" id="set_field_value">
                `;
            break;

        // Add more cases for other action types as needed
    }
});

function triggerChangeEvent() {
    // Create a new event
    const event = new Event('change');

    // Dispatch the event (trigger the change event)

    select_action.dispatchEvent(event)
}
triggerChangeEvent()



/*
The `ovs-ofctl` command is used to interact with Open vSwitch (OVS) to manage OpenFlow rules. You can use the `add-flow` command to add flow entries that match various packet fields, including MAC addresses, IP addresses, UDP/TCP protocols, and ports.

Here are examples of how to add flow rules that match specific criteria:

### 1. **Match MAC Address, IP Address, and UDP Ports**

```bash
ovs-ofctl add-flow br0 "priority=100,in_port=1,dl_src=00:11:22:33:44:55,dl_dst=66:77:88:99:AA:BB,ip,nw_src=192.168.1.10,nw_dst=192.168.1.20,udp,tp_src=1234,tp_dst=5678,actions=output:2"
```

- `br0`: Name of the bridge.
- `priority=100`: The priority of the rule (higher values have precedence).
- `in_port=1`: Match traffic entering through port 1.
- `dl_src=00:11:22:33:44:55`: Match the source MAC address.
- `dl_dst=66:77:88:99:AA:BB`: Match the destination MAC address.
- `ip`: Indicate that this rule matches IP packets.
- `nw_src=192.168.1.10`: Match the source IP address.
- `nw_dst=192.168.1.20`: Match the destination IP address.
- `udp`: Match UDP traffic.
- `tp_src=1234`: Match the source UDP port 1234.
- `tp_dst=5678`: Match the destination UDP port 5678.
- `actions=output:2`: Send matching packets to port 2.

### 2. **Match MAC Address, IP Address, and TCP Ports**

```bash
ovs-ofctl add-flow br0 "priority=100,in_port=1,dl_src=AA:BB:CC:DD:EE:FF,dl_dst=11:22:33:44:55:66,ip,nw_src=10.0.0.1,nw_dst=10.0.0.2,tcp,tp_src=80,tp_dst=8080,actions=output:3"
```

- `br0`: Name of the bridge.
- `priority=100`: Priority of the rule.
- `in_port=1`: Match traffic entering through port 1.
- `dl_src=AA:BB:CC:DD:EE:FF`: Match the source MAC address.
- `dl_dst=11:22:33:44:55:66`: Match the destination MAC address.
- `ip`: Indicate that this rule matches IP packets.
- `nw_src=10.0.0.1`: Match the source IP address.
- `nw_dst=10.0.0.2`: Match the destination IP address.
- `tcp`: Match TCP traffic.
- `tp_src=80`: Match the source TCP port 80.
- `tp_dst=8080`: Match the destination TCP port 8080.
- `actions=output:3`: Send matching packets to port 3.

### 3. **Match Any IP Address with Specific TCP/UDP Ports**
If you want to match any IP address but still filter by TCP/UDP ports, you can do this:

#### Match Any IP Address with Specific TCP Ports
```bash
ovs-ofctl add-flow br0 "priority=100,tcp,tp_src=443,tp_dst=8443,actions=output:1"
```

#### Match Any IP Address with Specific UDP Ports
```bash
ovs-ofctl add-flow br0 "priority=100,udp,tp_src=53,tp_dst=1053,actions=output:2"
```

### Key Elements:
- `tcp`/`udp`: Specifies whether the rule applies to TCP or UDP traffic.
- `tp_src`: Source port.
- `tp_dst`: Destination port.
- `actions=output:X`: The action to perform, here it is sending traffic to a specific port (`X`).

You can customize these rules further by adding more matching conditions or modifying actions.
*/


