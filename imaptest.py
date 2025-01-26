import imaplib
from config import EMAIL, PASSWORD

IMAP_SERVER = 'imap.gmail.com'
IMAP_PORT = 993

mail = imaplib.IMAP4_SSL(IMAP_SERVER, IMAP_PORT)
mail.login(EMAIL, PASSWORD)
mail.select("inbox")
status, messages = mail.search(None, "ALL")
print(f"Total messages: {len(messages[0].split())}")
mail.logout()
