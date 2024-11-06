from util import getFlows , sendFlowCmd
import json
with open('config.json') as file:
    config = json.load(file)
#print(config)
#d = getFlows(config['host_ip'],config['host_user'],config['host_user_pass'],config['bridge'])
#print(d)
exampleDictFlow = {"cmd": "add-flow",
                   "PRIORITY": 100,
                    "MATCH" : ["in_port=7"],
                    "ACTIONS" : ["output:12"]}


exampleDictFlowdel = {
                "cmd": "del-flows",
                "flow_id": 59
            }

print(sendFlowCmd(config['host_ip'],config['host_user'],config['host_user_pass'],config['bridge'],exampleDictFlow))
print(sendFlowCmd(config['host_ip'],config['host_user'],config['host_user_pass'],config['bridge'],exampleDictFlowdel))