const MAIN_HEADERS = ["tournament", "event", "event_date", "event_time", "is_finished", "check", "comment" ]
const BOOKMAKERS_HEADERS = ["Parimatch", "Olimp", "Fortuna", "SportPlus", "Lootbet", "Tipsport"];
const BOOKMAKERS_CELL = [1.0, 0.0];

const COUNT_NAME_COLUMN = ["Event", "Date", "Time", "Finish", "Bookmakers"]

const NAME_LIST_REGEXP = /^\d\dM\d\d$/;
const DATE_REGEXP = /^\d\d.\d\d.\d\d\d\d$/;
const TIME_REGEXP = /^\d\d:\d\d:\d\d$/;

const RANGE_HEADERS_CELLS = "A1:K1"
const RANGE_EVENT_CELLS = "B:B";
const RANGE_DATE_CELLS = "C:C";
const RANGE_TIME_CELLS = "D:D";
const RANGE_FINISH_CELLS = "E:E";
const RANGE_BOOKMAKERS_CELLS = "H:M";

const ERR_NAME_LIST = () => "Error in name sheet";
const ERR_HEADERS = i => `Error in header(${i} column)`;
const ERR_DATE = i => `Error in dater(${i} row)`;
const ERR_TIME = i => `Error in time(${i} row)`;
const ERR_EVENT = i => `Error in event(${i} row)`
const ERR_FINISH = i => `Error in is_finished(${i} row)`;
const ERR_BOOKMAKER = i => `Error in bm cell(${i} row)`;
const ERR_COUNT = counts => `Error of count rows: ${counts.join(", ")} (${COUNT_NAME_COLUMN.join(", ")})`;

const getPartDate = list => {
  const nameListArr = list.getName().split("M");
  return `${nameListArr[1]}.20${nameListArr[0]}`;
}

const validNameList = list => {
  return !list.getName().match(NAME_LIST_REGEXP) ? [ERR_HEADERS] : []
}

const validHeadersList = list => {
  const error = [];

  const headersArr = list.getRange(RANGE_HEADERS_CELLS).getValues();
  const headers = headersArr[0];

  for(let i = 0; i < MAIN_HEADERS.length; i++)
    if(headers[i] !== MAIN_HEADERS[i]) 
      error.push(ERR_NAME_HEADERS(i+1));
  
  for(let i = MAIN_HEADERS.length; i < headers.length; i++)
    if(!BOOKMAKERS_HEADERS.includes(headers[i])) 
      error.push(ERR_NAME_HEADERS(i+1));
  
  return error;
}

const validDate = list => {
  const error = [];

  const rows = list.getRange(RANGE_DATE_CELLS).getValues();

  for(let i = 2; i < rows.length; i++){
    const cell = rows[i][0];
    if(!cell) break;
    if(!cell.toString().includes(getPartDate(list))){
      error.push(ERR_DATE(i+1));
      continue;
    }
    if(!cell.toString().match(DATE_REGEXP)){
      error.push(ERR_DATE(i+1));
      continue;
    }
  }

  return error;
}

const validTime = list => {
  const error = [];

  const rows = list.getRange(RANGE_TIME_CELLS).getValues();

  for(let i = 2; i < rows.length; i++){
    const cell = rows[i][0];
    if(!cell) break;
    if(typeof cell !== 'object') error.push(ERR_TIME(i+1));
  }

  return error;
}

const validEvent = list => {
  const error = [];

  const rows = list.getRange(RANGE_EVENT_CELLS).getValues();

  for(let i = 2; i < rows.length; i++){
    const cell = rows[i][0];
    if(!cell) break;
    if(cell.split(" - ").length !== 2) error.push(ERR_EVENT(i+1));
  }

  return error;
}

const validFinishCells = list => {
  const error = [];

  const rows = list.getRange(RANGE_FINISH_CELLS).getValues();

  for(let i = 2; i < rows.length; i++){
    const cell = rows[i][0];
    if(!cell) break;
    if(!BOOKMAKERS_CELL.includes(cell)) error.push(ERR_FINISH(i+1));
  }

  return error;
}

const validBMCells = list => {
  const error = [];

  const rows = list.getRange(RANGE_BOOKMAKERS_CELLS).getValues();
  const rowLen = rows[0].length

  let maxRowLen = 0;
  for(let i = 2; i < rows.length; i++){
    let len = 0
    if(!rows[i][0]) break;
    for(let j = 0; j < rowLen; j++){
      if(BOOKMAKERS_CELL.includes(rows[i][j])){
        len++;
        maxRowLen = maxRowLen < len ? len : maxRowLen;
      }
    }

  }

  let emptyFlag = 0;
  for(let i = 2; i < rows.length; i++){
    
    for(let j = 0; j < maxRowLen; j++){
      const cell = rows[i][j];
      if(!BOOKMAKERS_CELL.includes(cell))  emptyFlag++;
    }
    if(emptyFlag === maxRowLen) break;
    if(emptyFlag) error.push(ERR_BOOKMAKER(i+1))
    emptyFlag = 0;
  }

  return error;
}

const validCount = list => {
  const error = [];

  let countDate = 0;
  const rowsDate = list.getRange(RANGE_DATE_CELLS).getValues();
  for(let i = 2; i < rowsDate.length; i++){
    if(!rowsDate[i][0]) break;
    else countDate++;
  }

  let countTime = 0;
  const rowsTime = list.getRange(RANGE_TIME_CELLS).getValues();
  for(let i = 2; i < rowsTime.length; i++){
    if(!rowsTime[i][0]) break;
    else countTime++;
  }

  let countEvent = 0;
  const rowsEvent = list.getRange(RANGE_EVENT_CELLS).getValues();
  for(let i = 2; i < rowsEvent.length; i++){
    if(!rowsEvent[i][0]) break;
    else countEvent++;
  }

  let countFinish = 0;
  const rowsFinish = list.getRange(RANGE_FINISH_CELLS).getValues();
  for(let i = 2; i < rowsFinish.length; i++){
    if(!rowsFinish[i][0]) break;
    else countFinish++;
  }

  let countBM = 0;
  const rowsBM = list.getRange(RANGE_BOOKMAKERS_CELLS).getValues();
  const rowBMLen = rowsBM[0].length
  for(let i = 2; i < rowsBM.length; i++){
    let emptyFlag = 0

    for(let j = 0; j < rowBMLen; j++) if(!rowsBM[i][j]) emptyFlag++;

    if(emptyFlag === rowBMLen) break;
    else countBM++;
  }

  const countCells = [countEvent, countDate, countTime, countFinish, countBM];
  const sortedArr = [...countCells].sort();
  if(sortedArr[0] !== sortedArr[sortedArr.length - 1]) error.push(ERR_COUNT(countCells))

  return error
}

const validList = () => {
    const ui = SpreadsheetApp.getUi();
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const list = ss.getActiveSheet();

    const nameErr = validNameList(list);
    const headersErr = validHeadersList(list);
    const eventErr = validEvent(list);
    const dateErr = validDate(list);
    const timeErr = validTime(list);
    const finisErr = validFinishCells(list)
    const bmErr = validBMCells(list);
    const countErr = validCount(list);

    const errorArr = [
      ...nameErr, 
      ...headersErr, 
      ...eventErr, 
      ...dateErr,
      ...timeErr,
      ...finisErr,
      ...bmErr,
      ...countErr
    ];

    if(errorArr.length) ui.alert(errorArr.join("\n"));
    else ui.alert("All good)");
}
