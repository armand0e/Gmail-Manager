# Gmail Manager

A web-based Gmail management interface built with Google Apps Script that allows you to view, reply to, and manage your Gmail threads through a clean, intuitive web application.

## Features

- **Thread Management**: View and manage Gmail threads with pagination support
- **Reply Interface**: Compose and send replies directly from the web interface
- **Filtering**: Filter emails by categories (primary, all, etc.)
- **Responsive Design**: Clean, table-based layout that works across devices
- **Real-time Updates**: Dynamic loading with scroll-based pagination

## Project Structure

The project consists of several HTML template files and a main Google Apps Script file:

- [`Code.gs`](Code.gs) - Main Google Apps Script backend with Gmail API integration
- [`index.html`](index.html) - Main application interface and layout
- [`scripts.html`](scripts.html) - JavaScript functionality for the frontend
- [`styles.html`](styles.html) - CSS styling for the application
- [`toolbar.html`](toolbar.html) - Navigation and filtering toolbar
- [`reply-box.html`](reply-box.html) - Email composition interface
- [`thread-body.html`](thread-body.html) - Email thread display template

## Setup Instructions

### Prerequisites

- A Google account with Gmail access
- Access to Google Apps Script (script.google.com)

### Installation

1. **Create a new Google Apps Script project**:
   - Go to [script.google.com](https://script.google.com)
   - Click "New Project"

2. **Upload the project files**:
   - Replace the default `Code.gs` with the contents of [`Code.gs`](Code.gs)
   - Add each HTML file as an HTML file in the Apps Script editor:
     - [`index.html`](index.html)
     - [`scripts.html`](scripts.html)
     - [`styles.html`](styles.html)
     - [`toolbar.html`](toolbar.html)
     - [`reply-box.html`](reply-box.html)
     - [`thread-body.html`](thread-body.html)

3. **Enable Gmail API**:
   - In the Apps Script editor, go to "Services" in the left sidebar
   - Add the Gmail API service

4. **Deploy as Web App**:
   - Click "Deploy" → "New Deployment"
   - Choose "Web app" as the type
   - Set execute permissions as needed
   - Deploy and copy the web app URL

## Usage

### Accessing the Application

Once deployed, access your Gmail Manager through the web app URL provided by Google Apps Script.

### Managing Emails

- **View Threads**: Emails are displayed in a table format with automatic pagination
- **Filter Emails**: Use the toolbar to filter between different email categories
- **Reply to Emails**: Click the reply button to compose responses
- **Scroll Loading**: Scroll down to automatically load more email threads

### Code Examples

The application uses Google Apps Script's Gmail service. Here's how threads are retrieved:

```javascript
function getThreads(page, filter = "primary") {
  var PAGE_SIZE = 10;
  var startIndex = page * PAGE_SIZE;
  var searchQuery = "";

  if (filter === "all") {
    searchQuery = "in:all -in:scheduled -in:trash -in:sent";
  } else {
    searchQuery = "category:primary";
  }

  var threads = GmailApp.search(searchQuery, startIndex, PAGE_SIZE);
  // Process threads...
}
```

## Development

### File Organization

The project follows a modular approach where each HTML file serves a specific purpose:

- **Templates**: HTML files act as templates that are included in the main interface
- **Separation of Concerns**: Styles, scripts, and components are separated into different files
- **Google Apps Script Integration**: The [`Code.gs`](Code.gs) file handles all backend Gmail operations

### Customization

You can customize the application by:

- Modifying the CSS in [`styles.html`](styles.html)
- Adjusting the JavaScript functionality in [`scripts.html`](scripts.html)
- Changing the layout in [`index.html`](index.html)
- Adding new features to [`Code.gs`](Code.gs)

## Security Considerations

- The application requires Gmail access permissions
- All email content is processed through Google's secure Apps Script environment
- No email data is stored outside of Google's infrastructure

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly in the Google Apps Script environment
5. Submit a pull request

## License

This project is open source. Please check the repository for license details.

## Support

For issues or questions:
- Check the Google Apps Script documentation
- Review the Gmail API documentation
- Open an issue in this repository