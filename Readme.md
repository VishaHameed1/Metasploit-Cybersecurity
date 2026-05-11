## 👥 Collaborators

- **Visha Hameed** (232201044) – Project Lead & Backend Developer
- **Hadiqa Ehsan** – Frontend Developer & UI Designer
  https://github.com/Hadiqa-Ehsan

> Special thanks to Hadiqa Ehsan for contributions to the user interface design and frontend development.
# 🎯 Metasploit Web UI Controller

<div align="center">

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![Python](https://img.shields.io/badge/python-3.8+-green)
![Flask](https://img.shields.io/badge/flask-2.3.3-red)
![License](https://img.shields.io/badge/license-MIT-yellow)
![Platform](https://img.shields.io/badge/platform-Kali%20Linux%20%7C%20Ubuntu-lightgrey)

**A modern web interface for Metasploit Framework – Run penetration tests from your browser**

[Features](#features) • [Quick Start](#quick-start) • [Screenshots](#screenshots) • [Documentation](#documentation)

</div>

---

## 📸 Screenshots

<div align="center">
  
```
┌─────────────────────────────────────────────────────────────────────────────┐
│  🎯 Metasploit Web Controller                                    ● Connected │
├──────────────┬──────────────────────────────────────────────────┬──────────┤
│  💀 Exploits  │  ⚡ Command Center                               │ 📋 History│
├──────────────┼──────────────────────────────────────────────────┼──────────┤
│ ┌──────────┐ │  [🔍 Quick Scan] [📡 Full Port Scan]             │ ⌛ 14:30  │
│ │VSFTPD    │ │  [💻 Sessions] [🖥️ Hosts] [🔌 Services]          │ scan...   │
│ │Backdoor  │ │                                                  │          │
│ │[Use →]   │ │  ┌────────────────────────────────────────────┐  │ ⌛ 14:28  │
│ └──────────┘ │  │ > Enter custom msfconsole command... [Run] │  │ exploit  │
│              │  └────────────────────────────────────────────┘  │          │
│ ┌──────────┐ │                                                  │          │
│ │EternalBlue│ │  ┌──────────────────────────────────────────┐  │          │
│ │MS17-010  │ │  │ ●●●  msfconsole output          [Clear]   │  │          │
│ │[Use →]   │ │  ├──────────────────────────────────────────┤  │          │
│ └──────────┘ │  │ msf6 > Welcome to Metasploit Web UI       │  │          │
│              │  │ msf6 > Ready for commands                 │  │          │
│ ┌──────────┐ │  │ msf6 > [*] Scan complete: 5 open ports   │  │          │
│ │Telnet    │ │  │ msf6 > [!] Root shell obtained!           │  │          │
│ │Scanner   │ │  │ msf6 > whoami → root                      │  │          │
│ └──────────┘ │  └──────────────────────────────────────────┘  │          │
└──────────────┴──────────────────────────────────────────────────┴──────────┘
</div>

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🎯 **One-Click Exploits** | Pre-configured exploit modules ready to use |
| 🖥️ **Terminal Output** | Real-time command output display |
| 📋 **Command History** | Track all executed commands |
| 🔌 **Quick Commands** | Common scans at your fingertips |
| 💻 **Custom Commands** | Run any msfconsole command manually |
| 🎨 **Hacker Theme** | Professional dark theme terminal UI |
| ⚡ **Fast Response** | Simulated mode for demos + real msf integration |

---

## 🚀 Quick Start

### Prerequisites

```bash
# Kali Linux or Ubuntu (Recommended)
sudo apt update
sudo apt install python3 python3-pip metasploit-framework

# For other Linux distributions
pip3 install flask
```

### Installation (5 minutes)

```bash
# Clone the repository
git clone https://github.com/yourusername/metasploit-web-ui.git
cd metasploit-web-ui

# Install dependencies
pip3 install -r requirements.txt

# Run the application
python3 app.py
```

### Access the UI

Open your browser and navigate to:
```
http://localhost:5000
```

---

## 📁 Project Structure

```
metasploit-web-ui/
│
├── app.py                 # Flask backend server
├── requirements.txt       # Python dependencies
├── README.md             # This file
│
├── templates/
│   └── index.html        # Main UI page
│
├── static/
│   ├── style.css         # Terminal theme styling
│   └── script.js         # Frontend JavaScript
│
└── logs/
    └── commands.log      # Command history (auto-generated)
```

---

## 🎮 Usage Guide

### 1. Quick Commands (No typing needed)

| Button | Function |
|--------|----------|
| 🔍 Quick Scan | `db_nmap -sV --top-ports 100 <target>` |
| 📡 Full Port Scan | `db_nmap -sV -p- <target>` |
| 💻 Show Sessions | `sessions -l` |
| 🖥️ Show Hosts | `hosts` |
| 🔌 Show Services | `services` |

### 2. Exploit Modules

| Exploit | Target | CVSS |
|---------|--------|------|
| VSFTPD 2.3.4 Backdoor | Port 21 (FTP) | 10.0 Critical |
| EternalBlue (MS17-010) | Port 445 (SMB) | 9.3 Critical |
| Telnet Login Scanner | Port 23 (Telnet) | 7.5 High |
| SSH Version Scanner | Port 22 (SSH) | 5.0 Medium |

### 3. Custom Commands

Type any Metasploit command manually:
```
nmap -sV 10.0.2.4
use auxiliary/scanner/portscan/tcp
set RHOSTS 10.0.2.0/24
run
```

---

## 🧪 Demo Mode

If you don't have a lab environment, enable demo mode for presentations:

```javascript
// In browser console
enableDemoMode()
```

Demo mode provides simulated responses for:
- Scanning commands
- Exploit execution
- Session management

---

## 🔧 Configuration

### Real Metasploit Integration

To connect with actual Metasploit:

```python
# In app.py, modify run_msf_command() function:

def run_msf_command(command):
    """Execute real Metasploit commands"""
    try:
        result = subprocess.run(
            ['msfconsole', '-q', '-x', command],
            capture_output=True,
            text=True,
            timeout=30
        )
        return result.stdout if result.stdout else result.stderr
    except subprocess.TimeoutExpired:
        return "[-] Command timeout"
    except Exception as e:
        return f"[-] Error: {str(e)}"
```

### Target IP Configuration

Update the default target in `script.js`:
```javascript
const DEFAULT_TARGET = '10.0.2.4';  // Change to your target IP
```

---

## 🖥️ Lab Setup Requirements

| Component | Specification |
|-----------|---------------|
| **Attacker** | Kali Linux / Ubuntu 20.04+ |
| **Target** | Metasploitable 2 / Windows 7 |
| **RAM** | 4GB minimum (8GB recommended) |
| **Network** | VirtualBox Host-Only (Isolated) |
| **Python** | 3.8 or higher |

---

## 📊 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/` | GET | Main UI page |
| `/api/run_command` | POST | Execute exploit or scan |
| `/api/quick_command` | POST | Run quick commands |

### API Example

```bash
# Run a quick scan
curl -X POST http://localhost:5000/api/run_command \
  -H "Content-Type: application/json" \
  -d '{"type": "scan_quick", "target": "10.0.2.4"}'

# Run an exploit
curl -X POST http://localhost:5000/api/run_command \
  -H "Content-Type: application/json" \
  -d '{"type": "exploit", "exploit_id": "vsftpd", "target": "10.0.2.4"}'
```

---

## 🛡️ Legal Disclaimer

> **IMPORTANT:** This tool is for **educational purposes only**. Only use on systems you own or have explicit permission to test. Unauthorized access to computer systems is illegal. The authors assume no liability for misuse.

---


## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

