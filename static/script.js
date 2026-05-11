// static/script.js
let commandHistory = [];

function addToHistory(command, output) {
    commandHistory.unshift({
        command: command,
        output: output.substring(0, 100) + '...',
        time: new Date().toLocaleTimeString()
    });
    
    const historyDiv = document.getElementById('history');
    if (historyDiv) {
        historyDiv.innerHTML = commandHistory.map(h => `
            <div class="history-item" onclick="rerunCommand('${h.command.replace(/'/g, "\\'")}')">
                <strong>⌛ ${h.time}</strong><br>
                <span style="color:#888">${h.command}</span>
            </div>
        `).join('');
        if (commandHistory.length === 0) {
            historyDiv.innerHTML = '<div class="history-empty">No commands yet</div>';
        }
    }
}

function addOutput(text, type = 'info') {
    const output = document.getElementById('output');
    const line = document.createElement('div');
    line.innerHTML = `<span class="prompt">msf6 ></span> <span class="${type}">${text}</span>`;
    output.appendChild(line);
    output.scrollTop = output.scrollHeight;
}

function clearOutput() {
    const output = document.getElementById('output');
    output.innerHTML = `<span class="prompt">msf6 ></span> <span class="info">Output cleared</span>`;
}

async function runCommand(command, type, extraData = {}) {
    addOutput(`Executing: ${command}`, 'info');
    
    try {
        const response = await fetch('/api/run_command', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({command: command, type: type, ...extraData})
        });
        const data = await response.json();
        addOutput(data.output, 'success');
        addToHistory(command, data.output);
    } catch (error) {
        addOutput(`Error: ${error.message}`, 'error');
    }
}

async function quickCommand(cmdType, target = '') {
    const data = {type: cmdType};
    if (target) data.target = target;
    
    try {
        const response = await fetch('/api/run_command', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data)
        });
        const result = await response.json();
        addOutput(result.output, 'success');
        addToHistory(cmdType + (target ? ' ' + target : ''), result.output);
    } catch (error) {
        addOutput(`Error: ${error.message}`, 'error');
    }
}

async function runCustomCommand() {
    const cmd = document.getElementById('customCmd').value;
    if (!cmd) return;
    
    try {
        const response = await fetch('/api/quick_command', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({command: cmd})
        });
        const data = await response.json();
        addOutput(data.output, 'success');
        addToHistory(cmd, data.output);
        document.getElementById('customCmd').value = '';
    } catch (error) {
        addOutput(`Error: ${error.message}`, 'error');
    }
}

let currentExploit = null;

function showExploitForm(exploitId) {
    currentExploit = exploitId;
    const exploitData = {
        'vsftpd': {name: 'VSFTPD Backdoor', options: [{name: 'RPORT', default: '21'}]},
        'eternalblue': {name: 'EternalBlue', options: [{name: 'RPORT', default: '445'}]},
        'telnet': {name: 'Telnet Scanner', options: [{name: 'THREADS', default: '5'}]},
        'ssh_scan': {name: 'SSH Scanner', options: [{name: 'THREADS', default: '5'}]}
    };
    
    const data = exploitData[exploitId] || {name: exploitId, options: []};
    
    document.getElementById('exploitFormTitle').innerHTML = `💀 ${data.name}`;
    
    let optionsHtml = '';
    data.options.forEach(opt => {
        optionsHtml += `
            <label style="color:#888; font-size:11px">${opt.name}:</label>
            <input type="text" id="opt_${opt.name}" value="${opt.default}" placeholder="${opt.name}">
        `;
    });
    document.getElementById('extraOptions').innerHTML = optionsHtml;
    document.getElementById('exploitForm').style.display = 'block';
}

function hideExploitForm() {
    document.getElementById('exploitForm').style.display = 'none';
    currentExploit = null;
}

async function runExploit() {
    if (!currentExploit) return;
    
    const target = document.getElementById('targetIP').value;
    if (!target) {
        addOutput('Please enter target IP', 'error');
        return;
    }
    
    const options = {};
    const optInputs = document.querySelectorAll('#extraOptions input');
    optInputs.forEach(input => {
        const key = input.id.replace('opt_', '');
        options[key] = input.value;
    });
    
    addOutput(`[!] Launching exploit on ${target}...`, 'info');
    
    try {
        const response = await fetch('/api/run_command', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                type: 'exploit',
                exploit_id: currentExploit,
                target: target,
                options: options
            })
        });
        const data = await response.json();
        addOutput(data.output, 'success');
        addToHistory(`exploit ${currentExploit} on ${target}`, data.output);
        hideExploitForm();
    } catch (error) {
        addOutput(`Exploit failed: ${error.message}`, 'error');
    }
}

function rerunCommand(cmd) {
    document.getElementById('customCmd').value = cmd;
    runCustomCommand();
}

// Demo mode - simulated responses (for presentation if lab not ready)
function enableDemoMode() {
    addOutput('Demo mode enabled - simulated responses', 'info');
    window.demoMode = true;
}

// Sample demo responses
const demoResponses = {
    'scan_quick': '[+] Scan complete: Found 5 open ports. Port 21 (vsftpd) appears vulnerable.',
    'vsftpd': '[!] Exploiting vsftpd...\n[+] Root shell obtained! whoami → root',
    'show_sessions': 'Active sessions:\n 1: shell (root) on 10.0.2.4:21'
};

console.log('Metasploit Web UI Ready!');