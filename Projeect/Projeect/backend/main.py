"""
LifeLink Backend API Server (FastAPI + WebSockets + AI Models)
Specification 45: Complete RESTful and Real-Time Endpoints
"""

from fastapi import FastAPI, WebSocket, WebSocketDisconnect, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
import datetime
import uuid
import json

app = FastAPI(
    title="LifeLink API Server",
    description="Emergency Response, Smart Hospital & E-Hospital Management API",
    version="2.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------------------------------------
# WebSocket Connection Manager for 3-Second GPS & Dispatches
# ---------------------------------------------------------
class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)

    async def broadcast(self, message: dict):
        for connection in self.active_connections:
            try:
                await connection.send_json(message)
            except Exception:
                pass

manager = ConnectionManager()

# ---------------------------------------------------------
# In-Memory Real-Time Seed Store (Mirrored across endpoints)
# ---------------------------------------------------------
hospitals_db = [
    {
        "id": "hosp-1",
        "name": "Metro Health Academic Medical Center",
        "address": "450 University Ave, Metro City Downtown",
        "totalBeds": 180,
        "availableBeds": 28,
        "icuBedsAvailable": 5,
        "erBedsAvailable": 8,
        "currentLoadPercent": 68,
        "estimatedWaitMinutes": 8,
        "hasTraumaCenterLevel1": True,
        "contactNumber": "+1 (555) 911-0001"
    }
]

ambulances_db = [
    {
        "id": "amb-1",
        "plateNumber": "MED-9104",
        "callSign": "Rescue Alpha-1",
        "type": "ALS (Advanced Life Support)",
        "driverName": "David Rodriguez",
        "status": "AVAILABLE",
        "latitude": 37.7780,
        "longitude": -122.4160,
        "speedKmh": 0,
        "fuelPercent": 92
    }
]

medicines_db = [
    {
        "id": "med-01",
        "name": "Aspirin 325mg (Chewable)",
        "category": "Cardiac",
        "quantity": 340,
        "minQuantity": 100,
        "batchNumber": "ASP-2026-B88",
        "expiryDate": "2027-12-31",
        "price": 12.50,
        "location": "Rack A-12"
    },
    {
        "id": "med-02",
        "name": "IV Heparin Sodium 5000 IU/ml",
        "category": "Cardiac",
        "quantity": 45,
        "minQuantity": 50,
        "batchNumber": "HEP-990-21",
        "expiryDate": "2027-08-15",
        "price": 48.00,
        "location": "Vault C-02"
    }
]

appointments_db = []
emergencies_db = []

# ---------------------------------------------------------
# Request/Response Schemas
# ---------------------------------------------------------
class LoginRequest(BaseModel):
    email: str
    password: Optional[str] = "demo123"
    role: Optional[str] = "PATIENT"

class OtpVerifyRequest(BaseModel):
    phone: str
    otp: str

class LocationPayload(BaseModel):
    latitude: float
    longitude: float
    speedKmh: Optional[int] = 0
    heading: Optional[int] = 0

class VitalsSchema(BaseModel):
    heartRate: int = 80
    spO2: int = 98
    bloodPressureSys: int = 120
    bloodPressureDia: int = 80
    temperature: float = 98.6

class EmergencyCreateSchema(BaseModel):
    patientId: str = "usr-patient-1"
    patientName: str = "Alex Mercer"
    patientPhone: str = "+1 (555) 234-8901"
    latitude: float = 37.7725
    longitude: float = -122.4140
    pickupAddress: str = "824 Market St, Downtown Metro"
    symptoms: List[str]
    symptomNotes: Optional[str] = ""
    vitals: Optional[VitalsSchema] = None

class AppointmentCreateSchema(BaseModel):
    patientId: str
    patientName: str
    hospitalId: str
    hospitalName: str
    doctorName: str
    department: str
    date: str
    timeSlot: str
    consultationType: Optional[str] = "IN_PERSON"
    reason: Optional[str] = "Specialist checkup"

class MedicineSchema(BaseModel):
    name: str
    category: str
    quantity: int
    minQuantity: int
    batchNumber: str
    expiryDate: str
    supplier: str
    price: float
    location: str

