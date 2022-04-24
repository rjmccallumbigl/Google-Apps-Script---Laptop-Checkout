/*******************************************************************************************
 *  
 * Creates a trigger for when a spreadsheet opens.
 * More info: https://productforums.google.com/forum/#!topic/docs/67lySF27l5c
 *
*******************************************************************************************/

function onOpen() {
  var spreadsheet = SpreadsheetApp.getActive();
  var menuItems = [
    { name: 'Click Here (you only need to run this the first time)', functionName: 'createSpreadsheetOpenTrigger' }
  ];
  spreadsheet.addMenu('Click this first to initialize script', menuItems);
}

/*******************************************************************************************
 *  
 * Create trigger for sheet to have permissions
 *
*******************************************************************************************/

function createSpreadsheetOpenTrigger() {
  var ss = SpreadsheetApp.getActive();
  ScriptApp.newTrigger('myOnEdit')
    .forSpreadsheet(ss)
    .onEdit()
    .create();
}

/*******************************************************************************************
 * 
 * Set function to run whenver sheet is edited
 * 
 * @param {Object} e the active cell when the edit trigger is called
 *
*******************************************************************************************/

function myOnEdit(e) {

  //End if the active cell is not in the "Checked Out?" column
  if (e.range.columnStart != 3) {
    Logger.log("Wrong column, won't delete anything");
    return;
  }

  //Check out laptop if value is checked
  if (e.range.getDisplayValue() == "TRUE") {
    checkOutHTMLDialog();
  } else if (e.range.getDisplayValue() == "FALSE") {
    //Check in laptop if value is unchecked
    checkIn(e);
  } else {
    return;
  }
}

/*******************************************************************************************
 * 
 * open HTML dialog for checking out a laptop
 * 
*******************************************************************************************/

function checkOutHTMLDialog() {

  //Declare variables
  var ss = SpreadsheetApp.getActiveSpreadsheet();

  //get dept codes
  var deptSheet = ss.getSheetByName('Departments');
  var deptCodes = deptSheet.getRange('A2:A' + deptSheet.getLastRow()).getDisplayValues();
  var dropdownMenu = "<strong>Department</strong> <br><form> <select id='dpt-dropdown'>";

  //create dropdown menu for depts
  for (var m = 0; m < deptCodes.length; m++) {
    dropdownMenu += "<option value=" + deptCodes[m] + ">" + deptCodes[m] + "</option>";
  }
  dropdownMenu += "</select> </form> <p id='dept'></p>";

  //Prepare HTML dialog
  var stylesheet = '<link rel="stylesheet" href="https://ssl.gstatic.com/docs/script/css/add-ons1.css">';
  var HTMLMessage = '<form> <strong>First Name</strong><input type="text" name="userFirstName" style="float: right;"/> <br><br>' +
    '<strong>Last Name</strong><input type="text" name="userLastName" style="float: right;"/> <br><br>' +
    '<strong>Phone (x7####) </strong><input type="tel" name="userPhone" style="float: right;"/> <br><br>' +
    '<strong>Estimated Return Date</strong><input type="date" name="userReturnDate" style="float: right;"/> <br><br>' +
    '<strong>Notes</strong><input type="text" name="userNotes" style="float: right;"/> <br><br>' +
    '<strong>Other Equipment Lended</strong><input type="text" name="userOther" style="float: right;"/> <br><br>' +
    '<input type="submit" class="action" value="Submit" onClick="formSubmit()" /> </form> ';

  //Prepare HTML script in dialog that calls GAS function
  var HTMLScript = '<script type="text/javascript"> function formSubmit(userLastName, ' +
    'userFirstName, userPhone,userReturnDate, userNotes, userOther) { var deptChoice = document.getElementById("dpt-dropdown").value;' +
    'var userLastName=document.getElementsByName("userLastName")[0].value;' +
    'var userFirstName=document.getElementsByName("userFirstName")[0].value;' +
    'var userPhone=document.getElementsByName("userPhone")[0].value;' +
    'var userReturnDate=document.getElementsByName("userReturnDate")[0].value;' +
    'var userNotes=document.getElementsByName("userNotes")[0].value;' +
    'var userOther=document.getElementsByName("userOther")[0].value;' +
    'document.getElementById("dept").innerHTML = deptChoice; google.script.run.checkOut(deptChoice, userLastName, ' +
    'userFirstName, userPhone, userReturnDate, userNotes, userOther); google.script.host.close();} ' +
    '</script>';

  //Display HTML output  
  var htmlApp = HtmlService
    .createHtmlOutput("<!DOCTYPE html> <html> <head> " + stylesheet + " </head> <body>" + dropdownMenu + HTMLMessage + HTMLScript + "</body> </html>")
    .setWidth(400)
    .setHeight(400);

  SpreadsheetApp.getUi().showModalDialog(htmlApp, "User Information");
  var output = HtmlService.createTemplate(htmlApp);
}

