#include <WiFi.h>
#include <SPI.h>
#include <MFRC522.h>
#include <Wire.h>
#include <LiquidCrystal_I2C.h>
#include <HTTPClient.h>  // ← NOVA BIBLIOTECA

// === CONFIGURAÇÃO DO WIFI ===
const char* ssid = "Wallex";        
const char* password = "batatadoce";   

// === CONFIGURAÇÃO DA API ===
const char* API_URL = "http://10.56.97.77:3034/api/read";  // ← ALTERE PARA O IP DO SEU SERVIDOR
const int ESP_ID = 1;  // ← ID do seu ESP cadastrado no banco

// === CONFIGURAÇÃO DO RC522 ===
#define RST_PIN 27
#define SS_PIN 5
MFRC522 mfrc522(SS_PIN, RST_PIN);

// === LEDS DE STATUS ===
#define LED_VERDE 32
#define LED_VERMELHO 33

// === LCD I2C ===
LiquidCrystal_I2C lcd(0x27, 16, 2);

void setup() {
  Serial.begin(115200);
  SPI.begin(18, 19, 23);
  mfrc522.PCD_Init();

  pinMode(LED_VERDE, OUTPUT);
  pinMode(LED_VERMELHO, OUTPUT);
  apagar_leds();

  // === TESTE DOS LEDS ===
  Serial.println("Testando LEDs...");
  for (int i = 0; i < 3; i++) {
    acender_led(LED_VERDE);
    delay(300);
    apagar_led(LED_VERDE);
    acender_led(LED_VERMELHO);
    delay(300);
    apagar_led(LED_VERMELHO);
  }
  Serial.println("Teste de LEDs finalizado.");

  // === INICIA LCD ===
  Wire.begin();
  lcd.init();
  lcd.backlight();
  lcd.setCursor(0, 0);
  lcd.print("Iniciando...");
  delay(1500);
  lcd.clear();

  // === CONECTA AO WIFI ===
  Serial.println("\nConectando ao Wi-Fi...");
  lcd.setCursor(0, 0);
  lcd.print("Conectando WiFi");

  WiFi.begin(ssid, password);
  int tentativas = 0;
  while (WiFi.status() != WL_CONNECTED && tentativas < 20) {
    delay(500);
    Serial.print(".");
    tentativas++;
  }

  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("\n✅ Wi-Fi conectado!");
    Serial.print("Endereço IP: ");
    Serial.println(WiFi.localIP());

    lcd.clear();
    lcd.setCursor(0, 0);
    lcd.print("WiFi conectado!");
    lcd.setCursor(0, 1);
    lcd.print(WiFi.localIP());
  } else {
    Serial.println("\n❌ Falha Wi-Fi!");
    lcd.clear();
    lcd.setCursor(0, 0);
    lcd.print("Falha Wi-Fi!");
  }

  delay(2000);
  lcd.clear();
  lcd.setCursor(0, 0);
  lcd.print("Aproxime o");
  lcd.setCursor(0, 1);
  lcd.print("cartao RFID...");
}

void loop() {
  if (!mfrc522.PICC_IsNewCardPresent()) return;
  if (!mfrc522.PICC_ReadCardSerial()) return;

  // === CONVERTE UID PARA STRING HEXADECIMAL ===
  String uidString = "";
  for (byte i = 0; i < mfrc522.uid.size; i++) {
    if (mfrc522.uid.uidByte[i] < 0x10) uidString += "0";
    uidString += String(mfrc522.uid.uidByte[i], HEX);
  }
  uidString.toUpperCase();

  // === MOSTRA O UID COMPLETO NO SERIAL ===
  Serial.print("UID da tag: ");
  Serial.println(uidString);
  Serial.println("------------------");

  // === VERIFICA SE É UMA TAG AUTORIZADA ===
  if (comparar_uid(mfrc522.uid.uidByte, mfrc522.uid.size)) {
    libera_acesso(uidString);  // ← Passa o UID
  } else {
    nega_acesso(uidString);    // ← Passa o UID
  }

  mfrc522.PICC_HaltA();
  mfrc522.PCD_StopCrypto1();
  delay(1000);
}

