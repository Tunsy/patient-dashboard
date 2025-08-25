import strawberry
import uuid
import csv
import io
import base64
import traceback
from typing import List, Optional
from sqlalchemy.orm import Session, joinedload
from database import get_db
from models import Patient, Appointment
from utils import clean_text, normalize_date, normalize_phone, normalize_email

@strawberry.type
class AppointmentType:
    id: str
    appointment_date: Optional[str]
    appointment_type: Optional[str]

@strawberry.type
class PatientType:
    id: str
    first_name: Optional[str]
    last_name: Optional[str]
    dob: Optional[str]
    email: Optional[str]
    phone: Optional[str]
    address: Optional[str]
    appointments: List[AppointmentType]

@strawberry.type
class Query:
    @strawberry.field
    def patients(self) -> List[PatientType]:
        db: Session = next(get_db())
        patients = db.query(Patient).options(joinedload(Patient.appointments)).all()
        db.close()
        return patients

    @strawberry.field
    def appointments(self) -> List[AppointmentType]:
        db: Session = next(get_db())
        appointments = db.query(Appointment).all()
        db.close()
        return appointments

    @strawberry.field
    def patient(self, id: str) -> Optional[PatientType]:
        db: Session = next(get_db())
        patient = db.query(Patient).options(joinedload(Patient.appointments)).filter(Patient.id == id).first()
        db.close()
        return patient


@strawberry.type
class Mutation:
    @strawberry.mutation
    def ingest_csv_data(self, csv_data: str) -> str:
        db: Session = next(get_db())
        seen = {}

        try:
            decoded_csv = base64.b64decode(csv_data).decode('utf-8')
            csv_file = io.StringIO(decoded_csv)
            reader = csv.DictReader(csv_file)
            patient = None

            for row in reader:
                patient_id = row.get('patient_id')

                if patient_id in seen:
                    patient = seen[patient_id]
                else:
                    patient = db.query(Patient).filter(Patient.patient_id == patient_id).first()
                

                if not patient:
                    patient = Patient(
                        id=str(uuid.uuid4()),
                        patient_id=patient_id,
                        first_name=clean_text(row.get('first_name')),
                        last_name=clean_text(row.get('last_name')),
                        dob=normalize_date(row.get('dob')),
                        email=normalize_email(row.get('email')),
                        phone=normalize_phone(row.get('phone')),
                        address=clean_text(row.get('address', ''))
                    )
                    db.add(patient)
                    seen[patient_id] = patient

                if row.get('appointment_id'):
                    appointment = Appointment(
                        id=str(uuid.uuid4()),
                        patient_id=patient.id,
                        appointment_date=normalize_date(row.get('appointment_date')),
                        appointment_type=clean_text(row.get('appointment_type'))
                    )
                    db.add(appointment)
            
            db.commit()
            return "Data successfully ingested."
        except Exception as e:
            db.rollback()
            return f"An error occurred on the server: {e}"
        finally:
            db.close()