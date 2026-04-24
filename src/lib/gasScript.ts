export const GAS_CODE_V9_2 = `var CONFIG = {
  SPREADSHEET_ID:  '1vNiiWS6IKrpYcgleGMdCwJiS_Mn97G-U0hSuIbPorlQ',
  SHEET_NAME:      'Examiner Information',
  DATA_START_ROW:  2,
  TOTAL_COLS:      96
};

var COL = {
  NICK_NAME:2, TPIN:4, INST:5, DEPT:6, HSC_BATCH:7, RM:8,
  MOBILE_1:10, MOBILE_2:11, MOBILE_BANKING:12,
  RUNNING_PROGRAM:16, PREVIOUS_PROGRAM:17,
  EMAIL:22, TEAMS_ID:23,
  HSC_ROLL:28, HSC_REG:29, HSC_BOARD:30, HSC_GPA:31,
  SUBJECT_1:34, SUBJECT_2:35, SUBJECT_3:36, SUBJECT_4:37, SUBJECT_5:38,
  VERSION_INTERESTED:39,
  FULL_NAME:43, RELIGION:45, GENDER:46, DATE_OF_BIRTH:47,
  FATHERS_NAME:52, MOTHERS_NAME:56, HOME_DISTRICT:61,
  ENGLISH_PCT:62, ENGLISH_SET:63, ENGLISH_DATE:64,
  BANGLA_PCT:65, BANGLA_SET:66, BANGLA_DATE:67,
  PHYSICS_PCT:68, PHYSICS_SET:69, PHYSICS_DATE:70,
  CHEMISTRY_PCT:71, CHEMISTRY_SET:72, CHEMISTRY_DATE:73,
  MATH_PCT:74, MATH_SET:75, MATH_DATE:76,
  BIOLOGY_PCT:77, BIOLOGY_SET:78, BIOLOGY_DATE:79,
  ICT_PCT:80, ICT_SET:81, ICT_DATE:82,
  TRAINING_REPORT:83, TRAINING_DATE:84,
  ID_CHECKED:86, FORM_FILL_DATE:88, PHYSICAL_CAMPUS_PREF:89,
  SELECTED_SUBJECT:92,
  REMARK_COMMENT:93,
  REMARK_COUNT:94, REMARK_TEXT:94, REMARK_BY:95, REMARK_DATE:96
};

function doGet(e) {
  try {
    if (e && e.parameter && e.parameter.action === 'sync') {
      return ContentService.createTextOutput(JSON.stringify(syncAllData())).setMimeType(ContentService.MimeType.JSON);
    }
    if (e && e.parameter && e.parameter.q) {
      var result = searchExaminer(e.parameter.q);
      return ContentService.createTextOutput(JSON.stringify(result)).setMimeType(ContentService.MimeType.JSON);
    }
    return ContentService.createTextOutput(JSON.stringify({ ok: false, message: 'No query provided.' })).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ ok: false, message: 'Script Error: ' + err.message })).setMimeType(ContentService.MimeType.JSON);
  }
}

function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(30000);
    var params = JSON.parse(e.postData.contents);
    if (params.action === 'update') {
      return ContentService.createTextOutput(JSON.stringify(updateRow(params.searchKey || params.tpin, params.updates))).setMimeType(ContentService.MimeType.JSON);
    }
    return ContentService.createTextOutput(JSON.stringify({ ok: false, message: 'Invalid action' })).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ ok: false, message: 'Update Error: ' + err.message })).setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

function updateRow(searchKey, updates) {
  if (!searchKey) return { ok: false, message: 'TPIN or Mobile required to update' };
  
  var sheet = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID).getSheetByName(CONFIG.SHEET_NAME);
  var lastRow = sheet.getLastRow();
  var lastCol = sheet.getLastColumn();
  
  if (lastRow < CONFIG.DATA_START_ROW) return { ok: false, message: 'No data found in sheet' };
  
  var key = String(searchKey).trim();
  var tpinData = sheet.getRange(CONFIG.DATA_START_ROW, COL.TPIN, lastRow - CONFIG.DATA_START_ROW + 1, 1).getValues();
  var mob1Data = sheet.getRange(CONFIG.DATA_START_ROW, COL.MOBILE_1, lastRow - CONFIG.DATA_START_ROW + 1, 1).getValues();
  var mob2Data = sheet.getRange(CONFIG.DATA_START_ROW, COL.MOBILE_2, lastRow - CONFIG.DATA_START_ROW + 1, 1).getValues();
  
  var rowIdx = -1;
  for (var i = 0; i < tpinData.length; i++) {
    if (String(tpinData[i][0]).trim() === key || String(mob1Data[i][0]).trim() === key || String(mob2Data[i][0]).trim() === key) {
      rowIdx = i + CONFIG.DATA_START_ROW;
      break;
    }
  }
  
  if (rowIdx === -1) return { ok: false, message: 'Examiner with identifier ' + searchKey + ' not found' };
  
  var changed = false;
  for (var k in updates) {
    if (COL[k]) {
      var colNum = COL[k];
      sheet.getRange(rowIdx, colNum).setValue(updates[k]);
      changed = true;
    }
  }
  
  return { ok: true, message: 'Updated successfully' };
}

function syncAllData() {
  var sheet = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID).getSheetByName(CONFIG.SHEET_NAME);
  if (!sheet) throw new Error('Sheet not found');
  var lastRow = sheet.getLastRow();
  if (lastRow < CONFIG.DATA_START_ROW) return { ok: true, data: [] };
  var data = sheet.getRange(CONFIG.DATA_START_ROW, 1, lastRow - CONFIG.DATA_START_ROW + 1, CONFIG.TOTAL_COLS).getValues();
  var filtered = data.filter(function(row) {
    return row[COL.TPIN-1] || row[COL.MOBILE_1-1] || row[COL.MOBILE_2-1];
  });
  return { ok: true, data: filtered };
}

function norm_(v) {
  v = String(v || '').trim();
  if (!v) return '';
  var d = v.replace(/\\D/g, '');
  if (d) {
    if (d.length >= 12 && d.slice(0,3) === '880') return d;
    if (d[0] === '0' && d.length === 11) return '88' + d;
    if (d[0] === '1' && d.length === 10) return '880' + d;
    return d;
  }
  return v.toUpperCase();
}

function searchExaminer(query) {
  query = String(query || '').trim();
  if (!query) return { ok: false, message: 'Search value is empty.' };
  var key = norm_(query);
  if (!key) return { ok: false, message: 'Invalid search key.' };
  var sheet = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID).getSheetByName(CONFIG.SHEET_NAME);
  if (!sheet) throw new Error('Sheet not found: ' + CONFIG.SHEET_NAME);
  var searchValues = [query, key];
  if (key.startsWith('880') && key.length === 13) {
    searchValues.push(key.substring(2));
  }
  var foundRow = -1;
  for (var i = 0; i < searchValues.length; i++) {
    var val = searchValues[i];
    var finder = sheet.createTextFinder(val).matchEntireCell(false).findAll();
    for (var j = 0; j < finder.length; j++) {
      var cell = finder[j];
      var r = cell.getRow();
      var c = cell.getColumn();
      if (r >= CONFIG.DATA_START_ROW && (c === COL.TPIN || c === COL.MOBILE_1 || c === COL.MOBILE_2)) {
        var cellValue = norm_(cell.getDisplayValue());
        if (cellValue === key) { foundRow = r; break; }
      }
    }
    if (foundRow !== -1) break;
  }
  if (foundRow === -1) return { ok: false, message: 'No examiner found.' };
  var rowData = sheet.getRange(foundRow, 1, 1, CONFIG.TOTAL_COLS).getDisplayValues()[0];
  return { ok: true, data: mapRow_(rowData) };
}

function mapRow_(row) {
  var g = function(c) { return row[c - 1] || ''; };
  var rm = String(g(COL.RM)).trim();
  var rmNum = extractNum_(rm);
  var remarkRaw = String(g(COL.REMARK_COMMENT)).trim();
  var parsedRemark = parseRemarkCell_(remarkRaw, rmNum);
  return {
    quick: {
      tpin: g(COL.TPIN), rm: rm, nickName: g(COL.NICK_NAME),
      fullName: g(COL.FULL_NAME), mobile1: g(COL.MOBILE_1), mobile2: g(COL.MOBILE_2),
      nagadNumber: g(COL.MOBILE_BANKING), institute: g(COL.INST), department: g(COL.DEPT),
      hscGpa: g(COL.HSC_GPA), hscBatch: fmtBatch_(g(COL.HSC_BATCH)),
      trainingReport: g(COL.TRAINING_REPORT), trainingDate: g(COL.TRAINING_DATE),
      physicalCampus: g(COL.PHYSICAL_CAMPUS_PREF)
    },
    assessments: [
      mkAs_('English',   g(COL.ENGLISH_PCT),   g(COL.ENGLISH_SET),   g(COL.ENGLISH_DATE),   60),
      mkAs_('Bangla',    g(COL.BANGLA_PCT),     g(COL.BANGLA_SET),    g(COL.BANGLA_DATE),    50),
      mkAs_('Physics',   g(COL.PHYSICS_PCT),    g(COL.PHYSICS_SET),   g(COL.PHYSICS_DATE),   50),
      mkAs_('Chemistry', g(COL.CHEMISTRY_PCT),  g(COL.CHEMISTRY_SET), g(COL.CHEMISTRY_DATE), 50),
      mkAs_('Math',      g(COL.MATH_PCT),       g(COL.MATH_SET),      g(COL.MATH_DATE),      50),
      mkAs_('Biology',   g(COL.BIOLOGY_PCT),    g(COL.BIOLOGY_SET),   g(COL.BIOLOGY_DATE),   50),
      mkAs_('ICT',       g(COL.ICT_PCT),        g(COL.ICT_SET),       g(COL.ICT_DATE),       50)
    ],
    remark: parsedRemark,
    personal: {
      fathersName: g(COL.FATHERS_NAME), mothersName: g(COL.MOTHERS_NAME),
      religion: g(COL.RELIGION), gender: g(COL.GENDER), dateOfBirth: g(COL.DATE_OF_BIRTH),
      hscRoll: g(COL.HSC_ROLL), hscReg: g(COL.HSC_REG), teamsId: g(COL.TEAMS_ID),
      hscBoard: g(COL.HSC_BOARD), email: g(COL.EMAIL), regDate: g(COL.FORM_FILL_DATE),
      homeDistrict: g(COL.HOME_DISTRICT),
      subjectsChoice: [g(COL.SUBJECT_1),g(COL.SUBJECT_2),g(COL.SUBJECT_3),g(COL.SUBJECT_4),g(COL.SUBJECT_5)].filter(Boolean).join(', '),
      selectedSub: g(COL.SELECTED_SUBJECT), versionInterested: g(COL.VERSION_INTERESTED),
      idChecked: g(COL.ID_CHECKED), runningProgram: g(COL.RUNNING_PROGRAM),
      previousProgram: g(COL.PREVIOUS_PROGRAM)
    }
  };
}

function parseRemarkCell_(raw, rmNum) {
  var show = (rmNum >= 4) || (raw.length > 0 && rmNum > 0);
  if (!show || !raw) return { count: rmNum, show: false, body: '', byLine: '', dateLine: '' };
  var lines = raw.replace(/\\r/g, '').split('\\n');
  var bodyLines = [], byLine = '', dateLine = '';
  for (var i = 0; i < lines.length; i++) {
    var line = lines[i].trim();
    if (!line) continue;
    if (line.charAt(0) === '#') byLine = line;
    else if (/^date\\s*:/i.test(line)) dateLine = line;
    else bodyLines.push(line);
  }
  var body = bodyLines.join('\\n').trim();
  if (!body) body = 'সমস্যাঃ\\n** খাতা দেখার নিয়ম না মেনে খাতা দেখা।\\n** প্রিন্টিং কমেন্ট করা।\\n** কনসেপ্ট দুর্বল।\\n** একাধিকবার সুযোগ দেয়া সত্ত্বেও শুধরাতে পারেননি।';
  return { count: rmNum, show: true, body: body, byLine: byLine, dateLine: dateLine };
}

function mkAs_(name, pct, set, date, pass) {
  var p = String(pct||'').trim(), s = String(set||'').trim(), d = String(date||'').trim();
  var sc = parseScore_(p);
  var st = (p||s||d) ? ((sc !== null && sc >= pass) ? 'Allow' : 'Not Allow') : 'No Exam';
  return { subject: name + ' (%)', percent: p, set: s, date: d, status: st };
}
function parseScore_(v) {
  v = String(v||'').trim();
  if (!v) return null;
  var fm = v.match(/(\\d+(?:\\.\\d+)?)\\s*\\/\\s*\\d+/);
  if (fm) return Number(fm[1]);
  var m = v.match(/-?\\d+(?:\\.\\d+)?/);
  return m ? Number(m[0]) : null;
}
function extractNum_(v) {
  var m = String(v||'').match(/\\d+/);
  return m ? Number(m[0]) : 0;
}
function fmtBatch_(v) {
  v = String(v||'').trim();
  return /^\\d{2}$/.test(v) ? '20' + v : v;
}

function onEdit(e) {
  var sheet = e.source.getActiveSheet();
  if (sheet.getName() === CONFIG.SHEET_NAME) {
     var tpin = sheet.getRange(e.range.getRow(), COL.TPIN).getValue();
     UrlFetchApp.fetch('https://ais-dev-3kjxsqk4ykskyku364hsua-192410877328.asia-southeast1.run.app/api/refresh?tpin=' + tpin, {
       'method': 'get',
       'muteHttpExceptions': true
     });
  }
}
`;
