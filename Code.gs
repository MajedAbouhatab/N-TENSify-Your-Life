function doPost(e) { 
  var GS = SpreadsheetApp.openById('<SheetID>');
  ThisSheet = GS.getActiveSheet();
  // Get all contents
  var json = JSON.parse(e.postData.contents)
  // Need to begin with number
  if (!json.report.match(/^\d/)) return;
  // Row array
  var ThisRecord = [];
  // Report contents
  ThisRecord[0] = json.report;
  // Timestamp
  ThisRecord[1] = ReadableDate(Date.now()); 
  // Save to spreadsheet
  ThisSheet.getRange(ThisSheet.getLastRow() + 1, 1, 1, ThisRecord.length).setValues([ThisRecord]);
  // Delete if redundant
  if (ThisSheet.getRange(ThisSheet.getLastRow(), 1, 1, 1).getValue().substring(3, 8) == 
  ThisSheet.getRange(ThisSheet.getLastRow()-1, 1, 1, 1).getValue().substring(3, 8)) 
  ThisSheet.deleteRow(ThisSheet.getLastRow());
}

function ReadableDate(timestamp) {
  var d = new Date(timestamp);
  return d.getFullYear() + "-" + ("00" + (d.getMonth() + 1)).slice(-2) + "-" + ("00" + d.getDate()).slice(-2) + " " +
    ("00" + d.getHours()).slice(-2) + ":" + ("00" + d.getMinutes()).slice(-2) + ":" + ("00" + d.getSeconds()).slice(-2);
}