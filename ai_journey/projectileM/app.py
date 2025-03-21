from fastapi import FastAPI, Request
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from joblib import load
import os
from pydantic import BaseModel

app = FastAPI()

# Serve static files (HTML, CSS, JS)
app.mount("/static", StaticFiles(directory="static"), name="static")
templates = Jinja2Templates(directory="templates")

# Load both models
model_projectile = load("projectile_model.joblib")
model_optimal_angle = load("optimal_angle.joblib")

@app.get("/")
async def home(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})


# Define the input structure using Pydantic
class PredictionInput(BaseModel):
    velocity: float
    angle: float
    range: float = None  # Optional range, default to None

@app.post("/predict")
async def predict(input_data: PredictionInput):
    velocity = input_data.velocity
    angle = input_data.angle
    range_value = input_data.range

    # Predict if projectile exceeds 30 meters
    prediction_projectile = model_projectile.predict([[velocity, angle]])[0]
    projectile_result = ">30m" if prediction_projectile == 1 else "≤30m"
    
    # If a range is provided, predict the optimal angle
    if range_value is not None:
        optimal_angle = model_optimal_angle.predict([[velocity, range_value]])[0]
        return {"prediction": f"Optimal Angle: {optimal_angle}°"}
    
    return {"prediction": projectile_result}

