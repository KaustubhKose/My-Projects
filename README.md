# Unauthorized System Access Investigation

Interactive case study, access-trace exercise, investigation checklist and report builder (HTML + CSS + JavaScript, no dependencies).

## Tabs
- **Case file**: the intrusion scenario and case details.
- **Access traces**: a mixed set of real log lines from firewall, auth, endpoint and file-access logs. Mark which ones are genuine evidence of the intrusion; click a line after answering to see why it matters.
- **Investigation checklist**: six-phase investigation plan (detection, containment, evidence collection, timeline reconstruction, root cause, reporting) with progress tracking saved in your browser.
- **Report builder**: editable fields plus the traces you confirmed and your checklist progress, compiled into a downloadable .txt report.

## Run in Visual Studio Code
1. Install VS Code from https://code.visualstudio.com
2. File > Open Folder... and choose this folder.
3. Install the "Live Server" extension (Ritwick Dey) from the Extensions tab.
4. Right-click index.html > Open with Live Server. The page opens at http://127.0.0.1:5500.

## Run without any extension
- Double-click index.html, or
- In a terminal: `python -m http.server 8000` then open http://localhost:8000

## Run in full Visual Studio
File > Open > Folder, right-click index.html > View in Browser.

## Files
- index.html: page structure
- style.css: styling
- script.js: case data, log lines, checklist, report builder logic
