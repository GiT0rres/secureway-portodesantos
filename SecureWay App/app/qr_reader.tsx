// components/QrScanner.tsx
import React, { useState } from "react";
import { View, Text, StyleSheet, Linking, Alert, TouchableOpacity } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import BottomNav from "@/components/BottomNav";

export default function QrScanner() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);

  if (!permission) return <View />;
  if (!permission.granted) {
    return (
        
      <View style={styles.center}>
        <Text style={styles.info}>Permita o acesso à câmera para usar o leitor.</Text>
        <Text style={styles.link} onPress={requestPermission}>
          Conceder permissão
        </Text>
      </View>
    );
  }

  const handleBarcodeScanned = async (res: any) => {
    if (!scanned) {
      setScanned(true);
      const data = res.data;

      if (data.startsWith("http://") || data.startsWith("https://")) {
        try {
          await Linking.openURL(data);
        } catch {
          Alert.alert("Erro", "Não foi possível abrir o link.");
        }
      } else {
        Alert.alert("QR Code Lido", data);
      }
    }
  };

  return (
    <>
    <View style={styles.wrapper}>
      <View style={styles.scannerBox}>
        <CameraView
          style={StyleSheet.absoluteFillObject}
          facing="back"
          onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
          barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
        />

        <View style={styles.overlay}>
          <Text style={styles.overlayText}>Aponte a câmera para o QR CODE</Text>

          <View style={[styles.corner, styles.topLeft]} />
          <View style={[styles.corner, styles.topRight]} />
          <View style={[styles.corner, styles.bottomLeft]} />
          <View style={[styles.corner, styles.bottomRight]} />
        </View>
      </View>

      {/* Botão neon aparece só depois de escanear */}
      {scanned && (
        <TouchableOpacity style={styles.neonButton} onPress={() => setScanned(false)}>
          <Text style={styles.neonButtonText}>🔄 Escanear novamente</Text>
        </TouchableOpacity>
      )}
    </View>
    <View>
        <BottomNav />
    </View>
    </>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: "center",
    marginVertical: 20,
  },
  scannerBox: {
    width: 260,
    height: 260,
    overflow: "hidden",
    borderRadius: 16,
    position: "relative",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  overlayText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  corner: {
    position: "absolute",
    width: 40,
    height: 40,
    borderColor: "#00e0ff",
    borderWidth: 4,
  },
  topLeft: { top: 0, left: 0, borderRightWidth: 0, borderBottomWidth: 0 },
  topRight: { top: 0, right: 0, borderLeftWidth: 0, borderBottomWidth: 0 },
  bottomLeft: { bottom: 0, left: 0, borderRightWidth: 0, borderTopWidth: 0 },
  bottomRight: { bottom: 0, right: 0, borderLeftWidth: 0, borderTopWidth: 0 },

  // Texto de permissão
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  info: { color: "#fff", textAlign: "center" },
  link: { color: "#00e0ff", marginTop: 10, textDecorationLine: "underline" },

  // Botão neon futurista
  neonButton: {
    marginTop: 20,
    paddingHorizontal: 25,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: "#001f2d",
    borderWidth: 2,
    borderColor: "#00e0ff",
    shadowColor: "#00e0ff",
    shadowOpacity: 0.9,
    shadowRadius: 10,
    elevation: 10,
  },
  neonButtonText: {
    color: "#00e0ff",
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center",
  },
});
