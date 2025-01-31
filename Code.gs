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

function getThreads(page, filter = "primary") {
  var PAGE_SIZE = 10;
  var startIndex = page * PAGE_SIZE;
  var searchQuery = "";

  // Apply correct search queries based on selected filter
  if (filter === "all") {
    searchQuery = "in:all -in:scheduled -in:trash -in:sent";
  } else {
    searchQuery = "category:primary"; // Default fallback
  }

  var threads = GmailApp.search(searchQuery, startIndex, PAGE_SIZE); 
  var emailData = [];

  threads.forEach(thread => {
    var messages = thread.getMessages();
    var threadId = thread.getId();
    var subject = thread.getFirstMessageSubject();
    var mostRecentMessage = messages[messages.length - 1];
    var sender = mostRecentMessage.getFrom();
    var threadStatus = getThreadStatus(threadId);

    var threadData = {
      threadId: threadId,
      sender: sender,
      subject: subject,
      status: threadStatus,
      messages: messages.map(msg => ({
        id: msg.getId(),
        sender: msg.getFrom(),
        date: msg.getDate().toLocaleString(),
        body: msg.getBody()
      })).reverse() // Reverse to show the most recent message at the top
    };

    emailData.push(threadData);
  });

  return emailData;
}

var properties = PropertiesService.getUserProperties();

// Store a replied thread ID.
function markAsReplied(threadId) {
  var repliedThreads = JSON.parse(PropertiesService.getUserProperties().getProperty("repliedThreads") || "{}");
  repliedThreads[threadId] = true;
  PropertiesService.getUserProperties().setProperty("repliedThreads", JSON.stringify(repliedThreads));
}

// Store a dismissed thread ID.
function dismissThread(threadId) {
  var dismissedThreads = JSON.parse(PropertiesService.getUserProperties().getProperty("dismissedThreads") || "{}");
  dismissedThreads[threadId] = true;
  PropertiesService.getUserProperties().setProperty("dismissedThreads", JSON.stringify(dismissedThreads));
}

// Retrieve replied and dismissed thread IDs.
function getThreadStatus(threadId) {
  var repliedThreads = JSON.parse(PropertiesService.getUserProperties().getProperty("repliedThreads") || "{}");
  var dismissedThreads = JSON.parse(PropertiesService.getUserProperties().getProperty("dismissedThreads") || "{}");

  return {
    replied: !!repliedThreads[threadId], // True if thread is marked as replied
    dismissed: !!dismissedThreads[threadId] // True if thread is marked as dismissed
  };
}


function sendReply(threadId, replyHtml) {
  var thread = GmailApp.getThreadById(threadId);
  if (thread) {
    thread.reply(replyHtml, { htmlBody: replyHtml });
    markAsReplied(threadId);
    return `Reply sent successfully for threa ID: ${threadId}`;
  }
  return `Error sending reply for thread ID ${threadId}: ${e.message}`;
}

