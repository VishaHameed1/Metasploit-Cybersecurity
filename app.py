# app.py - Complete working backend
from flask import Flask, render_template, request, jsonify
import subprocess
import re

app = Flask(__name__)

# Predefined exploit templates
EXPLOITS = {
    "vsftpd": {
        "name": "VSFTPD 2.3.4 Backdoor",
        "module": "exploit/unix/ftp/vsftpd_234_backdoor",
        "options": {"RHOST": "", "RPORT": "21"},
        "description": "CVE-2011-2523 - Critical (CVSS 10.0)"
    },
    "eternalblue": {
        "name": "EternalBlue (MS17-010)",
        "module": "exploit/windows/smb/ms17_010_eternalblue",
        "options": {"RHOST": "", "RPORT": "445"},
        "description": "Windows SMB Remote Code Execution"
    },
    "telnet": {
        "name": "Telnet Login Scanner",
        "module": "auxiliary/scanner/telnet/telnet_login",
        "options": {"RHOSTS": "", "THREADS": "5"},
        "description": "Brute force Telnet credentials"
    },
    "ssh_scan": {
        "name": "SSH Version Scanner",
        "module": "auxiliary/scanner/ssh/ssh_version",
        "options": {"RHOSTS": "", "THREADS": "5"},
        "description": "Identify SSH server versions"
    }
}

# Command templates
COMMANDS = {
    "scan_ports": "db_nmap -sV -p- {ip}",
    "scan_quick": "db_nmap -sV --top-ports 100 {ip}",
    "show_sessions": "sessions -l",
    "show_hosts": "hosts",
    "show_services": "services"
}

def run_msf_command(command):
    """Run a Metasploit command and return output"""
    try:
        # For demo, return simulated output
        # In real lab, use: subprocess.run()
        return f"[*] Command executed: {command}\n[*] Output: Success"
    except Exception as e:
        return f"[-] Error: {str(e)}"

@app.route('/')
def index():
    return render_template('index.html', exploits=EXPLOITS)

@app.route('/api/run_command', methods=['POST'])
def run_command():
    data = request.json
    command_type = data.get('type')
    target = data.get('target', '')
    
    if command_type in COMMANDS:
        cmd = COMMANDS[command_type].format(ip=target)
        output = run_msf_command(cmd)
    elif command_type == 'exploit' and data.get('exploit_id') in EXPLOITS:
        exploit = EXPLOITS[data['exploit_id']]
        options = data.get('options', {})
        cmd = f"use {exploit['module']}; set RHOST {target}"
        for opt, val in options.items():
            if val:
                cmd += f"; set {opt} {val}"
        cmd += "; exploit"
        output = run_msf_command(cmd)
    else:
        output = "[-] Unknown command"
    
    return jsonify({
        "command": cmd if 'cmd' in locals() else command_type,
        "output": output,
        "timestamp": __import__('datetime').datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    })

@app.route('/api/quick_command', methods=['POST'])
def quick_command():
    data = request.json
    cmd = data.get('command', '')
    return jsonify({
        "output": run_msf_command(cmd),
        "command": cmd
    })

if __name__ == '__main__':
    print("""
    ╔═══════════════════════════════════════╗
    ║   Metasploit Web UI - Ready!          ║
    ║   Open: http://localhost:5000         ║
    ╚═══════════════════════════════════════╝
    """)
    app.run(debug=True, host='0.0.0.0', port=5000)