/*******************************************************************************************
 * 
 * Check out laptop to a user
 * 
 * @param {String} userDept the user's department
 * @param {String} userLastName the user's last name
 * @param {String} userFirstName the user's first name
 * @param {String} userPhone the user's campus phone number
 * @param {Date} userReturnDate the user's estimated return date for the laptop
 * @param {String} userNotes any applicable notes on the user's use of laptop
 * @param {String} userOther any other items being checked out to user
 * 
*******************************************************************************************/

function checkOut(userDept, userLastName, userFirstName, userPhone, userReturnDate, userNotes, userOther) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var laptops = ss.getSheetByName("Laptops");
  var thisRow = laptops.getActiveRange().getRow();

  //Declare laptop range where we want our checkout info to be place
  var userRange = laptops.getRange(thisRow, 4, 1, 8);

  //Declare current date and time
  var currentDate = new Date();
  var userDataArray = [];

  //run function for dialog and return array of choices
  userDataArray = [[userDept, userLastName, userFirstName, userPhone, currentDate, userReturnDate, userNotes, userOther]];

  //Set data to range  
  userRange.setValues(userDataArray);
}

/*******************************************************************************************
 * 
 * Automatically add laptop to history sheet when "checked" back in
 * 
 * @param {Object} e the active cell when the edit trigger is called 
 * 
*******************************************************************************************/

function checkIn(e) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var laptops = ss.getSheetByName("Laptops");
  var destinationSheet = ss.getSheetByName("History");
  var destRow = destinationSheet.getLastRow();

  //This is the history range we want our checkout info to be copied to
  var destRange = destinationSheet.getRange(destRow + 1, 4, 1, 20);

  //This is the history range where we add our date and issue reports
  var destInputValues = destinationSheet.getRange(destRow + 1, 1, 1, 3);

  //Current date and time
  var currentDate = new Date();

  //Check laptop in, report issues (optional)
  var ui = SpreadsheetApp.getUi();
  var userIssues = ui.alert('IT Laptop Check In', 'Did the user report any issues with the laptop?', ui.ButtonSet.YES_NO_CANCEL);
  var issueWas;
  var issueWasText;

  if (userIssues == ui.Button.YES) {
    //report user's issue
    issueWas = ui.prompt('IT Laptop Check In', 'What was the user\'s issue?', ui.ButtonSet.OK_CANCEL);
    issueWasText = issueWas.getResponseText();
  } else if (userIssues == ui.Button.NO) {
    //report that there was no issue
    issueWasText = "n";
  } else {
    return;
  }

  var techIssues = ui.alert('IT Laptop Check In', 'Did you find any issues with the laptop?', ui.ButtonSet.YES_NO_CANCEL);
  var techIssueWas;
  var techIssueWasText;

  if (techIssues == ui.Button.YES) {
    //report your issue
    techIssueWas = ui.prompt('IT Laptop Check In', 'What was your issue?', ui.ButtonSet.OK_CANCEL);
    techIssueWasText = techIssueWas.getResponseText();
  } else if (techIssues == ui.Button.NO) {
    //report that you found no issue
    techIssueWasText = "n";
  } else {
    //quit
    return;
  }

  //Copy values to history sheet, then clear from laptop sheet if value is marked false
  if (e.range.getDisplayValue() == "FALSE") {
    //Get laptop information
    var laptopRange = laptops.getRange(e.range.getRow(), 4, 1, 20);
    //Get user infomation
    var userRange = laptops.getRange(e.range.getRow(), 14, 1, 20);
    //Create an array of our input information to copy to range
    var inputArray = [[currentDate, issueWasText, techIssueWasText]];
    //Copy date and issue reports to history sheet
    destInputValues.setValues(inputArray);
    //Copy laptop + user information to history sheet
    var copiedText = laptopRange.copyTo(destRange);
    //Delete user information from laptop sheet for future users
    userRange.clearContent();
    ss.toast("The laptop has been checked in.", "IT Laptop Check In", 10);
  }
}
















