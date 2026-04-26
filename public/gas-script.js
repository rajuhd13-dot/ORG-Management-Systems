/*************** CONFIG ***************/
const SPREADSHEET_ID = '1ZIVA2-Q3NGthLOWLyJ08DZQILTU4r2ENtxq0Hb5ogGY';
const SHEET_NAME = 'Examiner Information';

const ALLOW = {
  ENGLISH: 55,
  BANGLA: 48,
  PHYSICS: 48,
  CHEMISTRY: 48,
  MATH: 48,
  BIOLOGY: 48,
  ICT: 48
};

const BLANK_LABEL = '(Blank)';
const BLANK_KEY   = '__BLANK__';

const ALL_SUBJECT_KEYS = ['english','bangla','physics','chemistry','math','biology','ict'];

const COL = {
  SL:     0,
  NAME:   1,
  STATUS: 2,
  TPIN:   3,
  INST:   4,
  DEPT:   5,
  BATCH:  6,
  RM:     7,
  REMARKED_BY: 8,
  MOB1:   9,
  ALT:    10,

  EN:     61,
  BN:     64,
  PHY:    67,
  CHEM:   70,
  MATH:   73,
  BIO:    76,
  ICT:    79,

  TRAIN:            82,
  TRAIN_DATE:       83,
  FORM_CAMPUS:      84,
  ID_CHECKED:       85,
  ENTRY_BY:         86,
  FORM_FILLUP_DATE: 87,
  CAMPUS:           88
};

/*************** MEMORY CACHE ***************/
let MEM_STORE = {
  loadedAt:     0,
  dataTtlMs:    20000,   // 20s for row data
  optTtlMs:     60000,   // 60s for dropdown options
  lastRowCount: 0,
  header:       null,
  body:         null,
  options:      null,
  optLoadedAt:  0,
  instIdx:      null,
  deptIdx:      null,
  batchIdx:     null,
  trainIdx:     null,
  campusIdx:    null,
  tpinIdx:      null
};

/*************** WEB ***************/
function doGet(e) {
  // If a request provides an action, serve it as JSON
  if (e && e.parameter && e.parameter.action) {
    if (e.parameter.action === 'getOptions') {
      return ContentService.createTextOutput(JSON.stringify(getFilterOptionsFast()))
        .setMimeType(ContentService.MimeType.JSON);
    }
  }

  // Otherwise, fallback to the HTML UI
  return HtmlService.createHtmlOutputFromFile('Index')
    .setTitle('Examiner Filter')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

function doPost(e) {
  let result = { success: false, error: 'Unknown request' };
  
  try {
    const payload = JSON.parse(e.postData.contents);
    const action = payload.action;
    
    if (action === 'getOptions') {
      result = getFilterOptionsFast();
    } else if (action === 'getFilteredDataFast') {
      result = getFilteredDataFast(payload.filters, payload.page, payload.pageSize);
    } else if (action === 'clearCache') {
      result = clearFastCache();
    } else if (action === 'sync') {
      result = handleSyncAction();
    } else if (action === 'search') {
      result = handleSearchAction(payload.q);
    } else if (action === 'update') {
      result = handleUpdateAction(payload.tpin, payload.searchKey, payload.updates);
    } else if (action === 'getUsers') {
      result = handleGetUsers();
    } else if (action === 'saveUsers') {
      result = handleSaveUsers(payload.users);
    } else {
      result.error = 'Invalid action: ' + action;
    }
  } catch (error) {
    result.error = "API Error: " + error.message;
  }
  
  return ContentService.createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}

/*************** USERS STORE ***************/
const USERS_SHEET_NAME = 'Admin';

function handleGetUsers() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  let sh = ss.getSheetByName(USERS_SHEET_NAME);
  if (!sh) {
    sh = ss.insertSheet(USERS_SHEET_NAME);
    const headerRange = sh.getRange(1, 1, 1, 7);
    headerRange.setValues([['ID', 'Name', 'Email', 'Password', 'Role', 'Status', 'Permissions']]);
    headerRange.setFontWeight('bold');
    headerRange.setBackground('#f3f3f3');
    return { ok: true, users: [] };
  }
  
  const data = sh.getDataRange().getValues();
  if (data.length < 2) return { ok: true, users: [] };
  
  const users = [];
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    users.push({
      id: String(row[0]),
      name: String(row[1]),
      email: String(row[2]),
      password: String(row[3]),
      role: String(row[4]),
      status: String(row[5]),
      permissions: row[6] ? JSON.parse(String(row[6])) : []
    });
  }
  return { ok: true, users };
}

