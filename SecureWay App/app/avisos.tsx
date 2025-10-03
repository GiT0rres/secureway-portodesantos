import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  FlatList,
} from "react-native";
import BottomNav from "@/components/BottomNav";

const avisosData = [
  { id: "1", text: "Entrega feita com sucesso" },
  { id: "2", text: "Problema de acesso" },
  { id: "3", text: "" },
  { id: "4", text: "" },
  { id: "5", text: "" },
];

const Avisos = () => {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0a3d3d" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Avisos</Text>
      </View>

      {/* Lista de avisos */}
      <FlatList
        data={avisosData}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.cardText}>
              {item.text || "Mensagem de aviso"}
            </Text>
            <Text style={styles.alertIcon}>⚠️</Text>
          </View>
        )}
      />

      {/* Bottom Navigation */}

       <BottomNav />
      </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#001f2d",
  },
  header: {
    paddingTop: 50,
    paddingBottom: 20,
    alignItems: "center",
    backgroundColor: "#0a3d3d",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#ffffff",
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 80,
  },
  card: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#4d6666",
    borderRadius: 6,
    padding: 16,
    marginBottom: 12,
  },
  cardText: {
    color: "#ffffff",
    fontSize: 16,
  },
  alertIcon: {
    fontSize: 20,
    color: "#ffffff",
  },
  navButton: {
    alignItems: "center",
    justifyContent: "center",
  },
  navIcon: {
    fontSize: 24,
    color: "#5a8a8a",
  },
  navIconActive: {
    fontSize: 24,
    color: "#ffffff",
  },
});

export default Avisos;
