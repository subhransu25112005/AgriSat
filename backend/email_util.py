import os
import smtplib
from email.mime.text import MIMEText

def send_otp_email(to_email: str, otp_code: str):
    host = os.getenv("EMAIL_HOST")
    port = os.getenv("EMAIL_PORT", "587")
    user = os.getenv("EMAIL_USER")
    password = os.getenv("EMAIL_PASS")
    
    if not host or not user or not password:
        print(f"📧 [FALLBACK/MOCK] EMAIL_HOST not configured. OTP for {to_email} is: {otp_code}")
        return
        
    try:
        msg = MIMEText(f"Your AgriSat Verification Code is: {otp_code}\n\nThis code will expire in 5 minutes.")
        msg["Subject"] = "AgriSat OTP Verification"
        msg["From"] = user
        msg["To"] = to_email
        
        server = smtplib.SMTP(host, int(port))
        server.starttls()
        server.login(user, password)
        server.send_message(msg)
        server.quit()
        print(f"📧 [SMTP] Real email securely dispatched to {to_email}")
    except Exception as e:
        print(f"❌ [SMTP ERROR] Failed to send email to {to_email}. Error: {e}")
        print(f"📧 [FALLBACK/MOCK] OTP for {to_email} is: {otp_code}")
