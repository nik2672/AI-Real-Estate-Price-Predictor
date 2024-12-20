# neural.py

import pandas as pd
import numpy as np
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, BatchNormalization, Dropout
from tensorflow.keras.optimizers import Adam
from sklearn.preprocessing import StandardScaler
import os

data = pd.read_csv('data.csv', encoding='utf-8')#load our dataset from data.csv

Q1 = data['Price'].quantile(0.25)#remove outliers using the price colummn 
Q3 = data['Price'].quantile(0.75)
IQR = Q3 - Q1
low = Q1 - 1.5 * IQR
high = Q3 + 1.5 * IQR
data = data[(data['Price'] >= low) & (data['Price'] <= high)]
# one hot encode the 'Type' column
data = pd.get_dummies(data, columns=['Type'], drop_first=True)

X = data.drop('Price', axis=1)#data frameexcept for the price column, axis 1 indicating read colummn and not rows 
y = data['Price']#contians only the 'price column with y being the target vairbale 

scaler_X = StandardScaler().fit(X)#standard scalar class helpstadardise features so the features will have mean of 0 and std of 1 
scaler_y = StandardScaler().fit(y.values.reshape(-1, 1))

# creating our model structure with three layers hidden layers 128,64,32 using sequantial in keras lib  
model = Sequential([
    Dense(128, input_dim=X.shape[1], activation='relu'),
    BatchNormalization(),
    Dropout(0.1),
    Dense(64, activation='relu'),
    BatchNormalization(),
    Dropout(0.1),
    Dense(32, activation='relu'),
    BatchNormalization(),
    Dropout(0.1),
    Dense(1, activation='linear')
])
model.compile(optimizer=Adam(learning_rate=0.0001), loss='mean_squared_error')#uses adam optimizer and adjusting hyper peramerter (learning rate)using MSE to measure perfromance

#  train and save the model weights, model will also train over 200 epohs, with each batchsize of 32
def neural_model_train_and_save():
    print("Training the model...")
    model.fit(scaler_X.transform(X), scaler_y.transform(y.values.reshape(-1, 1)), epochs=200, batch_size=32, validation_split=0.2)
    model.save_weights("neural_model.weights.h5")
    print("Neural model has been trained and are weights saved")

# load weights if available present otherwise train and save the weights, we used os as we had issues with finding files when testing 
def load_or_train_model():
    if os.path.exists("neural_model.weights.h5"):
        model.load_weights("neural_model.weights.h5")
        print("Neural weights have been loaded.")
    else:
        neural_model_train_and_save()
# calling above function ensuring weights are either loaded or trained 
load_or_train_model()

# our prediction function taking input features 
def predict_price(rooms, house_type, postcode, distance):
    # prep input data 
    input_data = pd.DataFrame([[rooms, postcode, distance]], columns=['Rooms', 'Postcode', 'Distance'])
    
    # onehot encoding for the 'Type' field
    if house_type == 't':  # Townhouse
        input_data['Type_t'] = 1
        input_data['Type_u'] = 0
    elif house_type == 'u':  # Unit
        input_data['Type_t'] = 0
        input_data['Type_u'] = 1
    else:  # Default to house
        input_data['Type_t'] = 0
        input_data['Type_u'] = 0

    # ensure our input data has the same structure as training data
    for col in X.columns:
        if col not in input_data.columns:
            input_data[col] = 0
    input_data = input_data[X.columns]  # reoordered columns for consistency

    # scaling the  input data
    input_data_scaled = scaler_X.transform(input_data)
    
    # create a prediction
    scaled_prediction = model.predict(input_data_scaled)
    
    # convering  the scaled prediction back to original price scale
    predicted_price = scaler_y.inverse_transform(scaled_prediction)[0][0]
    
    return predicted_price #predicted price sometiems has traling values for example $1,344,232.223, front end ensures it is $1,344,232.23 done in predictionpage.js 