function handleSaveUsers(users) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  let sh = ss.getSheetByName(USERS_SHEET_NAME);
  if (!sh) {
    sh = ss.insertSheet(USERS_SHEET_NAME);
  }
  
  // Ensure headers are present and styled properly
  const headerRange = sh.getRange(1, 1, 1, 7);
  headerRange.setValues([['ID', 'Name', 'Email', 'Password', 'Role', 'Status', 'Permissions']]);
  headerRange.setFontWeight('bold');
  headerRange.setBackground('#f3f3f3');
  
  if (sh.getLastRow() > 1) {
    sh.getRange(2, 1, sh.getLastRow() - 1, 7).clearContent();
  }
  
  if (!users || users.length === 0) return { ok: true };
  
  const rows = users.map(u => [
    u.id, 
    u.name, 
    u.email, 
    u.password, 
    u.role, 
    u.status, 
    JSON.stringify(u.permissions || [])
  ]);
  
  sh.getRange(2, 1, rows.length, 7).setValues(rows);
  return { ok: true };
}

// Ensure preflight CORS requests are handled successfully if needed
function doOptions(e) {
  return ContentService.createTextOutput("")
    .setMimeType(ContentService.MimeType.TEXT);
}


/*************** EXAMINER SEARCH ACTIONS ***************/
function handleSyncAction() {
  getSheetStore_();
  return { ok: true, data: MEM_STORE.body, header: MEM_STORE.header };
}

function handleSearchAction(query) {
  getSheetStore_();
  const q = String(query).trim().toLowerCase();
  if (!q) return { ok: false, message: 'Empty query' };
  
  const qNorm = cleanMobile_(q) || q;
  
  const found = MEM_STORE.body.find(row => {
    const tpin = String(row[COL.TPIN] || '').toLowerCase();
    const m1 = cleanMobile_(row[COL.MOB1]);
    const m2 = cleanMobile_(row[COL.ALT]);  // assuming COL.ALT is what they map to MOBILE_2 occasionally or not? Wait, ExaminerSearch maps MOBILE_1 to index 9, meaning col 10 in 1-based.
    // The ExaminerSearchForm uses `row[COL.MOBILE_1 - 1]` where MOBILE_1 is 10. `COL.MOB1` is 9 mapped to `10 - 1`. Correct.
    return tpin === q || m1 === qNorm || m2 === qNorm;
  });
  
  if (found) {
    return { ok: true, data: found };
  }
  return { ok: false, message: 'No examiner found with this T-PIN or Mobile.' };
}

