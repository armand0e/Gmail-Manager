import imaplib
import email
from email.header import decode_header
import openpyxl
from config import EMAIL, PASSWORD

# IMAP Configuration
IMAP_SERVER = 'imap.gmail.com'

def fetch_emails():
    mail = imaplib.IMAP4_SSL(IMAP_SERVER)
    mail.login(EMAIL, PASSWORD)
    mail.select("inbox")

    status, messages = mail.search(None, "UNSEEN")  # Get unread emails
    email_ids = messages[0].split()

    email_list = []
    for e_id in email_ids:
        _, msg_data = mail.fetch(e_id, "(RFC822)")
        for response_part in msg_data:
            if isinstance(response_part, tuple):
                msg = email.message_from_bytes(response_part[1])

                # Decode email fields
                subject, encoding = decode_header(msg["Subject"])[0]
                subject = subject.decode(encoding) if encoding else subject
                sender = msg.get("From")
                body = ""

                # Extract email body
                if msg.is_multipart():
                    for part in msg.walk():
                        if part.get_content_type() == "text/plain":
                            body = part.get_payload(decode=True).decode()
                else:
                    body = msg.get_payload(decode=True).decode()

                email_list.append((sender, subject, body))
    mail.logout()
    return email_list

def save_to_excel(emails, filename="emails.xlsx"):
    wb = openpyxl.Workbook()
    ws = wb.active
    ws.title = "Emails"
    ws.append(["Sender", "Subject", "Body", "Reply"])  # Headers

    for email_data in emails:
        ws.append(list(email_data) + [""])  # Add Reply column as blank
    wb.save(filename)
    print(f"Saved emails to {filename}")

# Example usage
emails = fetch_emails()
save_to_excel(emails)
