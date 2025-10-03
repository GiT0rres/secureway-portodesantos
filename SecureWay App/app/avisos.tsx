import React from "react";
import {
  View,
  Text,
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

      {/* Lista de avisos com header incluso no scroll */}
      <FlatList
        data={avisosData}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={() => (
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Avisos</Text>
          </View>
        )}
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
    paddingTop: 60, // espaço maior no topo
    paddingBottom: 24,
    alignItems: "center",
    backgroundColor: "#001f2d",
    borderBottomColor: "#145f82ff",
    borderBottomWidth: 2,
    marginBottom: 16, // separação do primeiro card
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#ffffff",
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 100, // espaço antes da bottom nav
  },
  card: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#4d6666",
    borderRadius: 6,
    padding: 16,
    marginBottom: 14,
  },
  cardText: {
    color: "#ffffff",
    fontSize: 16,
  },
  alertIcon: {
    fontSize: 20,
    color: "#ffffff",
  },
});

export default Avisos;