const REACT_COL_MAP = {
  NICK_NAME: 2, TPIN: 4, INST: 5, DEPT: 6, HSC_BATCH: 7, RM: 8,
  MOBILE_1: 10, MOBILE_2: 11, MOBILE_BANKING: 12,
  RUNNING_PROGRAM: 16, PREVIOUS_PROGRAM: 17,
  EMAIL: 22, TEAMS_ID: 23,
  HSC_ROLL: 28, HSC_REG: 29, HSC_BOARD: 30, HSC_GPA: 31,
  SUBJECT_1: 34, SUBJECT_2: 35, SUBJECT_3: 36, SUBJECT_4: 37, SUBJECT_5: 38,
  VERSION_INTERESTED: 39,
  FULL_NAME: 43, RELIGION: 45, GENDER: 46, DATE_OF_BIRTH: 47,
  FATHERS_NAME: 52, MOTHERS_NAME: 56, HOME_DISTRICT: 61,
  ENGLISH_PCT: 62, ENGLISH_SET: 63, ENGLISH_DATE: 64,
  BANGLA_PCT: 65, BANGLA_SET: 66, BANGLA_DATE: 67,
  PHYSICS_PCT: 68, PHYSICS_SET: 69, PHYSICS_DATE: 70,
  CHEMISTRY_PCT: 71, CHEMISTRY_SET: 72, CHEMISTRY_DATE: 73,
  MATH_PCT: 74, MATH_SET: 75, MATH_DATE: 76,
  BIOLOGY_PCT: 77, BIOLOGY_SET: 78, BIOLOGY_DATE: 79,
  ICT_PCT: 80, ICT_SET: 81, ICT_DATE: 82,
  TRAINING_REPORT: 83, TRAINING_DATE: 84,
  ID_CHECKED: 86, FORM_FILL_DATE: 88, PHYSICAL_CAMPUS_PREF: 89,
  SELECTED_SUBJECT: 92,
  REMARK_COMMENT: 93,
  REMARK_COUNT: 94, REMARK_TEXT: 94, REMARK_BY: 95, REMARK_DATE: 96
};

function handleUpdateAction(tpin, searchKey, updates) {
  const sh = openSheetStrict_();
  const data = sh.getDataRange().getValues();
  if (data.length < 2) return { ok: false, message: 'Sheet is empty' };
  
  const qNorm = cleanMobile_(String(searchKey || '').toLowerCase()) || String(searchKey || '').toLowerCase();
  
  let targetRowIdx = -1;
  // Start from 1 to skip header
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    const rTpin = String(row[COL.TPIN] || '').toLowerCase();
    const m1 = cleanMobile_(row[COL.MOB1]);
    const m2 = cleanMobile_(row[COL.ALT]);
    
    if (rTpin === qNorm || m1 === qNorm || m2 === qNorm) {
      targetRowIdx = i;
      break;
    }
  }
  
  if (targetRowIdx === -1) {
    return { ok: false, message: 'Record not found' };
  }
  
  // Apply updates
  let updateCount = 0;
  for (const [key, value] of Object.entries(updates)) {
    const colNumber = REACT_COL_MAP[key]; // 1-based
    if (colNumber) {
      // sh.getRange is 1-based for both row and col
      sh.getRange(targetRowIdx + 1, colNumber).setValue(value);
      updateCount++;
    }
  }
  
  clearFastCache(); // Invalidate cache so sync returns fresh data
  
  return { ok: true, message: `Updated ${updateCount} fields successfully.` };
}

/*************** HELPERS ***************/
function normalize(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/[\u200B-\u200D\uFEFF]/g, '')
    .trim()
    .replace(/\s+/g, ' ')
    .toLowerCase();
}

function isBlankish_(v) {
  if (v === null || v === undefined) return true;
  const s = String(v).replace(/[\u200B-\u200D\uFEFF]/g, '').trim();
  return s === '';
}

function openSheetStrict_() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sh = ss.getSheetByName(SHEET_NAME);
  if (!sh) {
    const names = ss.getSheets().map(s => s.getName()).join(' | ');
    throw new Error(`Sheet "${SHEET_NAME}" not found. Available: ${names}`);
  }
  return sh;
}

function toNum_(v) {
  let s = String(v ?? '').trim();
  s = s.replace(/%/g, '');
  if (!s) return NaN;
  const n = Number(s);
  return Number.isFinite(n) ? n : NaN;
}

function cleanMobile_(v) {
  let m = String(v ?? '').trim().replace(/\D/g, '');
  if (m.length === 10) m = '0' + m;
  if (m.length === 11 && !m.startsWith('0')) m = '0' + m.slice(-10);
  return m;
}

