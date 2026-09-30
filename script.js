const CASE = {
  id: 'IR-2026-0447',
  system: 'Finance file server (FS-PROD-02), Windows Server 2019',
  reported: 'Night-shift analyst noticed a login alert outside business hours',
  severity: 'High',
  summary: 'At 02:14 an account belonging to a contractor who left the company three weeks earlier was used to log into FS-PROD-02 from an unfamiliar external IP address. Within the hour, several sensitive finance folders were accessed and a new local administrator account was created.'
};

// Mixed log lines: t=time, src=source, msg=text, sus=is this a genuine trace of the intrusion, why=explanation
const LOG = [
 {t:'01:58:02', src:'firewall', msg:'ALLOW TCP 203.0.113.55:51322 -> 10.20.4.12:3389 (RDP)', sus:1, why:'External IP opens an RDP session to the server just before the suspicious login — the likely entry vector.'},
 {t:'02:00:15', src:'auth.log', msg:'Successful logon: user=j.alvarez, logon_type=10 (RemoteInteractive), source=203.0.113.55', sus:1, why:'j.alvarez left the company three weeks ago; this account should not exist or authenticate.'},
 {t:'02:01:47', src:'auth.log', msg:'Successful logon: user=SYSTEM, logon_type=5 (Service)', sus:0, why:'Routine service logon, expected on this schedule.'},
 {t:'02:03:10', src:'endpoint', msg:'Process created: whoami.exe, parent=cmd.exe, user=j.alvarez', sus:1, why:'Reconnaissance command typical of an attacker orienting themselves after gaining access.'},
 {t:'02:05:33', src:'endpoint', msg:'Process created: net.exe user /add temp_svc P@ssw0rd123, user=j.alvarez', sus:1, why:'Creation of a new local account is a classic persistence step.'},
 {t:'02:05:40', src:'endpoint', msg:'Process created: net.exe localgroup administrators temp_svc /add, user=j.alvarez', sus:1, why:'Privilege escalation — the new account is added to local administrators.'},
 {t:'02:07:02', src:'app.log', msg:'Scheduled backup job BK-014 completed normally', sus:0, why:'Unrelated scheduled task, timing is coincidental.'},
 {t:'02:11:58', src:'file-access', msg:'Read: \\\\FS-PROD-02\\Finance\\Payroll\\2026_Q3_salaries.xlsx, user=j.alvarez', sus:1, why:'Access to sensitive payroll data by an account that should be disabled.'},
 {t:'02:14:20', src:'file-access', msg:'Read: \\\\FS-PROD-02\\Finance\\M&A\\draft_termsheet.docx, user=j.alvarez', sus:1, why:'Access to confidential deal documents outside the account holder\u2019s former role.'},
 {t:'02:16:41', src:'endpoint', msg:'Archive created: C:\\Users\\Public\\backup_0214.zip (3 files)', sus:1, why:'Staging stolen files into an archive is a common step before exfiltration.'},
 {t:'02:19:03', src:'firewall', msg:'ALLOW TCP 10.20.4.12:443 -> 198.51.100.9:443 (HTTPS, 42MB)', sus:1, why:'A 42MB outbound transfer to an unfamiliar external address right after the archive was created — likely exfiltration.'},
 {t:'02:22:55', src:'auth.log', msg:'Successful logon: user=svc-backup, logon_type=5 (Service)', sus:0, why:'Expected service account activity.'},
 {t:'02:31:08', src:'endpoint', msg:'Event log cleared: Security log, user=temp_svc', sus:1, why:'Clearing the security log is an anti-forensic step to hide the earlier activity.'},
 {t:'06:45:00', src:'auth.log', msg:'Failed logon: user=admin, reason=bad password, source=192.168.1.4', sus:0, why:'A normal internal mistyped-password event, unrelated to the intrusion.'}
];

