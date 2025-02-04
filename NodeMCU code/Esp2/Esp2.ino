#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <ArduinoJson.h>
#include <Servo.h>
#include <LiquidCrystal_I2C.h>
#include <DHT.h>
#include <DHT_U.h>


#define DHT_PIN D8          
#define DHT_TYPE DHT11     
#define RAIN_SENSOR_PIN A0 

DHT dht(DHT_PIN, DHT_TYPE);

float temperature = 0.0;            
const float TEMP_THRESHOLD = 30.0; 
int rainThreshold = 1024;           

const char* ssid = "alienware D5";
const char* password = "9999oooo";
const char* serverUrl = "http://192.168.32.132:8080/api/relays/";

const int LED_PIN = D7;         
const int AC_PIN = D3;         
const int FAN_PIN = D4;         
const int LED2 = D5;           
const int DOOR_SERVO_PIN = D6;  
const int CLOTH_PDATA = D0;


Servo clothServo;
Servo doorServo;                     
LiquidCrystal_I2C lcd(0x3F, 16, 2);  


bool relayStates[] = { HIGH, HIGH, HIGH, HIGH };            
const int relayPins[] = { LED_PIN, AC_PIN, FAN_PIN, LED2 }; 
bool manualControl[] = { 0, 0, 0, 0 };                       


String enteredPassword = "";             
const String correctPassword = "22222";  

WiFiClient client;

static bool isKeypadActive = false; 
bool currentACState = false;         
bool currentClothState = false;     

void setup() {
  Serial.begin(9600);

 
  for (int i = 0; i < 4; i++) {
    pinMode(relayPins[i], OUTPUT);
    digitalWrite(relayPins[i], HIGH); 
  }

  dht.begin();

  doorServo.attach(DOOR_SERVO_PIN);
  doorServo.write(0);  

  clothServo.attach(CLOTH_PDATA);
  clothServo.write(0);

  lcd.begin();
  lcd.backlight();
  lcd.clear();

  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Connecting to WiFi...");
  }

  Serial.println("Connected to WiFi");
  lcd.print("WiFi Connected");
  delay(2000);
  lcd.clear();
}

void loop() {
  if (Serial.available() > 0) {
    isKeypadActive = true;
    handleESP1Input();
  } else if (!isKeypadActive) {
    fetchWebData();
    monitorTemperature();
    monitorRainSensor();
    sendTemperatureToServer();
  }
}

void handleESP1Input() {
  char receivedChar = Serial.read();

  if (receivedChar == 'C') {
    if (enteredPassword.length() > 0) {
      enteredPassword.remove(enteredPassword.length() - 1); 
    }
  } else if (receivedChar == 'D') {
    enteredPassword = ""; 
  } else if (receivedChar == '#') {
    if (enteredPassword == correctPassword) {
      lcd.clear();
      lcd.print("Access Granted");
      openDoor();
    } else {
      lcd.clear();
      lcd.print("Access Denied");
      delay(2000);
    }
    enteredPassword = ""; 
    isKeypadActive = false;
  } else {
    enteredPassword += receivedChar;
  }

  lcd.clear();
  lcd.print("Enter: ");
  lcd.print(enteredPassword);
}

// Fetch relay states from the server
void fetchWebData() {
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    http.begin(client, serverUrl);

    int httpResponseCode = http.GET();
    if (httpResponseCode > 0) {
      String response = http.getString();
      if (response.length() < 7000) { 
        Serial.println("Relay states fetched successfully");
      }

      
      syncRelays(response);
    } else {
      Serial.println("Error fetching relay states: " + String(httpResponseCode));
    }

    http.end();
  } else {
    Serial.println("WiFi not connected.");
  }
}

