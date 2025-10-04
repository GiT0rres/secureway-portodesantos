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

const Empresas = () => {
  const [abaAtiva, setAbaAtiva] = useState("Caminhões");

  return (
    <>
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#0a3d3d" />

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header estilo perfil */}
          <View style={styles.header}>
            <View style={styles.avatar} />
            <Text style={styles.nome}>Sérgio Andrade</Text>
            <View style={styles.funcaoBox}>
              <Text style={styles.funcao}>Motorista</Text>
            </View>
          </View>

          {/* Tabs */}
          <View style={styles.tabs}>
            <TouchableOpacity
              style={styles.tabItem}
              onPress={() => setAbaAtiva("Caminhões")}
            >
              <Text
                style={[
                  styles.tabText,
                  abaAtiva === "Caminhões" && styles.tabTextAtivo,
                ]}
              >
                Caminhões
              </Text>
              {abaAtiva === "Caminhões" && <View style={styles.tabUnderline} />}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.tabItem}
              onPress={() => setAbaAtiva("Histórico")}
            >
              <Text
                style={[
                  styles.tabText,
                  abaAtiva === "Histórico" && styles.tabTextAtivo,
                ]}
              >
                Histórico
              </Text>
              {abaAtiva === "Histórico" && <View style={styles.tabUnderline} />}
            </TouchableOpacity>
          </View>

          {/* Conteúdo de cada aba */}
          <View style={styles.content}>
            {abaAtiva === "Caminhões" ? (
              <Text style={styles.contentText}>Lista de caminhões...</Text>
            ) : (
              <Text style={styles.contentText}>Histórico de viagens...</Text>
            )}
          </View>
        </ScrollView>
      </View>

      {/* Bottom Navigation */}
      <View>
        <BottomNav />
      </View>
    </>
  );
};

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
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "#3c5656",
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
    paddingHorizontal: 20,
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
    backgroundColor: "#0f4a4a",
    borderRadius: 12,
    marginHorizontal: 16,
  },
  contentText: {
    color: "#ffffff",
    fontSize: 14,
  },
});

export default Empresas;
