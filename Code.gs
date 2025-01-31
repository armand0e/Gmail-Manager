// HTML for the Web App interface
function doGet() {
  return HtmlService.createTemplateFromFile('index')
    .evaluate()
    .setTitle("Email Manager")
    .setSandboxMode(HtmlService.SandboxMode.IFRAME);
}

function include(filename) {
  return HtmlService.createTemplateFromFile(filename)
    .evaluate()
    .setSandboxMode(HtmlService.SandboxMode.IFRAME)
    .getContent();
 }

// Fetch emails for a specific page
function getEmails(page = 0) {
  const PAGE_SIZE = 10; // Number of threads per page
  const startIndex = page * PAGE_SIZE;
  try {
    const threads = GmailApp.getInboxThreads(startIndex, PAGE_SIZE);
    const emails = threads.map(thread => {
      const message = thread.getMessages()[0];
      return {
        id: message.getId(),
        sender: message.getFrom(),
        subject: message.getSubject(),
        body: message.getBody()
      };
    });

    return emails;
  } catch (error) {
    Logger.log("Error in getEmails: " + error.message);
    return [];
  }
}

function uploadInlineImage(fileName, base64Data) {
  var blob = Utilities.newBlob(Utilities.base64Decode(base64Data.split(',')[1]), MimeType.PNG, fileName);
  // Generate a Content-ID for embedding in emails
  var contentId = fileName.replace(/\s+/g, '_') + "@gmail.com";
  // Save to Drive (if needed) or use directly
  var file = DriveApp.createFile(blob);
  return contentId;
}

var properties = PropertiesService.getUserProperties();

// Store a replied email ID.
function markAsReplied(emailId) {
  var repliedEmails = JSON.parse(properties.getProperty("repliedEmails") || "{}");
  repliedEmails[emailId] = true;
  properties.setProperty("repliedEmails", JSON.stringify(repliedEmails));
}

// Store a dismissed email ID.
function dismissEmail(emailId) {
  var dismissedEmails = JSON.parse(properties.getProperty("dismissedEmails") || "{}");
  dismissedEmails[emailId] = true;
  properties.setProperty("dismissedEmails", JSON.stringify(dismissedEmails));
}

// Retrieve replied and dismissed email IDs.
function getEmailStatus() {
  return {
    replied: JSON.parse(properties.getProperty("repliedEmails") || "{}"),
    dismissed: JSON.parse(properties.getProperty("dismissedEmails") || "{}")
  };
}

function sendReply(emailId, replyHtml) {
  try {
    const thread = GmailApp.getMessageById(emailId).getThread();
    thread.reply(replyHtml, { htmlBody: replyHtml });
    return `Reply sent successfully for email ID: ${emailId}`;
  } catch (e) {
    return `Error sending reply for email ID ${emailId}: ${e.message}`;
  }
}