const PHASES = [
 {id:'p1', name:'Detection and initial triage', c:'#4c8dff', goal:'Confirm the alert is real and worth a full investigation.',
  role:'On-call analyst', time:'First 30 minutes', out:'Incident ticket, initial severity rating',
  items:[['Validate the alert against the source logs before acting',1],
  ['Record who reported it, when, and the exact alert or indicator',0],
  ['Assign a case ID and open an incident ticket',0],
  ['Set initial severity based on system criticality and suspected access level',1],
  ['Notify the incident response lead and stakeholders per the IR plan',0]]},
 {id:'p2', name:'Scope and containment', c:'#e8a33d', goal:'Stop further damage without destroying evidence.',
  role:'IR lead', time:'Within 1 to 2 hours', out:'List of affected systems and accounts, containment log',
  items:[['Identify every account, host and network segment potentially involved',1],
  ['Disable or reset compromised accounts rather than deleting them',1],
  ['Isolate affected hosts from the network while preserving memory and disk state',1],
  ['Block indicators of compromise (IPs, domains, hashes) at the firewall',0],
  ['Document every containment action taken and why, with timestamps',0]]},
 {id:'p3', name:'Evidence and log collection', c:'#3fb897', goal:'Gather every source that could hold a trace of the access.',
  role:'Forensic analyst', time:'Parallel with containment', out:'Preserved logs, disk and memory images',
  items:[['Collect authentication logs from all relevant systems and identity providers',1],
  ['Collect firewall, VPN and proxy logs covering the suspected window',0],
  ['Collect endpoint logs: process creation, scheduled tasks, new accounts',1],
  ['Image affected disks and capture memory before any further changes',1],
  ['Hash all collected evidence and record chain of custody',1],
  ['Pull application and file-access logs for any data touched',0]]},
 {id:'p4', name:'Timeline reconstruction and trace analysis', c:'#e2544a', goal:'Turn scattered log lines into one ordered story of the intrusion.',
  role:'Forensic analyst', time:'Main analysis phase', out:'Event timeline, list of confirmed indicators',
  items:[['Sort all confirmed events chronologically across every log source',1],
  ['Identify the initial access vector (how they got in)',1],
  ['Identify persistence and privilege escalation steps',1],
  ['Identify what data or systems were accessed or modified',0],
  ['Identify signs of anti-forensic activity, such as cleared logs',1],
  ['Cross-check timestamps against time zone and clock drift',0]]},
 {id:'p5', name:'Root cause and impact assessment', c:'#a06cd5', goal:'Explain why this was possible and what it actually cost.',
  role:'IR lead and analyst', time:'After timeline is stable', out:'Root cause statement, impact summary',
  items:[['Determine why the compromised account still worked (offboarding gap, leaked credential, etc.)',1],
  ['Assess what data was viewed, copied or exfiltrated',1],
  ['Assess business, legal and regulatory impact',0],
  ['Check whether other systems share the same weakness',0],
  ['Confirm attribution only as far as the evidence supports',0]]},
 {id:'p6', name:'Reporting and remediation', c:'#8fa0b8', goal:'Leave the organization with a clear record and a fix.',
  role:'IR lead', time:'Closing the case', out:'Final investigation report, remediation plan',
  items:[['Write the report for a reader who was not on the call: plain findings, not raw logs',1],
  ['Separate confirmed facts from working theories in the report',1],
  ['List concrete remediation steps with owners and deadlines',0],
  ['Fix the root cause, not only the symptom',1],
  ['Hold a lessons-learned review and update detection rules and offboarding process',0],
  ['Archive evidence per retention policy and close the ticket',0]]}
];

const KEY = 'access-invest-state-v1';
let state = {};
try { state = JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) {}
const save = () => { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) {} };
const $ = s => document.querySelector(s);
const done = p => p.items.filter((_, i) => state['chk_' + p.id + i]).length;
const totalItems = () => PHASES.reduce((n, p) => n + p.items.length, 0);
const doneItems = () => PHASES.reduce((n, p) => n + done(p), 0);
const pct = (a, b) => b ? Math.round(a / b * 100) : 0;
let tab = 'case';

function caseView() {
  return `<div class="case-grid">
  <section class="card"><h2>Scenario</h2><p>${CASE.summary}</p>
  <p style="color:var(--muted);font-size:.9rem">Use the Access traces tab to mark which log lines are genuine evidence, then work through the Investigation checklist and export a report in the Report builder tab.</p></section>
  <section class="card"><h2>Case details</h2><dl>
  <dt>Case ID</dt><dd class="mono">${CASE.id}</dd>
  <dt>System</dt><dd>${CASE.system}</dd>
  <dt>Reported</dt><dd>${CASE.reported}</dd>
  <dt>Severity</dt><dd><span class="sev high">${CASE.severity}</span></dd>
  </dl></section></div>`;
}

