import smtplib
from email.mime.text import MIMEText
from config import EMAIL, PASSWORD

SMTP_SERVER = 'smtp.gmail.com'
SMTP_PORT = 465

with smtplib.SMTP_SSL(SMTP_SERVER, SMTP_PORT) as server:
    server.login(EMAIL, PASSWORD)
    msg = MIMEText("Test email body")
    msg["From"] = EMAIL
    msg["To"] = EMAIL  # Send to yourself for testing
    msg["Subject"] = "Test Email"
    server.sendmail(EMAIL, EMAIL, msg.as_string())
    print("Email sent successfully!")
