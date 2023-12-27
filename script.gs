const MAIN_HEADERS = ["tournament", "event", "event_date", "event_time", "is_finished", "check", "comment" ]
const BOOKMAKERS_HEADERS = ["Parimatch", "Olimp", "Fortuna", "SportPlus", "Lootbet", "Tipsport"];
const NAME_LIST_REGEXP = /^\d\dM\d\d$/;
const DATE_REGEXP = /^\d\d.\d\d.\d\d\d\d$/;
const TIME_REGEXP = /^\d\d:\d\d:\d\d$/;
const VALUE_CELL = [1.0, 0.0];
const RANGE_DESC_COLUMN = "";
const RANGE_BOOKMAKERS_COLUMN = "H:M";

//done
const validNameList = (list) => {
  const errMSG = [];
  const nameList = list.getName();
  if(!nameList.match(NAME_LIST_REGEXP)) 
    errMSG.push('Ошибка в имени листа');

  return {error: errMSG}
}

//done
const validHeadersList = list => {
  const errMSG = [];
  const headersArr = list.getRange("A1:K1").getValues();
  const headers = headersArr[0];

  for(let i = 0; i < MAIN_HEADERS.length; i++)
    if(headers[i] !== MAIN_HEADERS[i]) errMSG.push(`Ошибка в заголовоке ${i+1} столбца(${headers[i]})`)
  for(let i = MAIN_HEADERS.length; i < headers.length; i++)
    if(!BOOKMAKERS_HEADERS.includes(headers[i])) errMSG.push(`Ошибка в заголовоке ${i+1} столбца(${headers[i]})`)
  
  return {error: errMSG};
}

//done
const validDate = list => {
  const errMSG = [];
  let countCell = 0;

  const nameList = list.getName();
  const nameListArr = nameList.split("M");
  const year = nameListArr[0];
  const month = nameListArr[1];
  const partDate = `${month}.20${year}`;
  const rows = list.getRange("C3:C").getValues();

  for(let i = 0; i < rows.length; i++){
    const cell = rows[i][0];
    if(!cell) break;
    countCell++;
    if(!cell.toString().includes(partDate)){
      errMSG.push(`Неправильная дата ${i+3} строка`);
      continue;
    }
    if(!cell.toString().match(DATE_REGEXP)){
      errMSG.push(`Неправильная дата ${i+3} строка`);
      continue;
    }
  }

  return {count: countCell, error: errMSG};
}

//done
function validTime(list) {
  const errMSG = [];
  let countCell = 0;
  const rows = list.getRange("D:D").getValues();

  for(let i = 2; i < rows.length; i++){
    const cell = rows[i][0];
    if(!cell) break;
    countCell++;
    if(typeof cell !== 'object') 
      errMSG.push(`Неправильное время ${i+1} строка`);
  }

  return {count: countCell, error: errMSG};
}

//done
function validEvent(list) {
  let countCell = 0;
  const errMSG = [];

  const rows = list.getRange("B3:B").getValues();

  for(let i = 0; i < rows.length; i++){
    const cell = rows[i][0];
    if(!cell) break;
    countCell++;
    const cellArr = cell.split(" - ");
    if(cellArr.length !== 2)
      errMSG.push(`Неправильное название матча ${i+3} строка`);
  }

  return {count: countCell, error: errMSG};
}

//done
const validBMCells = (list) => {
  let countCell = 0;
  const errMSG = [];

  const rows = list.getRange(RANGE_BOOKMAKERS_COLUMN).getValues();
  const rowLen = rows[0].length

  let maxRowLen = 0;
  for(let i = 2; i < rows.length; i++){
    let len = 0
    for(let j = 0; j < rowLen; j++){
      const cell = rows[i][j];
      if(!VALUE_CELL.includes(cell)){
        maxRowLen = maxRowLen < len ? len : maxRowLen;
        break;
      }
      len++;
    }
  }

  let emptyFlag = 0;
  for(let i = 2; i < rows.length; i++){
    for(let j = 0; j < maxRowLen; j++){
      const cell = rows[i][j];
      if(!VALUE_CELL.includes(cell)) emptyFlag++;
    }
    if(emptyFlag === maxRowLen) break;
    if(emptyFlag) errMSG.push(`Ошибка ячейки БК ${i+1} строка`)
    emptyFlag = 0;
    countCell++;
  }

  return {count: countCell, error: errMSG};
}