# ---------------------------------------------------------
# Authentication Endpoints
# ---------------------------------------------------------
@app.post("/auth/login")
def login(req: LoginRequest):
    return {
        "accessToken": f"jwt-mock-token-{uuid.uuid4().hex[:12]}",
        "tokenType": "Bearer",
        "user": {
            "email": req.email,
            "role": req.role,
            "name": req.email.split("@")[0].title()
        }
    }

@app.post("/auth/logout")
def logout():
    return {"message": "Logged out successfully"}

@app.post("/auth/otp/request")
def request_otp(phone: str):
    return {"status": "sent", "demoOtp": "123456", "phone": phone}

@app.post("/auth/otp/verify")
def verify_otp(req: OtpVerifyRequest):
    if req.otp == "123456" or len(req.otp) == 6:
        return {"verified": True, "token": "otp-verified-session-token"}
    raise HTTPException(status_code=400, detail="Invalid OTP code. Use demo code 123456.")

# ---------------------------------------------------------
# Patient Endpoints
# ---------------------------------------------------------
@app.get("/patients/me")
def get_patient_profile():
    return {
        "id": "usr-patient-1",
        "name": "Alex Mercer",
        "age": 34,
        "bloodGroup": "O+",
        "allergies": ["Penicillin", "Shellfish"],
        "medicalConditions": ["Mild Hypertension"],
        "emergencyContact": "Sarah Mercer (+1 555 987-6543)",
        "insurance": "BlueCross BlueShield (#BC-99042)"
    }

@app.get("/patients/me/records")
def get_patient_records():
    return {
        "prescriptions": [
            {"medicine": "Amlodipine 5mg", "frequency": "1-0-0", "duration": "90 Days", "doctor": "Dr. Marcus Chen"}
        ],
        "labReports": [
            {"testName": "Comprehensive Lipid Panel", "status": "COMPLETED", "date": "2026-06-14"}
        ],
        "invoices": [
            {"invoiceNumber": "INV-2026-0982", "totalCost": 825.00, "patientPayable": 82.50, "status": "PAID"}
        ]
    }

# ---------------------------------------------------------
# Hospital Endpoints
# ---------------------------------------------------------
@app.get("/hospitals")
def list_hospitals():
    return hospitals_db

@app.get("/hospitals/{hospital_id}")
def get_hospital(hospital_id: str):
    match = next((h for h in hospitals_db if h["id"] == hospital_id), None)
    if not match:
        return hospitals_db[0]
    return match

@app.get("/hospitals/{hospital_id}/availability")
def get_hospital_availability(hospital_id: str):
    return {
        "hospitalId": hospital_id,
        "availableBeds": 28,
        "icuBeds": 5,
        "erBeds": 8,
        "estimatedWaitMinutes": 8,
        "smartScore": 96
    }

@app.get("/hospital/beds")
def get_hospital_beds():
    return [
        {"id": "b-icu-101", "number": "ICU-101", "type": "ICU", "status": "AVAILABLE", "floor": "3rd Floor East"},
        {"id": "b-er-201", "number": "ER-BAY-1", "type": "ER_TRAUMA", "status": "AVAILABLE", "floor": "1st Floor ER"},
        {"id": "b-gen-301", "number": "GW-301", "type": "GENERAL_WARD", "status": "AVAILABLE", "floor": "2nd Floor"},
        {"id": "b-iso-501", "number": "ISO-501", "type": "ISOLATION", "status": "AVAILABLE", "floor": "5th Floor"}
    ]

@app.patch("/hospital/beds/{bed_id}")
async def update_bed_status(bed_id: str, payload: Dict[str, str]):
    new_status = payload.get("status", "AVAILABLE")
    await manager.broadcast({
        "type": "BED_STATUS_UPDATED",
        "bedId": bed_id,
        "status": new_status
    })
    return {"success": True, "bedId": bed_id, "status": new_status}

@app.get("/hospital/medicines")
def get_medicines():
    return medicines_db

@app.post("/hospital/medicines")
def create_medicine(med: MedicineSchema):
    new_item = med.dict()
    new_item["id"] = f"med-{uuid.uuid4().hex[:6]}"
    medicines_db.append(new_item)
    return new_item

@app.patch("/hospital/medicines/{medicine_id}")
def update_medicine_stock(medicine_id: str, payload: Dict[str, int]):
    match = next((m for m in medicines_db if m["id"] == medicine_id), None)
    if match:
        match["quantity"] = payload.get("quantity", match["quantity"])
        return match
    return {"error": "Not found"}