function subjectThresholdDynamic_(k, allowEnglish, allowOthers) {
  const en  = Number.isFinite(allowEnglish) ? allowEnglish : null;
  const oth = Number.isFinite(allowOthers)  ? allowOthers  : null;
  if (k === 'english') return en !== null ? en : ALLOW.ENGLISH;
  if (['bangla','physics','chemistry','math','biology','ict'].includes(k)) {
    if (oth !== null) return oth;
    switch (k) {
      case 'bangla':    return ALLOW.BANGLA;
      case 'physics':   return ALLOW.PHYSICS;
      case 'chemistry': return ALLOW.CHEMISTRY;
      case 'math':      return ALLOW.MATH;
      case 'biology':   return ALLOW.BIOLOGY;
      case 'ict':       return ALLOW.ICT;
    }
  }
  return null;
}

function subjectValue_(r, k) {
  switch (k) {
    case 'english':   return toNum_(r[COL.EN]);
    case 'bangla':    return toNum_(r[COL.BN]);
    case 'physics':   return toNum_(r[COL.PHY]);
    case 'chemistry': return toNum_(r[COL.CHEM]);
    case 'math':      return toNum_(r[COL.MATH]);
    case 'biology':   return toNum_(r[COL.BIO]);
    case 'ict':       return toNum_(r[COL.ICT]);
    default:          return NaN;
  }
}

function isAllowedBySubjectsDynamic_(r, subjectsSelected, subjectLogic, allowEnglish, allowOthers) {
  let keys = Array.isArray(subjectsSelected) ? subjectsSelected.filter(Boolean) : [];
  if (keys.length === 0) keys = ALL_SUBJECT_KEYS;
  const mode = (subjectLogic === 'all') ? 'all' : 'any';
  if (mode === 'all') {
    for (let i = 0; i < keys.length; i++) {
      const k  = keys[i];
      const th = subjectThresholdDynamic_(k, allowEnglish, allowOthers);
      const v  = subjectValue_(r, k);
      if (!Number.isFinite(v) || !Number.isFinite(th) || v < th) return false;
    }
    return true;
  }
  for (let i = 0; i < keys.length; i++) {
    const k  = keys[i];
    const th = subjectThresholdDynamic_(k, allowEnglish, allowOthers);
    const v  = subjectValue_(r, k);
    if (!Number.isFinite(v) || !Number.isFinite(th)) continue;
    if (v >= th) return true;
  }
  return false;
}

/*************** INDEX BUILDER ***************/
function buildIndexes_(body) {
  const instIdx   = new Map();
  const deptIdx   = new Map();
  const batchIdx  = new Map();
  const trainIdx  = new Map();
  const campusIdx = new Map();
  const tpinIdx   = new Map();

  function addIdx(map, key, i) {
    if (!map.has(key)) map.set(key, []);
    map.get(key).push(i);
  }

  for (let i = 0; i < body.length; i++) {
    const r = body[i];
    const inst   = normalize(r[COL.INST]   ?? '');
    const dept   = normalize(r[COL.DEPT]   ?? '');
    const batch  = normalize(r[COL.BATCH]  ?? '');
    const train  = isBlankish_(r[COL.TRAIN]  ?? '') ? BLANK_KEY : normalize(r[COL.TRAIN]  ?? '');
    const campus = isBlankish_(r[COL.CAMPUS] ?? '') ? BLANK_KEY : normalize(r[COL.CAMPUS] ?? '');
    const tpin   = isBlankish_(r[COL.TPIN]   ?? '') ? BLANK_KEY : normalize(r[COL.TPIN]   ?? '');

    if (inst)  addIdx(instIdx,  inst,  i);
    if (dept)  addIdx(deptIdx,  dept,  i);
    if (batch) addIdx(batchIdx, batch, i);
    addIdx(trainIdx,  train,  i);
    addIdx(campusIdx, campus, i);
    addIdx(tpinIdx,   tpin,   i);
  }

  return { instIdx, deptIdx, batchIdx, trainIdx, campusIdx, tpinIdx };
}

