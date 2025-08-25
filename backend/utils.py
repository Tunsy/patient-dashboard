import re
import csv
import phonenumbers
from phonenumbers import PhoneNumberFormat
from email_validator import validate_email, EmailNotValidError
from typing import Optional
from dateutil.parser import parse

def clean_text(text: Optional[str]) -> Optional[str]:
    if not text or not text.strip():
        return None
    return text.strip().title()

def normalize_date(date_str: Optional[str]) -> Optional[str]:
    if not date_str or not date_str.strip():
        return None
    try:
        return parse(date_str.strip()).strftime('%Y-%m-%d')
    except Exception:
        return None

def normalize_phone(phone: Optional[str]) -> Optional[str]:
    if not phone:
        return None

    s = phone.strip()
    try:
        parsed_number = phonenumbers.parse(phone, "US")
        if phonenumbers.is_possible_number(parsed_number):
            return phonenumbers.format_number(parsed_number, phonenumbers.PhoneNumberFormat.E164)
        else:
            return None
    except Exception:
        return None

def normalize_email(email: Optional[str]) -> Optional[str]:
    if not email:
        return None
    
    s = email.strip()    
    try:
        v = validate_email(s, allow_smtputf8=True)
        local = v.local_part
        domain = v.domain
        email = f"{local.lower()}@{domain.lower()}"
        return email
    except Exception:
        return None