function tracesView() {
  const marked = LOG.map((_, i) => state['trace' + i] !== undefined);
  const correct = LOG.filter((l, i) => state['trace' + i] === !!l.sus).length;
  const answered = marked.filter(Boolean).length;
  let h = `<div class="score"><strong>${correct} of ${LOG.length} correctly identified</strong><div class="bar"><i style="width:${pct(correct, LOG.length)}%"></i></div>
  <button class="btn" id="reveal-all">Reveal all</button></div>
  <p style="color:var(--muted);font-size:.9rem;margin-top:-6px">Tick the log lines you believe are genuine traces of the intrusion. Click a line to see why it matters once you've answered.</p>
  <div class="log">`;
  LOG.forEach((l, i) => {
    const marked_i = state['trace' + i] !== undefined;
    const checked = state['trace' + i] === true;
    const cls = ['logline'];
    if (checked) cls.push('flag');
    if (marked_i && (checked === !!l.sus)) cls.push('correct');
    h += `<label class="${cls.join(' ')}" data-i="${i}">
    <input type="checkbox" data-trace="${i}" ${checked ? 'checked' : ''}>
    <span class="t">${l.t}</span><span><b>[${l.src}]</b> ${l.msg}
    <div class="reveal ${marked_i ? 'on' : ''}" data-why="${i}">${marked_i ? (l.sus ? '&#10003; Genuine trace &mdash; ' : '&#8226; Not part of the intrusion &mdash; ') + l.why : ''}</div>
    </span></label>`;
  });
  return h + '</div>';
}

function checklistView() {
  const o = pct(doneItems(), totalItems());
  let h = `<div class="overall"><strong id="ov">${o}% complete</strong><div class="bar"><i id="ovb" style="width:${o}%"></i></div></div>
  <div class="actions"><button class="btn" id="rst">Reset checklist</button></div>`;
  PHASES.forEach(p => {
    const d = done(p), n = p.items.length;
    h += `<section class="phase" style="--c:${p.c}"><h2>${p.name}</h2><p class="goal">${p.goal} <b id="c-${p.id}">${d}/${n}</b></p>
    <div class="bar"><i id="b-${p.id}" style="width:${pct(d, n)}%"></i></div>`;
    p.items.forEach((it, i) => {
      const k = 'chk_' + p.id + i;
      h += `<label class="item ${state[k] ? 'done' : ''}"><input type="checkbox" data-k="${k}" ${state[k] ? 'checked' : ''}><span>${it[0]}${it[1] ? '<b class="crit">critical</b>' : ''}</span></label>`;
    });
    h += '</section>';
  });
  return h;
}

const FIELD_DEFS = [
  ['f_id', 'Case ID', CASE.id],
  ['f_by', 'Prepared by', ''],
  ['f_vector', 'Initial access vector', 'RDP session from an external IP using a contractor account that should have been disabled at offboarding'],
  ['f_impact', 'Impact', 'Payroll and M&A documents accessed; approximately 42MB transferred to an external address; new administrator account created'],
  ['f_cause', 'Root cause', 'Offboarding process did not disable the contractor account; no restriction on external RDP to the account'],
  ['f_reco', 'Recommendations', 'Disable accounts on offboarding same day; remove direct external RDP; require MFA; alert on new local administrator accounts']
];

function reportView() {
  let h = '<div class="two"><section class="card"><h2>Report fields</h2>';
  FIELD_DEFS.forEach(([k, label, ph]) => {
    const v = state[k] !== undefined ? state[k] : ph;
    h += `<div class="field"><label>${label}</label><textarea data-f="${k}" rows="${k === 'f_by' || k === 'f_id' ? 1 : 3}">${v}</textarea></div>`;
  });
  h += `</section><section class="card"><h2>Generated report</h2><div class="actions"><button class="btn" id="dl">Download .txt</button></div>
  <div class="report-pre" id="report-out">${buildReport()}</div></section></div>`;
  return h;
}

