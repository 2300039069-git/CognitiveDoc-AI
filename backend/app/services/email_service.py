import smtplib
import logging
from email.message import EmailMessage
from email.utils import formatdate, make_msgid
from app.core.config import SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD, SMTP_FROM_NAME, RESEND_API_KEY

logger = logging.getLogger(__name__)

def _dispatch_email(clean_to: str, subject: str, plain_text: str, html_content: str, code: str) -> bool:
    """
    Dispatches transactional OTP emails using Resend API (Primary) with Google SMTP backup.
    """
    # 1. Tier 1: Resend Transactional HTTPS API (Cloud-native Port 443)
    if RESEND_API_KEY:
        try:
            import resend
            resend.api_key = RESEND_API_KEY
            r = resend.Emails.send({
                "from": "CognitiveDoc AI <onboarding@resend.dev>",
                "to": clean_to,
                "subject": subject,
                "html": html_content,
                "text": plain_text
            })
            logger.info(f"Email dispatched via Resend API to {clean_to}: {r}")
            print(f"\n[RESEND API SENT] >>> Dispatched OTP email via Resend to {clean_to}\n")
            return True
        except Exception as e:
            logger.warning(f"Resend API dispatch notice for {clean_to}: {e}. Retrying via SMTP...")

    # 2. Tier 2: Gmail SMTP STARTTLS on Port 587 (Backup)
    if SMTP_USER and SMTP_PASSWORD:
        try:
            msg = EmailMessage()
            msg["Subject"] = subject
            msg["From"] = f"{SMTP_FROM_NAME} <{SMTP_USER}>"
            msg["To"] = clean_to
            msg["Reply-To"] = SMTP_USER
            msg["Date"] = formatdate(localtime=True)
            msg["Message-ID"] = make_msgid(domain="gmail.com")
            
            msg["Auto-Submitted"] = "auto-generated"
            msg["X-Auto-Response-Suppress"] = "All"
            msg["X-Priority"] = "3"
            msg["Importance"] = "normal"

            msg.set_content(plain_text)
            msg.add_alternative(html_content, subtype="html")

            with smtplib.SMTP(SMTP_HOST or "smtp.gmail.com", SMTP_PORT or 587, timeout=6) as server:
                server.starttls()
                server.login(SMTP_USER, SMTP_PASSWORD)
                server.send_message(msg)
            
            logger.info(f"OTP email dispatched via Gmail SMTP TLS (587) to {clean_to}")
            print(f"\n[GMAIL TLS SENT] >>> Dispatched OTP email to {clean_to}\n")
            return True
        except Exception as e:
            logger.warning(f"Gmail TLS 587 failed for {clean_to}: {str(e)}")

    print(f"\n[EMAIL DISPATCH NOTICE] Handled dispatch for {clean_to}\n")
    return False

def send_registration_otp_email(to_email: str, full_name: str, code: str) -> bool:
    clean_to = to_email.strip().lower()
    subject = f"CognitiveDoc verification code: {code}"
    
    plain_text = f"""Hello {full_name or 'there'},

Your CognitiveDoc verification code is: {code}

Enter this 6-digit code on the registration page to activate your account. This code is valid for 30 minutes.

If you did not request this code, please ignore this email.

Thanks,
The CognitiveDoc Team
"""

    html_content = f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>CognitiveDoc Code</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f9fafb; color: #1f2937; margin: 0; padding: 24px 12px; line-height: 1.5;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" align="center" style="max-width: 480px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.05); overflow: hidden;">
    <tr>
      <td style="padding: 32px 24px; text-align: left;">
        <div style="font-size: 20px; font-weight: 700; color: #0284c7; margin-bottom: 20px;">
          CognitiveDoc<span style="color: #0369a1;">.AI</span>
        </div>
        
        <p style="font-size: 15px; color: #1f2937; margin: 0 0 16px 0;">
          Hello <strong>{full_name or 'there'}</strong>,
        </p>
        
        <p style="font-size: 14px; color: #4b5563; margin: 0 0 20px 0;">
          Use the 6-digit code below to verify your email address and activate your CognitiveDoc account:
        </p>
        
        <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 16px; text-align: center; margin: 0 0 20px 0;">
          <span style="font-size: 32px; font-weight: 700; letter-spacing: 6px; color: #15803d; font-family: monospace; display: block;">
            {code}
          </span>
          <span style="font-size: 11px; color: #166534; margin-top: 4px; display: block;">
            Valid for 30 minutes
          </span>
        </div>
        
        <p style="font-size: 13px; color: #6b7280; margin: 0 0 20px 0;">
          If you didn't create a CognitiveDoc account, you can safely ignore this email.
        </p>
        
        <hr style="border: none; border-top: 1px solid #f3f4f6; margin: 24px 0 16px 0;">
        
        <p style="font-size: 11px; color: #9ca3af; margin: 0;">
          CognitiveDoc Enterprise Intelligence &bull; Automated Document Processing
        </p>
      </td>
    </tr>
  </table>
</body>
</html>"""

    return _dispatch_email(clean_to, subject, plain_text, html_content, code)

def send_password_reset_email(to_email: str, code: str) -> bool:
    clean_to = to_email.strip().lower()
    subject = f"CognitiveDoc password reset code: {code}"
    
    plain_text = f"""Hello,

We received a request to reset your CognitiveDoc account password.

Your 6-digit password reset code is: {code}

This code is valid for 30 minutes. Enter this code on the password reset page to update your password.

If you didn't request a password reset, you can safely ignore this email.

Thanks,
The CognitiveDoc Team
"""

    html_content = f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>CognitiveDoc Password Reset</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f9fafb; color: #1f2937; margin: 0; padding: 24px 12px; line-height: 1.5;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" align="center" style="max-width: 480px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.05); overflow: hidden;">
    <tr>
      <td style="padding: 32px 24px; text-align: left;">
        <div style="font-size: 20px; font-weight: 700; color: #0284c7; margin-bottom: 20px;">
          CognitiveDoc<span style="color: #0369a1;">.AI</span>
        </div>
        
        <p style="font-size: 15px; color: #1f2937; margin: 0 0 16px 0;">
          Hello,
        </p>
        
        <p style="font-size: 14px; color: #4b5563; margin: 0 0 20px 0;">
          We received a request to reset the password for your CognitiveDoc account. Enter the 6-digit code below:
        </p>
        
        <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 16px; text-align: center; margin: 0 0 20px 0;">
          <span style="font-size: 32px; font-weight: 700; letter-spacing: 6px; color: #15803d; font-family: monospace; display: block;">
            {code}
          </span>
          <span style="font-size: 11px; color: #166534; margin-top: 4px; display: block;">
            Valid for 30 minutes
          </span>
        </div>
        
        <p style="font-size: 13px; color: #6b7280; margin: 0 0 20px 0;">
          If you didn't request a password reset, your account is safe and you can safely ignore this email.
        </p>
        
        <hr style="border: none; border-top: 1px solid #f3f4f6; margin: 24px 0 16px 0;">
        
        <p style="font-size: 11px; color: #9ca3af; margin: 0;">
          CognitiveDoc Enterprise Intelligence &bull; Automated Document Processing
        </p>
      </td>
    </tr>
  </table>
</body>
</html>"""

    return _dispatch_email(clean_to, subject, plain_text, html_content, code)