//done
const validFinishCells = (list) => {
  let countCell = 0;
  const errMSG = [];
  const rowsH = list.getRange("E:E").getValues();

  for(let i = 2; i < rowsH.length; i++){
    const cell = rowsH[i][0];
    if(!cell) break;
    countCell++;
    if(!VALUE_CELL.includes(cell))
      errMSG.push(`Неправильное значение is_finished ${i+1} строка`)
  }

  return {count: countCell, error: errMSG};
}


const validList = () => {
    let errorArr = [];
    let countCell = [];

    const ui = SpreadsheetApp.getUi();
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const list = ss.getActiveSheet();

    const nameInfo = validNameList(list);
    const headersInfo = validHeadersList(list);
    const eventInfo = validEvent(list);
    const dateInfo = validDate(list);
    const timeInfo = validTime(list);
    const finisInfo = validFinishCells(list)
    const bmInfo = validBMCells(list);

    countCell = [eventInfo.count, dateInfo.count, timeInfo.count, finisInfo.count, bmInfo.count].sort();
    const countError = countCell[0] === countCell[countCell.length - 1] ? [] : ['Неодинаковое количество ячеек в столбцах'];

    errorArr = [
      ...nameInfo.error, 
      ...headersInfo.error, 
      ...dateInfo.error, 
      ...timeInfo.error,
      ...eventInfo.error,
      ...bmInfo.error,
      ...finisInfo.error,
      ...countError,
    ];

    if(errorArr.length) ui.alert(errorArr.join("\n"));
    else ui.alert("All good)");
}
    
const MAIN_HEADERS = ["tournament", "event", "event_date", "event_time", "is_finished", "check", "comment" ]
const BOOKMAKERS_HEADERS = ["Parimatch", "Olimp", "Fortuna", "SportPlus", "Lootbet", "Tipsport"];
const NAME_LIST_REGEXP = /^\d\dM\d\d$/;
const DATE_REGEXP = /^\d\d.\d\d.\d\d\d\d$/;
const TIME_REGEXP = /^\d\d:\d\d:\d\d$/;
const VALUE_CELL = [1.0, 0.0];
const RANGE_DESC_COLUMN = "";
const RANGE_BOOKMAKERS_COLUMN = "H:M";

//done
const validNameList = (list) => {
  const errMSG = [];
  const nameList = list.getName();
  if(!nameList.match(NAME_LIST_REGEXP)) 
    errMSG.push('Ошибка в имени листа');

  return {error: errMSG}
}

//done
const validHeadersList = list => {
  const errMSG = [];
  const headersArr = list.getRange("A1:K1").getValues();
  const headers = headersArr[0];

  for(let i = 0; i < MAIN_HEADERS.length; i++)
    if(headers[i] !== MAIN_HEADERS[i]) errMSG.push(`Ошибка в заголовоке ${i+1} столбца(${headers[i]})`)
  for(let i = MAIN_HEADERS.length; i < headers.length; i++)
    if(!BOOKMAKERS_HEADERS.includes(headers[i])) errMSG.push(`Ошибка в заголовоке ${i+1} столбца(${headers[i]})`)
  
  return {error: errMSG};
}