/*************** RESULT COLUMNS ***************/
function buildKeepColsAndHeader_(subjectKeys) {
  const keepCols = [COL.SL, COL.NAME, COL.TPIN, COL.INST, COL.DEPT, COL.BATCH, COL.RM, COL.MOB1, COL.ALT];
  const header   = ['SL', 'Nick Name', 'T-PIN', 'Inst.', 'Dept.', 'HSC Batch', 'Rm', 'Mobile Number', 'Alternate'];

  const SUBJECT_MAP = {
    english:   { col: COL.EN,   label: 'English(%)'   },
    bangla:    { col: COL.BN,   label: 'Bangla(%)'    },
    physics:   { col: COL.PHY,  label: 'Physics(%)'   },
    chemistry: { col: COL.CHEM, label: 'Chemistry(%)'  },
    math:      { col: COL.MATH, label: 'Math(%)'      },
    biology:   { col: COL.BIO,  label: 'Biology(%)'   },
    ict:       { col: COL.ICT,  label: 'ICT(%)'       }
  };

  for (let i = 0; i < subjectKeys.length; i++) {
    const map = SUBJECT_MAP[subjectKeys[i]];
    if (map) { keepCols.push(map.col); header.push(map.label); }
  }

  keepCols.push(COL.TRAIN, COL.CAMPUS, -1);
  header.push('Training Report', 'Physical Campus', 'Allow Status');
  return { keepCols, header };
}

/*************** SHEET STORE — SMART CACHE ***************/
function getSheetStore_() {
  const now = Date.now();
  const sh  = openSheetStrict_();
  const currentRowCount = sh.getLastRow();

  const cacheValid =
    MEM_STORE.body &&
    MEM_STORE.header &&
    (now - MEM_STORE.loadedAt) < MEM_STORE.dataTtlMs &&
    MEM_STORE.lastRowCount === currentRowCount;

  if (cacheValid) {
    return { header: MEM_STORE.header, body: MEM_STORE.body };
  }

  const lastCol = sh.getLastColumn();

  if (currentRowCount < 2) {
    MEM_STORE = { ...MEM_STORE, header: [], body: [], options: null, optLoadedAt: 0, loadedAt: now, lastRowCount: currentRowCount, instIdx: null, deptIdx: null, batchIdx: null, trainIdx: null, campusIdx: null, tpinIdx: null };
    return { header: [], body: [] };
  }

  const values = sh.getRange(1, 1, currentRowCount, lastCol).getDisplayValues();
  const header = values[0];
  const body0  = values.slice(1);

  const body = new Array(body0.length);
  for (let i = 0; i < body0.length; i++) {
    const r = body0[i].slice();
    r[COL.MOB1] = cleanMobile_(r[COL.MOB1]);
    r[COL.ALT]  = cleanMobile_(r[COL.ALT]);
    body[i] = r;
  }

  const { instIdx, deptIdx, batchIdx, trainIdx, campusIdx, tpinIdx } = buildIndexes_(body);

  MEM_STORE.header       = header;
  MEM_STORE.body         = body;
  MEM_STORE.options      = null;
  MEM_STORE.optLoadedAt  = 0;
  MEM_STORE.loadedAt     = now;
  MEM_STORE.lastRowCount = currentRowCount;
  MEM_STORE.instIdx      = instIdx;
  MEM_STORE.deptIdx      = deptIdx;
  MEM_STORE.batchIdx     = batchIdx;
  MEM_STORE.trainIdx     = trainIdx;
  MEM_STORE.campusIdx    = campusIdx;
  MEM_STORE.tpinIdx      = tpinIdx;

  return { header, body };
}