# ---------------------------------------------------------
# Appointments Endpoints
# ---------------------------------------------------------
@app.post("/appointments")
async def create_appointment(req: AppointmentCreateSchema):
    token_num = f"#Q-{len(appointments_db) + 14}"
    apt = {
        "id": f"apt-{uuid.uuid4().hex[:8]}",
        "queueToken": token_num,
        "patientId": req.patientId,
        "patientName": req.patientName,
        "hospitalName": req.hospitalName,
        "doctorName": req.doctorName,
        "department": req.department,
        "dateTime": f"{req.date} at {req.timeSlot}",
        "status": "CONFIRMED"
    }
    appointments_db.append(apt)
    return apt

@app.get("/appointments")
def list_appointments():
    return appointments_db

# ---------------------------------------------------------
# Emergency & Ambulance Dispatch Endpoints
# ---------------------------------------------------------
@app.post("/emergency")
async def create_emergency(req: EmergencyCreateSchema):
    emg_id = f"EMG-{uuid.uuid4().hex[:6].upper()}"
    emg = {
        "id": emg_id,
        "patientName": req.patientName,
        "pickupAddress": req.pickupAddress,
        "symptoms": req.symptoms,
        "severity": "CRITICAL" if any(s.lower() in ["chest pain", "unconscious"] for s in req.symptoms) else "URGENT",
        "status": "DISPATCHING",
        "assignedAmbulance": "Rescue Alpha-1",
        "destinationHospital": "Metro Health Academic Medical Center",
        "etaMinutes": 5
    }
    emergencies_db.append(emg)
    await manager.broadcast({"type": "NEW_EMERGENCY", "data": emg})
    return emg

@app.post("/emergency/{emergency_id}/dispatch")
async def dispatch_emergency(emergency_id: str, ambulance_id: str):
    await manager.broadcast({
        "type": "AMBULANCE_DISPATCHED",
        "emergencyId": emergency_id,
        "ambulanceId": ambulance_id
    })
    return {"status": "DISPATCHED", "emergencyId": emergency_id}

@app.patch("/emergency/{emergency_id}/status")
async def update_emergency_status(emergency_id: str, payload: Dict[str, str]):
    new_status = payload.get("status", "EN_ROUTE")
    await manager.broadcast({
        "type": "EMERGENCY_STATUS_UPDATE",
        "emergencyId": emergency_id,
        "status": new_status
    })
    return {"emergencyId": emergency_id, "status": new_status}

@app.post("/ambulances/{ambulance_id}/location")
async def update_ambulance_location(ambulance_id: str, loc: LocationPayload):
    payload = {
        "type": "GPS_LOCATION_UPDATE",
        "ambulanceId": ambulance_id,
        "latitude": loc.latitude,
        "longitude": loc.longitude,
        "speedKmh": loc.speedKmh
    }
    await manager.broadcast(payload)
    return payload

@app.get("/ambulances")
def list_ambulances():
    return ambulances_db

# ---------------------------------------------------------
# Admin Endpoints
# ---------------------------------------------------------
@app.get("/admin/analytics")
def get_admin_analytics():
    return {
        "avgResponseTimeMinutes": 5.2,
        "activeEmergencies": len(emergencies_db),
        "totalAmbulances": len(ambulances_db),
        "totalBeds": 180,
        "availableBeds": 28,
        "systemHealth": "99.98%"
    }

@app.get("/admin/users")
def get_admin_users():
    return [
        {"id": "usr-1", "name": "Alex Mercer", "role": "PATIENT", "status": "ACTIVE"},
        {"id": "usr-2", "name": "Dr. Sarah Vance", "role": "HOSPITAL_ADMIN", "status": "ACTIVE"},
        {"id": "usr-3", "name": "David Rodriguez", "role": "AMBULANCE_DRIVER", "status": "ACTIVE"}
    ]

# ---------------------------------------------------------
# WebSocket Broadcast Hub
# ---------------------------------------------------------
@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            data = await websocket.receive_text()
            message = json.loads(data)
            await manager.broadcast(message)
    except WebSocketDisconnect:
        manager.disconnect(websocket)
    except Exception:
        manager.disconnect(websocket)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
