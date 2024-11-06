import json

from flask import Flask
from  flask import render_template
from flask import abort, redirect, url_for,request
import util


app = Flask(__name__)
TITLE = 'OVS Controller'
with open('config.json') as file:
    config = json.load(file)


with open('tabs.txt') as file:
    tabs = file.read()


@app.route('/')
def home():
    return redirect(url_for('flows'))

@app.route('/flows')
def flows():
    return render_template('flows.html',title=TITLE,switch_host=config['host_ip'] , bridge=config['bridge'])


@app.route('/info')
def info():
    return render_template('info.html',title=TITLE,switch_host=config['host_ip'],bridge=config['bridge'])

@app.route('/flow_editor')
def flow_editor():
    return render_template('flow_editor.html',title=TITLE)

@app.route('/common_flow_rules_UI')
def common_flow_rules_UI():
    return render_template('common_flow_rules_UI.html',title=TITLE)


@app.route('/app/v1/sendCmd', methods=['POST'])
def sendCmd():
    data =  json.loads(request.get_json())  # For JSON data
    # data = request.form  # For form data
    res = util.sendFlowCmd(config['host_ip'], config['host_user'], config['host_user_pass'], config['bridge'], data)
    return {'mes' : res }

@app.route('/app/v1/getTabs')
def getTabs():
    return tabs


@app.route('/app/v1/get_flow_editor_options')
def getFlowEditorOptions():
    with open('options.txt') as file:
        options = file.read()
    return options

@app.route('/app/v1/getFlows')
def getFlows():
    #Example rules, replace with actual data from your backend
    data = util.getFlows(config['host_ip'],config['host_user'],config['host_user_pass'],config['bridge'])
    return data


if __name__ == '__main__':
    app.run(debug=True)