//done
const validDate = list => {
  const errMSG = [];
  let countCell = 0;

  const nameList = list.getName();
  const nameListArr = nameList.split("M");
  const year = nameListArr[0];
  const month = nameListArr[1];
  const partDate = `${month}.20${year}`;
  const rows = list.getRange("C3:C").getValues();

  for(let i = 0; i < rows.length; i++){
    const cell = rows[i][0];
    if(!cell) break;
    countCell++;
    if(!cell.toString().includes(partDate)){
      errMSG.push(`Неправильная дата ${i+3} строка`);
      continue;
    }
    if(!cell.toString().match(DATE_REGEXP)){
      errMSG.push(`Неправильная дата ${i+3} строка`);
      continue;
    }
  }

  return {count: countCell, error: errMSG};
}

//done
function validTime(list) {
  const errMSG = [];
  let countCell = 0;
  const rows = list.getRange("D:D").getValues();

  for(let i = 2; i < rows.length; i++){
    const cell = rows[i][0];
    if(!cell) break;
    countCell++;
    if(typeof cell !== 'object') 
      errMSG.push(`Неправильное время ${i+1} строка`);
  }

  return {count: countCell, error: errMSG};
}

//done
function validEvent(list) {
  let countCell = 0;
  const errMSG = [];

  const rows = list.getRange("B3:B").getValues();

  for(let i = 0; i < rows.length; i++){
    const cell = rows[i][0];
    if(!cell) break;
    countCell++;
    const cellArr = cell.split(" - ");
    if(cellArr.length !== 2)
      errMSG.push(`Неправильное название матча ${i+3} строка`);
  }

  return {count: countCell, error: errMSG};
}

//done
const validBMCells = (list) => {
  let countCell = 0;
  const errMSG = [];

  const rows = list.getRange(RANGE_BOOKMAKERS_COLUMN).getValues();
  const rowLen = rows[0].length

  let maxRowLen = 0;
  for(let i = 2; i < rows.length; i++){
    let len = 0
    for(let j = 0; j < rowLen; j++){
      const cell = rows[i][j];
      if(!VALUE_CELL.includes(cell)){
        maxRowLen = maxRowLen < len ? len : maxRowLen;
        break;
      }
      len++;
    }
  }

  let emptyFlag = 0;
  for(let i = 2; i < rows.length; i++){
    for(let j = 0; j < maxRowLen; j++){
      const cell = rows[i][j];
      if(!VALUE_CELL.includes(cell)) emptyFlag++;
    }
    if(emptyFlag === maxRowLen) break;
    if(emptyFlag) errMSG.push(`Ошибка ячейки БК ${i+1} строка`)
    emptyFlag = 0;
    countCell++;
  }

  return {count: countCell, error: errMSG};
}

//done
const validFinishCells = (list) => {
  let countCell = 0;
  const errMSG = [];
  const rowsH = list.getRange("E:E").getValues();

  for(let i = 2; i < rowsH.length; i++){
    const cell = rowsH[i][0];
    if(!cell) break;
    countCell++;
    if(!VALUE_CELL.includes(cell))
      errMSG.push(`Неправильное значение is_finished ${i+1} строка`)
  }

  return {count: countCell, error: errMSG};
}


const validList = () => {
    let errorArr = [];
    let countCell = [];

    const ui = SpreadsheetApp.getUi();
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const list = ss.getActiveSheet();

    const nameInfo = validNameList(list);
    const headersInfo = validHeadersList(list);
    const eventInfo = validEvent(list);
    const dateInfo = validDate(list);
    const timeInfo = validTime(list);
    const finisInfo = validFinishCells(list)
    const bmInfo = validBMCells(list);

    countCell = [eventInfo.count, dateInfo.count, timeInfo.count, finisInfo.count, bmInfo.count].sort();
    const countError = countCell[0] === countCell[countCell.length - 1] ? [] : ['Неодинаковое количество ячеек в столбцах'];

    errorArr = [
      ...nameInfo.error, 
      ...headersInfo.error, 
      ...dateInfo.error, 
      ...timeInfo.error,
      ...eventInfo.error,
      ...bmInfo.error,
      ...finisInfo.error,
      ...countError,
    ];

    if(errorArr.length) ui.alert(errorArr.join("\n"));
    else ui.alert("All good)");
}
    
