#include <WiFiManager.h> // https://github.com/tzapu/WiFiManager
#include <ESP8266HTTPClient.h>

void setup() {
  Serial.begin(115200);
  WiFi.mode(WIFI_STA);
  WiFiManager wm;
  //wm.resetSettings();//reset settings - wipe credentials for testing
  wm.autoConnect("WeMos", "nRF52840"); // password protected ap
  String Temp;
  while (Temp != "WeMos") {
    if (Serial.available()) Temp = Serial.readString();
    delay(1000);
    Serial.write("nRF52840");
  }
  pinMode(LED_BUILTIN, OUTPUT);
}

void loop() {
  if (Serial.available()) {
    String Temp;
    Temp = Serial.readString();
    Temp.remove(Temp.length() - 1);
    if ((WiFi.status() == WL_CONNECTED)) {
      std::unique_ptr<BearSSL::WiFiClientSecure>client(new BearSSL::WiFiClientSecure);
      client->setInsecure();
      HTTPClient https;
      if (https.begin(*client, "https://script.google.com/macros/s/AKfycbyYceJaHvcBvV2DqPc4Sb80jUDlMckdA3zTt1CPTrhE5I8CGen71J8HywVxJbR-I7_t/exec")) {
        https.POST("{\"report\":\"" + Temp + "\"}");
        https.end();
      }
    }
  } else yield;
}