void syncRelays(const String& response) {
  StaticJsonDocument<512> doc;

 
  DeserializationError error = deserializeJson(doc, response);
  if (error) {
    Serial.print("JSON parse failed: ");
    Serial.println(error.c_str());
    return;
  }

 
  for (JsonObject obj : doc.as<JsonArray>()) {
    String name = obj["name"];          
    int state = obj["state"];          
    int manual = obj["manualControl"];  

    int relayIndex = getRelayIndex(name); 
    if (relayIndex != -1) {
      
      manualControl[relayIndex] = manual;
      if (manualControl[relayIndex] == 1 || relayStates[relayIndex] != state ) { 
        relayStates[relayIndex] = state;
        digitalWrite(relayPins[relayIndex], state == 1 ? LOW : HIGH);
        Serial.print(name);
        Serial.println(state == 1 ? ": ON" : ": OFF");

      
        lcd.setCursor(0, relayIndex);
        lcd.print(name + ": ");
        lcd.print(state == 1 ? "ON" : "OFF");
      }
    }

    if (currentACState == true && name == "AC") {
      if (state == 0) {
        currentACState = false;
      } else if (state == 1) {
        currentACState = true;
      }
    }
    if (name == "Door") {
      if (state == 1) {
        Serial.println("Web: Opening Door...");
        lcd.clear();
        lcd.print("Web: Door Open");
        doorServo.write(90);  
      } else {
        Serial.println("Web: Closing Door...");
        lcd.clear();
        lcd.print("Web: Door Close");
        doorServo.write(0);  
      }
    }
  }
}

void updateRelayState(const String& name, int state) {
  if (WiFi.status() == WL_CONNECTED) {

    HTTPClient http;
    http.begin(client, "http://192.168.32.132:8080/api/relays/updates");  
    http.addHeader("Content-Type", "application/json");

    StaticJsonDocument<128> doc;
    doc["name"] = name;
    doc["state"] = state;

    String payload;
    serializeJson(doc, payload);

    int httpResponseCode = http.PUT(payload);
    if (httpResponseCode > 0) {
      Serial.println("Relay state updated successfully on the server");
    } else {
      Serial.print("Error updating relay state: ");
      Serial.println(httpResponseCode);
    }
    http.end();
  }
}


void monitorTemperature() {
  temperature = dht.readTemperature();
  if (isnan(temperature)) {
    lcd.clear();
    lcd.print("Sensor Error");
    return;
  }

  lcd.setCursor(0, 3);
  lcd.print("Temp: ");
  Serial.println(temperature);
  lcd.print(" C");

  if (!manualControl[1]) {  
    if (temperature > TEMP_THRESHOLD && !currentACState) {
     
      currentACState = true;
      relayStates[1] = 1;
      digitalWrite(AC_PIN, LOW); 
      Serial.println("AC Turned ON due to high temperature");
     updateRelayState("AC", 1);  
    } else if (temperature <= TEMP_THRESHOLD && currentACState) {
      
      currentACState = false;
      relayStates[1] = 0;
      digitalWrite(AC_PIN, HIGH);  
      Serial.println("AC Turned OFF due to low temperature");
      updateRelayState("AC", 0);  
    }
    lcd.setCursor(10, 3);
    lcd.print("AC: ");
    lcd.print(currentACState ? "ON" : "OFF");
  }
}


void monitorRainSensor() {

  int rainValue = analogRead(RAIN_SENSOR_PIN);  

 
  if (rainValue < rainThreshold && !currentClothState) {
    currentClothState = true;
    clothServo.write(180);  
    Serial.println("Rain detected: Cloth Servo ON");
  } else if (rainValue >= rainThreshold && currentClothState) {
    currentClothState = false;
    clothServo.write(0); 
    Serial.println("No rain: Cloth Servo OFF");
  }
}


void sendTemperatureToServer() {
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    http.begin(client, "http://192.168.32.132:8080/api/relays/temperature");
    http.addHeader("Content-Type", "application/json"); 

    StaticJsonDocument<128> doc;
    doc["temperature"] = temperature; 

    String payload;
    serializeJson(doc, payload);

    int httpResponseCode = http.POST(payload);

    if (httpResponseCode > 0) {
      Serial.println("Temperature sent to server successfully");
      Serial.println("Response Code: " + String(httpResponseCode));
    } else {
      Serial.println("Error in sending temperature to server");
      Serial.println("Response Code: " + String(httpResponseCode));
    }
    http.end();
  }
}


int getRelayIndex(const String& name) {
  if (name == "Light") return 0;
  if (name == "AC") return 1;
  if (name == "Fan") return 2;
  if (name == "LED") return 3;
  return -1;  
}

void openDoor() {
  doorServo.write(90);
  delay(10000);
  doorServo.write(0);
}
