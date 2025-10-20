import React from "react";
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons"; // ícones
import BottomNav from "@/components/BottomNav";

export default function Agendamentos() {
  // Mock de agendamentos (depois pode puxar do banco de dados)
  const agendamentos = [
    { id: 1, produto: "Carga de cimento", data: "05/10/2025 - 14:00" },
    { id: 2, produto: "Areia lavada", data: "06/10/2025 - 09:30" },
    { id: 3, produto: "Ferro CA-50", data: "07/10/2025 - 11:15" },
    { id: 4, produto: "Brita 1", data: "08/10/2025 - 16:00" },
  ];

  return (
    <>
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#0a3d3d" />

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Agendamentos</Text>
        </View>

        {/* Lista de Agendamentos */}
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {agendamentos.map((item) => (
            <TouchableOpacity key={item.id} style={styles.card}>
              <View style={styles.cardInfo}>
                <Text style={styles.cardProduto}>{item.produto}</Text>
                <Text style={styles.cardData}>{item.data}</Text>
              </View>
              <Ionicons name="location-outline" size={22} color="#fff" />
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Bottom Navigation fixo */}
      <BottomNav />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#001f2d",
  },
  header: {
    paddingTop: 50,
    paddingBottom: 20,
    alignItems: "center",
    backgroundColor: "#00323c",
    borderBottomWidth: 1,
    borderBottomColor: "#1a5c5c",
  },
  headerTitle: {
    color: "#ffffff",
    fontSize: 20,
    fontWeight: "bold",
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },
  card: {
    backgroundColor: "#3c5656",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardInfo: {
    flex: 1,
  },
  cardProduto: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "bold",
  },
  cardData: {
    color: "#d4e4e4",
    fontSize: 13,
    marginTop: 4,
  },
});
