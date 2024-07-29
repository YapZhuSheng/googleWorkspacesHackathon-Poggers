
function onOpen() {
    DocumentApp.getUi() //
      .createAddonMenu()
      .addItem('Show sidebar', 'showSidebar')
      .addToUi();
}

function showSidebar(){
  var ui = HtmlService.createHtmlOutputFromFile('sidebar');
  
  DocumentApp.getUi().showSidebar(ui);
}


function exportPdf(input) {
  var passWord = input;
  var doc = DocumentApp.getActiveDocument();
  var blob = doc.getAs('application/pdf');
  var apiEndpoint = 'https://google-hack-backend.vercel.app/encrypt_pdf';
  var payload = {
    pdf: blob.setContentType('application/pdf'),
    password: passWord
  };
  var formData = {
    password: passWord,
    pdf: blob.setContentType('application/pdf'),
  };
  var options = {
    'method' : 'post',
    'payload' : payload
  };
  var response = UrlFetchApp.fetch(apiEndpoint, options);

  // Handle API response
  if (response.getResponseCode() == 200) {
    var encryptedBlob = Utilities.newBlob(response.getContent(),'application/pdf','encrypted.pdf');
    var tempFile=DriveApp.createFile(encryptedBlob);
    DocumentApp.getUi().alert('Encrypted PDF saved to Drive');
    var url = tempFile.getUrl();
    openLinkInNewTab(url);
    
    
    // Delete temporary file
    //tempFile.setTrashed(true);
  } else {
    // Handle error
    DocumentApp.getUi().alert('Error sending PDF: ' + response.getContentText());
    DocumentApp.getUi().alert('Error', 'An error occurred while sending the PDF.', ui.ButtonSet.OK);
  }
}
function openLinkInNewTab(url) {
  var html = HtmlService.createHtmlOutput('<script>window.open("' + url + '");</script>');
  DocumentApp.getUi().showModalDialog(html, 'Opening...');
}


