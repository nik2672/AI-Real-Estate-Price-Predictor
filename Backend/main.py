import pandas as pd
from fastapi import FastAPI, HTTPException #import fast api with HTTP exception class used for errors 
from fastapi.middleware.cors import CORSMiddleware#cors origin resouce sharing and security 
from pydantic import BaseModel, validator 
from neural import predict_price, load_or_train_model
import os

app = FastAPI()
origins = ["*"] #create our origin domain to make requests from our frontend which runs on localhoast 3000 * EDIT I CHANGED ORGINS TO * IN INSTEAD OF "HTTPS://LOCALHOST:3000" IN ORDER TO ALLOW ALL FRONTEND ORGIINS 
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # I CHANGED = ORIGINS TO "*"
    allow_credentials=True,
    allow_methods=["*"],#allow all GET, POST PUT or delete options as we have two endpoints using POST and GET 
    allow_headers=["*"],
)

# Load or train the model on startup
try:
    load_or_train_model() #attempts to load the model weights or train neural.py if  
except Exception as e: #catch any errors teh caught exception si assigned to vairbel e for later use 
    raise RuntimeError(f"Error loading neural weights or training the model: {e}")


class PredictionRequest(BaseModel):#takes the basemodel as permaeter and uses pydantic to validate incoming data fields are correct
    Rooms: int#rooms should be an integer 
    Type: str  # "h" for house, "t" for townhouse, "u" for unit
    Postcode: int#postcode should be an integer 
    Distance: float#distance should be a decimal float value 
#input error validation implemented usign @validator, not entirely necessary as input validation is also done in our predictionfourm.js however still implemented to make our validation more securre
    @validator("Rooms")
    def rooms_must_be_valid(cls, v):#rooms hould be between 1 and 7 
        if not (1 <= v <= 7):
         raise ValueError("Rooms should be between 1 and 7")
        return v

    @validator("Type")# type of house should be either house, towhouse or unit
    def type_must_be_valid(cls, v):
        if v not in {"h", "t", "u"}:
           raise ValueError("Type selected must be 'h' (house), 't' (townhouse), or 'u' (unit)")
        return v
    @validator("Postcode")#postcode must be a four digit number 
    def postcode_must_be_valid(cls, v):
        if len(str(v)) != 4:
         raise ValueError("Postcode should be a four digit number")
        return v
    
    @validator("Distance") #distance should be between 1 and 50 kilmeters
    def distance_must_be_within_range(cls, v):
        if not (1 <= v <= 50):
          raise ValueError("Distance must be between 1 and 50 kilometers")
        return v

# our two enpoint POST & GET, /predict for our price prediction based on features and /data for acessing our data.csv 
@app.post("/predict")#
async def predict(data: PredictionRequest):#validate incoming data against the PredictionRequest function above
    try:
        predicted_price = predict_price(data.Rooms, data.Type, data.Postcode, data.Distance) #call the predict function frm neural.py with features inputed by user
        return {"predicted_price": float(predicted_price)} #return the predicted price as a float value inclduign traling decimals 
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))#prediction related erros are raised
    except Exception as e:
        raise HTTPException(status_code=500, detail="unforeseen error ")#unpredicted errros are also raised

# /data endpoint using GET request for our frontend to access our data.csv file (same dataset used to train the model) which is then used to create our three charts 
@app.get("/data")
async def get_data():
    try:
        if not os.path.exists("data.csv"):#checks wheather data.csv file exists in the directory, we used os.path.exists as we had isseus with accessign our data.csv file
            raise FileNotFoundError("Data.csv file not found") #if the data file doesnt exist it will raise an error
        data = pd.read_csv("data.csv")#reads teh dataset into a dataframe and is passed to teh 'data' vairable 
        return data.to_dict(orient="records")#converts the data into a list of dictionaries where keys are used as collumn names 
    except FileNotFoundError as e:#if the file is not readable it will raise an if the file doesnt exist the caught exception is assigned to 'e' variable like the previous endpoint errors
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e: #catch unforseen errors in relation to reading our data.csv file. also raising an HTTPException error.
        
        raise HTTPException(status_code=500, detail="There was an error reading the data file")
