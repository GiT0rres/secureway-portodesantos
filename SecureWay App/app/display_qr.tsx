import React from "react";
import { View, Text, StyleSheet } from "react-native";
import QrScanner from "./qr_reader";
import BottomNav from "../components/BottomNav";
export default function Home() {
  return (
     <>
      <View style={styles.container}>
        <Text style={styles.title}>Bem-vindo ao App 🚀</Text>

        <QrScanner />

        <Text style={styles.text}>Escaneie um QR Code para continuar</Text>
      </View>

      <BottomNav />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#001f2d", // fundo escuro
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 20,
    color: "#fff",
    fontWeight: "bold",
    marginBottom: 20,
  },
  text: {
    color: "#aaa",
    marginTop: 20,
    textAlign: "center",
  },
});
