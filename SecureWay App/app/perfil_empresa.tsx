import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from "react-native";
import BottomNav from "@/components/BottomNav";
const Empresas = () => {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0a3d3d" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.logoBox} />
        <Text style={styles.headerTitle}>SecureWay</Text>
        <TouchableOpacity style={styles.headerButton}>
          <Text style={styles.headerButtonText}>Empresa</Text>
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        <TouchableOpacity style={styles.tabItem}>
          <Text style={styles.tabText}>Sedes</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabItem}>
          <Text style={styles.tabText}>Horários</Text>
        </TouchableOpacity>
      </View>

      {/* Conteúdo em duas colunas */}
      <View style={styles.content}>
        <View style={styles.leftColumn} />
        <View style={styles.rightColumn} />
      </View>

      {/* Botão de chat flutuante */}
      <TouchableOpacity style={styles.chatButton}>
        <Text style={styles.chatIcon}>💬</Text>
      </TouchableOpacity>

      {/* Bottom Navigation */}
      <BottomNav />
      </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0a3d3d",
  },
  header: {
    backgroundColor: "#486a6a",
    paddingTop: 40,
    paddingBottom: 20,
    alignItems: "center",
  },
  logoBox: {
    width: 120,
    height: 60,
    backgroundColor: "#3c5656",
    marginBottom: 8,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 6,
  },
  headerButton: {
    backgroundColor: "#b0c4c4",
    paddingVertical: 6,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  headerButtonText: {
    color: "#333",
    fontWeight: "600",
  },
  tabs: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#668",
    backgroundColor: "#0a3d3d",
  },
  tabItem: {
    paddingVertical: 6,
  },
  tabText: {
    color: "#fff",
    fontSize: 14,
  },
  content: {
    flex: 1,
    flexDirection: "row",
  },
  leftColumn: {
    flex: 1,
    backgroundColor: "#5a7a7a",
  },
  rightColumn: {
    flex: 1,
    backgroundColor: "#a0b8b8",
  },
  chatButton: {
    position: "absolute",
    bottom: 90,
    left: 20,
    backgroundColor: "#fff",
    borderRadius: 30,
    padding: 12,
    elevation: 4,
  },
  chatIcon: {
    fontSize: 22,
  },
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#0a3d3d",
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: "#1a5c5c",
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

export default Empresas;