// === COMPARAÇÃO FLEXÍVEL DE UID ===
bool comparar_uid(byte uidLido[], byte tamanhoLido) {
  byte tagAutorizada[] = { 0x23, 0x27, 0xA5, 0x02 };  // ✅ SOMENTE ESSA TAG LIBERADA

  if (tamanhoLido != sizeof(tagAutorizada)) return false;

  for (int i = 0; i < tamanhoLido; i++) {
    if (uidLido[i] != tagAutorizada[i]) return false;
  }
  return true;
}

// === AÇÕES DE ACESSO ===
void libera_acesso(String uidString) {
  Serial.println("✅ Acesso liberado!");
  acender_led(LED_VERDE);
  apagar_led(LED_VERMELHO);

  lcd.clear();
  lcd.setCursor(0, 0);
  lcd.print("Acesso Liberado");
  lcd.setCursor(0, 1);
  lcd.print("Bem-vindo!");

  // ← ENVIA PARA API (ACESSO PERMITIDO)
  enviarLeituraParaAPI(uidString, "success");

  delay(3000);
  apagar_led(LED_VERDE);
  lcd.clear();
  lcd.print("Aproxime o");
  lcd.setCursor(0, 1);
  lcd.print("cartao RFID...");
}

void nega_acesso(String uidString) {
  Serial.println("❌ Acesso negado!");
  acender_led(LED_VERMELHO);
  apagar_led(LED_VERDE);

  lcd.clear();
  lcd.setCursor(0, 0);
  lcd.print("Acesso Negado");
  lcd.setCursor(0, 1);
  lcd.print("Tag invalida!");

  // ← ENVIA PARA API (ACESSO NEGADO)
  enviarLeituraParaAPI(uidString, "denied");

  delay(3000);
  apagar_led(LED_VERMELHO);
  lcd.clear();
  lcd.print("Aproxime o");
  lcd.setCursor(0, 1);
  lcd.print("cartao RFID...");
}

// === NOVA FUNÇÃO: ENVIA LEITURA PARA API ===
void enviarLeituraParaAPI(String uidString, String status) {
  // Verifica se está conectado ao WiFi
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("❌ WiFi desconectado! Não foi possível enviar para API.");
    return;
  }

  HTTPClient http;
  
  Serial.println("📡 Enviando leitura para API...");
  
  // Inicia conexão HTTP
  http.begin(API_URL);
  http.addHeader("Content-Type", "application/json");
  
  // Monta o JSON
  // IMPORTANTE: readKey precisa ser NUMBER no banco, então converte UID hex para decimal
  // Se seu banco aceita STRING, use: "\"readKey\":\"" + uidString + "\""
  String payload = "{";
  payload += "\"readKey\":\"" + uidString + "\",";  // UID como string
  payload += "\"idEsp\":" + String(ESP_ID);
  payload += "}";
  
  Serial.println("📦 Payload: " + payload);
  
  // Faz a requisição POST
  int httpCode = http.POST(payload);
  
  // Verifica resposta
  if (httpCode > 0) {
    Serial.print("✅ Resposta da API: ");
    Serial.println(httpCode);
    
    if (httpCode == 200 || httpCode == 201) {
      String response = http.getString();
      Serial.println("📥 Resposta: " + response);
      Serial.println("✅ Leitura salva no banco de dados!");
    }
  } else {
    Serial.print("❌ Erro na requisição: ");
    Serial.println(http.errorToString(httpCode));
  }
  
  http.end();
}

// === Funções auxiliares para LEDs ===
void acender_led(int pino) {
  digitalWrite(pino, HIGH);
}

void apagar_led(int pino) {
  digitalWrite(pino, LOW);
}

void apagar_leds() {
  apagar_led(LED_VERDE);
  apagar_led(LED_VERMELHO);
}