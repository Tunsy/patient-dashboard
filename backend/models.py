from sqlalchemy import create_engine, Column, String, Integer, ForeignKey
from sqlalchemy.orm import sessionmaker, declarative_base, relationship

DATABASE_URL = "sqlite:///./patient_dashboard.db"

engine = create_engine(
    DATABASE_URL, connect_args={"check_same_thread": False}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

class Patient(Base):
    __tablename__ = "patients"
    
    id = Column(String, primary_key=True)
    patient_id = Column(Integer, unique=True, nullable=False, index=True)
    first_name = Column(String)
    last_name = Column(String)
    dob = Column(String)
    email = Column(String)
    phone = Column(String)
    address = Column(String)
    appointments = relationship("Appointment", back_populates="patient")

class Appointment(Base):
    __tablename__ = "appointments"
    
    id = Column(String, primary_key=True)
    patient_id = Column(String, ForeignKey("patients.id"), nullable=False)
    appointment_date = Column(String)
    appointment_type = Column(String)
    patient = relationship("Patient", back_populates="appointments")