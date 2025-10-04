import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ScrollView,
} from "react-native";
import BottomNav from "@/components/BottomNav";

export default function Empresas() {
  const [abaAtiva, setAbaAtiva] = useState("Sedes");

  // Mock de dados
  const sedes = [
    { id: 1, nome: "Unidade Centro", endereco: "Rua A, 123 - Centro" },
    { id: 2, nome: "Unidade Norte", endereco: "Av. Central, 456 - Norte" },
    { id: 3, nome: "Unidade Sul", endereco: "Rua das Flores, 789 - Sul" },
  ];

  const horarios = [
    { id: 1, dia: "Segunda a Sexta", horas: "08:00 - 20:00" },
    { id: 2, dia: "Sábado", horas: "09:00 - 14:00" },
    { id: 3, dia: "Domingo", horas: "Fechado" },
  ];

  return (
    <>
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#0a3d3d" />

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.avatar} />
            <Text style={styles.nome}>SecureWay</Text>
            <View style={styles.funcaoBox}>
              <Text style={styles.funcao}>Empresa</Text>
            </View>
          </View>

          {/* Tabs */}
          <View style={styles.tabs}>
            <TouchableOpacity
              style={styles.tabItem}
              onPress={() => setAbaAtiva("Sedes")}
            >
              <Text
                style={[
                  styles.tabText,
                  abaAtiva === "Sedes" && styles.tabTextAtivo,
                ]}
              >
                Sedes
              </Text>
              {abaAtiva === "Sedes" && <View style={styles.tabUnderline} />}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.tabItem}
              onPress={() => setAbaAtiva("Horários")}
            >
              <Text
                style={[
                  styles.tabText,
                  abaAtiva === "Horários" && styles.tabTextAtivo,
                ]}
              >
                Horários
              </Text>
              {abaAtiva === "Horários" && <View style={styles.tabUnderline} />}
            </TouchableOpacity>
          </View>

          {/* Conteúdo condicional */}
          <View style={styles.content}>
            {abaAtiva === "Sedes" &&
              sedes.map((sede) => (
                <View key={sede.id} style={styles.card}>
                  <Text style={styles.cardTitle}>{sede.nome}</Text>
                  <Text style={styles.cardText}>{sede.endereco}</Text>
                </View>
              ))}

            {abaAtiva === "Horários" &&
              horarios.map((horario) => (
                <View key={horario.id} style={styles.card}>
                  <Text style={styles.cardTitle}>{horario.dia}</Text>
                  <Text style={styles.cardText}>{horario.horas}</Text>
                </View>
              ))}
          </View>

          {/* Botão de chat flutuante */}
          <TouchableOpacity style={styles.chatButton}>
            <Text style={styles.chatIcon}>💬</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* Bottom Navigation */}
      <View>
        <BottomNav />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#001f2d",
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 100,
  },
  header: {
    alignItems: "center",
    paddingVertical: 40,
    backgroundColor: "#55777c",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  avatar: {
    width: 120,
    height: 80,
    backgroundColor: "#3c5656",
    borderRadius: 8,
    marginBottom: 12,
  },
  nome: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 6,
  },
  funcaoBox: {
    backgroundColor: "#d4e4e4",
    borderRadius: 20,
    paddingHorizontal: 45,
    paddingVertical: 6,
  },
  funcao: {
    color: "#0a3d3d",
    fontWeight: "bold",
  },
  tabs: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#001f2d",
    marginTop: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#55777c",
  },
  tabItem: {
    alignItems: "center",
    paddingVertical: 10,
  },
  tabText: {
    fontSize: 15,
    color: "#b8d8d8",
  },
  tabTextAtivo: {
    color: "#ffffff",
    fontWeight: "bold",
  },
  tabUnderline: {
    marginTop: 4,
    height: 2,
    width: "80%",
    backgroundColor: "#3694AD",
    borderRadius: 2,
  },
  content: {
    marginTop: 20,
    padding: 16,
    gap: 12,
  },
  card: {
    backgroundColor: "#0f4a4a",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  cardTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 6,
  },
  cardText: {
    color: "#d4e4e4",
    fontSize: 14,
  },
  chatButton: {
    position: "absolute",
    bottom: 90,
    left: 20,
    backgroundColor: "#fff",
    borderRadius: 30,
    padding: 14,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  chatIcon: {
    fontSize: 22,
  },
});