/*************** OPTIONS ***************/
function getFilterOptionsFast() {
  try {
    const now = Date.now();
    if (MEM_STORE.options && (now - MEM_STORE.optLoadedAt) < MEM_STORE.optTtlMs) {
      return MEM_STORE.options;
    }

    const store = getSheetStore_();
    const body  = store.body;

    const institutes  = new Set();
    const departments = new Set();
    const batches     = new Set();
    const trainings   = new Set();
    const campuses    = new Set();
    const tpins       = new Set();

    for (let i = 0; i < body.length; i++) {
      const r    = body[i];
      const inst = String(r[COL.INST]   ?? '').trim();
      const dept = String(r[COL.DEPT]   ?? '').trim();
      const bat  = String(r[COL.BATCH]  ?? '').trim();
      const trn  = String(r[COL.TRAIN]  ?? '').trim();
      const cam  = String(r[COL.CAMPUS] ?? '').trim();
      const tpin = String(r[COL.TPIN]   ?? '').trim();

      if (inst) institutes.add(inst);
      if (dept) departments.add(dept);
      if (bat)  batches.add(bat);
      trainings.add(trn  ? trn  : BLANK_LABEL);
      campuses.add(cam   ? cam  : BLANK_LABEL);
      tpins.add(tpin     ? tpin : BLANK_LABEL);
    }

    const subjects = [
      { key: 'english',   label: 'English(%)'   },
      { key: 'bangla',    label: 'Bangla(%)'    },
      { key: 'physics',   label: 'Physics(%)'   },
      { key: 'chemistry', label: 'Chemistry(%)'  },
      { key: 'math',      label: 'Math(%)'      },
      { key: 'biology',   label: 'Biology(%)'   },
      { key: 'ict',       label: 'ICT(%)'       }
    ];

    const out = {
      success:     true,
      rowCount:    body.length,
      institutes:  [...institutes ].sort((a, b) => a.localeCompare(b, 'en-US')),
      departments: [...departments].sort((a, b) => a.localeCompare(b, 'en-US')),
      batches:     [...batches    ].sort((a, b) => a.localeCompare(b, 'en-US', { numeric: true })),
      trainings:   [...trainings  ].sort((a, b) => a.localeCompare(b, 'en-US', { numeric: true })),
      campuses:    [...campuses   ].sort((a, b) => a.localeCompare(b, 'en-US', { numeric: true })),
      tpins:       [...tpins      ].sort((a, b) => a.localeCompare(b, 'en-US', { numeric: true })),
      subjects,
      allow: ALLOW
    };

    MEM_STORE.options     = out;
    MEM_STORE.optLoadedAt = now;
    return out;
  } catch (e) {
    return { success: false, error: e.message };
  }
}

/*************** FILTER CORE ***************/
function buildNF_(filters) {
  return {
    institute:         (filters?.institute         || []).map(normalize).filter(Boolean),
    department:        (filters?.department        || []).map(normalize).filter(Boolean),
    batch:             (filters?.batch             || []).map(normalize).filter(Boolean),
    trainingsSelected: processMultiBlankAware_(filters?.trainingsSelected || []),
    campusesSelected:  processMultiBlankAware_(filters?.campusesSelected  || []),
    tpinsSelected:     processMultiBlankAware_(filters?.tpinsSelected     || []),
    subjectsSelected:  Array.isArray(filters?.subjectsSelected)
                         ? filters.subjectsSelected.map(s => String(s || '').toLowerCase()).filter(Boolean)
                         : [],
    onlyAllowed:  (filters?.onlyAllowed !== false),
    subjectLogic: (filters?.subjectLogic === 'all') ? 'all' : 'any'
  };
}

function processMultiBlankAware_(arr) {
  if (!Array.isArray(arr)) return [];
  return arr
    .map(x => {
      const s = String(x ?? '').trim();
      if (s === BLANK_KEY || s === BLANK_LABEL) return BLANK_KEY;
      const n = normalize(s);
      return n || null;
    })
    .filter(Boolean);
}

