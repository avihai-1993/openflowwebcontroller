import paramiko

def read_one_line_from_file(file_path):
    try:
        # Open the file in read mode
        with open(file_path, 'r') as file:
            # Read one line
            line = file.readline().strip()
            return line
    except FileNotFoundError:
        print(f"The file {file_path} was not found.")
        return None
    except Exception as e:
        print(f"An error occurred: {e}")
        return None


def useABS_OVS_VSCTL(cmd):
    return read_one_line_from_file('abs_ovs_vsctl.txt') + ' ' + cmd

def useABS_OVS_OFCTL(cmd):
    return read_one_line_from_file('abs_ovs_ofctl.txt')+ ' '  + cmd

#ovs-ofctl del-flows br1 "flow_id=59"
#ovs-ofctl add-flow br1 "priority=100,in_port=1,actions=drop"
def getSupportedCmd(cmd, switchOrbridge,dataForCmd):
    match cmd:
        case 'add-flow':
            matches = ','.join(dataForCmd['MATCH'])
            actions = ','.join(dataForCmd['ACTIONS'])
            return cmd +' '+ switchOrbridge + ' "' + 'priority='+str(dataForCmd['PRIORITY']) + ',' +matches + ',actions=' + actions + '"'
        case 'del-flows':
            return cmd + ' ' + switchOrbridge + ' "flow_id=' + str(dataForCmd['flow_id']) + '"'
    pass


def sendFlowCmd(switch_ip,user,password,switchOrbridge,dataForCmd):
    ssh = paramiko.SSHClient()
    ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    ssh.connect(switch_ip, username=user, password=password)
    cmd = useABS_OVS_OFCTL(getSupportedCmd(dataForCmd['cmd'],switchOrbridge,dataForCmd))
    stdin, stdout, stderr = ssh.exec_command(cmd)
    res: str = stdout.read().decode('utf-8')
    err: str = stderr.read().decode('utf-8')
    return {'res' : res , 'err' : err}

def getFlows(switch_ip,user,password,switchOrbridge):
    ssh = paramiko.SSHClient()
    ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    ssh.connect(switch_ip, username=user, password=password)
    cmd = 'dump-flows '+switchOrbridge+' --sort'
    stdin, stdout, stderr = ssh.exec_command(useABS_OVS_OFCTL(cmd))
    res:str = stdout.read().decode('utf-8')
    flows = res.strip().split("\n")
    return [{'flow': fl } for fl in flows]