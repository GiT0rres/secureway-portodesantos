import React from "react";
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import BottomNav from "@/components/BottomNav";
import { useAgendamentos } from "../hooks/useAgendamentos";

export default function Avisos() {
  const { agendamentosPassados, loading } = useAgendamentos("motorista");

  // Filtra só os agendamentos concluídos
  const entregasConcluidas = agendamentosPassados().filter(
    (ag) => ag.status === "concluido"
  );

  return (
    <>
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#0a3d3d" />

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Avisos</Text>
        </View>

        {/* Conteúdo */}
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#5a8a8a" />
            <Text style={styles.loadingText}>Carregando avisos...</Text>
          </View>
        ) : entregasConcluidas.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>📭</Text>
            <Text style={styles.emptyText}>Nenhum aviso no momento</Text>
            <Text style={styles.emptySubtext}>
              As entregas concluídas aparecerão aqui
            </Text>
          </View>
        ) : (
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {entregasConcluidas.map((ag) => (
              <View key={ag.id} style={styles.card}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.cardText}>
                    ✅ Entrega feita com sucesso para {ag.empresaNome}
                  </Text>
                  <Text style={styles.cardDate}>
                    📅 {new Date(ag.data).toLocaleDateString("pt-BR")} - ⏰ {ag.horario}
                  </Text>
                </View>
                <Text style={styles.alertIcon}>📦</Text>
              </View>
            ))}
          </ScrollView>
        )}
      </View>

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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#4d6666",
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },
  cardText: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "bold",
  },
  cardDate: {
    color: "#cde3e3",
    fontSize: 13,
    marginTop: 4,
  },
  alertIcon: {
    fontSize: 22,
    color: "#ffffff",
    marginLeft: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    color: "#5a8a8a",
    marginTop: 10,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyText: {
    color: "#a0c4c4",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  emptySubtext: {
    color: "#5a8a8a",
    fontSize: 14,
    textAlign: "center",
  },
});