function filterCore_(filters, page, pageSize, returnAllRows) {
  const store = getSheetStore_();
  const body  = store.body;

  const allowEnglish = toNum_(filters?.allowEnglish);
  const allowOthers  = toNum_(filters?.allowOthers);
  const nf = buildNF_(filters);

  let subjectKeys = Array.isArray(nf.subjectsSelected) ? nf.subjectsSelected.filter(Boolean) : [];
  if (subjectKeys.length === 0) subjectKeys = ALL_SUBJECT_KEYS;

  const { keepCols, header: slimHeader } = buildKeepColsAndHeader_(subjectKeys);

  const ps         = pageSize || 200;
  const startIndex = Math.max(0, ((page || 1) - 1) * ps);
  const endIndex   = startIndex + ps;

  const candidateSet = getCandidateRows_(body, nf);

  const rows = [];
  let totalMatched = 0;

  const useAll = candidateSet === null;
  const iterSet = useAll ? null : candidateSet;

  function processRow(i) {
    const src = body[i];
    const ok = isAllowedBySubjectsDynamic_(src, nf.subjectsSelected, nf.subjectLogic, allowEnglish, allowOthers);
    if (nf.onlyAllowed && !ok) return;

    totalMatched++;

    if (returnAllRows || (totalMatched > startIndex && totalMatched <= endIndex)) {
      const row = new Array(keepCols.length);
      for (let j = 0; j < keepCols.length; j++) {
        const c = keepCols[j];
        row[j] = c === -1 ? (ok ? 'ALLOWED' : 'NOT ALLOWED') : (src[c] ?? '');
      }
      rows.push(row);
    }
  }

  if (useAll) {
    for (let i = 0; i < body.length; i++) processRow(i);
  } else {
    for (const i of iterSet) processRow(i);
  }

  return {
    success:    true,
    header:     slimHeader,
    rows,
    total:      totalMatched,
    page:       page || 1,
    pageSize:   ps,
    totalPages: Math.max(1, Math.ceil(totalMatched / ps)),
    allow: {
      ENGLISH: Number.isFinite(allowEnglish) ? allowEnglish : ALLOW.ENGLISH,
      OTHERS:  Number.isFinite(allowOthers)  ? allowOthers  : 48
    }
  };
}

function getCandidateRows_(body, nf) {
  const { instIdx, deptIdx, batchIdx, trainIdx, campusIdx, tpinIdx } = MEM_STORE;
  let candidates = null;

  function intersect(map, selectedArr) {
    if (!selectedArr || selectedArr.length === 0) return candidates;
    const unionSet = new Set();
    for (let i = 0; i < selectedArr.length; i++) {
      const key = selectedArr[i] === BLANK_KEY ? BLANK_KEY : normalize(selectedArr[i]);
      const rows = map ? map.get(key) : null;
      if (rows) { for (let j = 0; j < rows.length; j++) unionSet.add(rows[j]); }
    }
    if (candidates === null) return unionSet;
    const result = new Set();
    for (const idx of unionSet) { if (candidates.has(idx)) result.add(idx); }
    return result;
  }

  if (nf.institute.length  > 0 && instIdx)   candidates = intersect(instIdx,   nf.institute);
  if (nf.department.length > 0 && deptIdx)   candidates = intersect(deptIdx,   nf.department);
  if (nf.batch.length      > 0 && batchIdx)  candidates = intersect(batchIdx,  nf.batch);
  if (nf.trainingsSelected.length > 0 && trainIdx)  candidates = intersect(trainIdx,  nf.trainingsSelected);
  if (nf.campusesSelected.length  > 0 && campusIdx) candidates = intersect(campusIdx, nf.campusesSelected);
  if (nf.tpinsSelected.length     > 0 && tpinIdx)   candidates = intersect(tpinIdx,   nf.tpinsSelected);

  return candidates;
}

function getFilteredDataFast(filters, page, pageSize) {
  try {
    return filterCore_(filters, page || 1, pageSize || 200, false);
  } catch (e) {
    return { success: false, error: e.message };
  }
}
