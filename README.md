# ⚡ PROJECT NEON: Cyberpunk CTF Forensic Toolkit

![Project Banner](https://img.shields.io/badge/Cyberpunk-v1.0.0-f300ff?style=for-the-badge&logoColor=white) 
![License](https://img.shields.io/badge/License-ISC-blue?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-Live-green?style=for-the-badge)

A powerful, full-stack Capture The Flag (CTF) forensic toolkit designed for security enthusiasts and professionals. This toolkit integrates multiple industry-standard security tools into a sleek, futuristic Cyberpunk-themed dashboard.

## 🚀 Live Demo
- **Frontend**: https://full-stack-project-rho.vercel.app/
- **Backend API**: https://full-stack-project-6-noy7.onrender.com/

## 🛠️ Integrated Tools
| Category | Tools Included |
| :--- | :--- |
| **Steganography** | Steghide, Zsteg, Outguess, OpenStego |
| **Forensics** | ExifTool, Binwalk, Strings, FFMPEG |
| **Cracking** | Hashcat, John The Ripper |
| **Web Recon** | Gobuster, Robots.txt analyzer |
| **Misc** | Python & Ruby scripting support |

## 🏗️ Architecture
- **Frontend**: React.js + Vite (Tailwind / Custom CSS)
- **Backend**: Node.js + Express
- **Database**: SQLite (Audit logs & History)
- **Deployment**: Dockerized for seamless tool execution on Linux/Cloud

## 💻 Local Setup

### Prerequisites
- Node.js (v18+)
- Python 3.x
- Docker (Optional: for running tools in a Linux container)

### Installation
1. **Clone the repository**:
   ```bash
   git clone https://github.com/PANKAJ-Saini-Hck/FULL_STACK_PROJECT.git
   cd FULL_STACK_PROJECT
   ```

2. **Setup Backend**:
   ```bash
   cd backend
   npm install
   # Add your binaries to the /bin folder or install them in your PATH
   npm start
   ```

3. **Setup Frontend**:
   ```bash
   cd ../frontend
   npm install
   npm run dev
   ```

## 🐋 Docker Deployment
To run the entire suite with all tools pre-installed:
```bash
docker build -t ctf-toolkit ./backend
docker run -p 5000:5000 ctf-toolkit
```

## 📜 Legal Disclaimer
This tool is for educational purposes and authorized penetration testing only. Usage of this toolkit for attacking targets without prior mutual consent is illegal. It is the end user's responsibility to obey all applicable local, state, and federal laws.

---
**Developed with 💚 for the Cyber Security Community.**