function buildReport() {
  const get = k => { const def = FIELD_DEFS.find(f => f[0] === k); return state[k] !== undefined ? state[k] : (def ? def[2] : ''); };
  const confirmedTraces = LOG.filter((l, i) => state['trace' + i] === true && l.sus);
  const o = pct(doneItems(), totalItems());
  let t = 'UNAUTHORIZED SYSTEM ACCESS \u2014 INVESTIGATION REPORT\n';
  t += 'Case ID: ' + get('f_id') + '\nPrepared by: ' + (get('f_by') || '[name]') + '\nGenerated: ' + new Date().toLocaleString() + '\n';
  t += 'Checklist completion at time of export: ' + o + '%\n\n';
  t += 'SYSTEM: ' + CASE.system + '\nSEVERITY: ' + CASE.severity + '\n\nSUMMARY\n' + CASE.summary + '\n\n';
  t += 'INITIAL ACCESS VECTOR\n' + get('f_vector') + '\n\n';
  t += 'CONFIRMED TIMELINE (from access trace review)\n';
  if (confirmedTraces.length) {
    confirmedTraces.forEach(l => t += l.t + '  [' + l.src + ']  ' + l.msg + '\n');
  } else {
    t += '(No traces marked yet \u2014 complete the Access traces tab first.)\n';
  }
  t += '\nIMPACT\n' + get('f_impact') + '\n\nROOT CAUSE\n' + get('f_cause') + '\n\nRECOMMENDATIONS\n' + get('f_reco') + '\n\n';
  t += 'INVESTIGATION CHECKLIST STATUS\n';
  PHASES.forEach(p => {
    t += '- ' + p.name + ': ' + done(p) + '/' + p.items.length + '\n';
  });
  return t;
}

function render() {
  $('#view').innerHTML = tab === 'case' ? caseView() : tab === 'traces' ? tracesView() : tab === 'checklist' ? checklistView() : reportView();
  document.querySelectorAll('#tabs button').forEach(b => b.classList.toggle('on', b.dataset.tab === tab));
}

$('#tabs').onclick = e => { if (e.target.dataset.tab) { tab = e.target.dataset.tab; render(); } };

$('#view').addEventListener('click', e => {
  if (e.target.id === 'rst' && confirm('Clear checklist progress?')) {
    Object.keys(state).forEach(k => { if (k.startsWith('chk_')) delete state[k]; });
    save(); render(); return;
  }
  if (e.target.id === 'reveal-all') {
    LOG.forEach((l, i) => { if (state['trace' + i] === undefined) state['trace' + i] = !!l.sus; });
    save(); render(); return;
  }
  if (e.target.id === 'dl') {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([buildReport()], {type: 'text/plain'}));
    a.download = 'investigation-report.txt'; a.click();
    return;
  }
  const line = e.target.closest('.logline');
  if (line && e.target.type !== 'checkbox') {
    const i = line.dataset.i;
    if (state['trace' + i] !== undefined) {
      const rev = line.querySelector('.reveal'); if (rev) rev.classList.toggle('on');
    }
  }
});

$('#view').addEventListener('change', e => {
  if (e.target.dataset.trace !== undefined) {
    state['trace' + e.target.dataset.trace] = e.target.checked; save(); render(); return;
  }
  if (e.target.dataset.k) {
    const k = e.target.dataset.k; state[k] = e.target.checked; save();
    e.target.closest('.item').classList.toggle('done', e.target.checked);
    const pid = k.replace('chk_', '').slice(0, 2);
    const p = PHASES.find(x => x.id === pid);
    const d = done(p), o = pct(doneItems(), totalItems());
    $('#c-' + p.id).textContent = d + '/' + p.items.length;
    $('#b-' + p.id).style.width = pct(d, p.items.length) + '%';
    $('#ov').textContent = o + '% complete'; $('#ovb').style.width = o + '%';
    return;
  }
  if (e.target.dataset.f) {
    state[e.target.dataset.f] = e.target.value; save();
    const out = $('#report-out'); if (out) out.textContent = buildReport();
  }
});

render();
