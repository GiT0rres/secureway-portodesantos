// screens/Home.tsx
import React from "react";
import { View, Text, StyleSheet, TextInput, FlatList, ImageBackground, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context"; // ✅ garante espaço do notch/status bar
import BottomNav from "../components/BottomNav";

const data = [
  { id: "1", title: "SecureWay", description: "imagem da empresa no fundo, com a transparência menor" },
  { id: "2", title: "SecureWay", description: "" },
  { id: "3", title: "SecureWay", description: "" },
  { id: "4", title: "SecureWay", description: "" },
  { id: "5", title: "SecureWay", description: "" },
];

export default function Home() {
  return (
    <>
      <SafeAreaView style={styles.container}>
        {/* Campo de pesquisa */}
        <View style={styles.searchBox}>
          <TextInput
            placeholder="Pesquisar"
            placeholderTextColor="#aaa"
            style={styles.searchInput}
          />
          <Ionicons name="search" size={20} color="#aaa" style={styles.searchIcon} />
        </View>

        {/* Lista de cards com scroll */}
        <FlatList
          data={data}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 80 }}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <ImageBackground
                source={require("../assets/images/android-icon-foreground.png")}
                style={styles.cardBg}
                imageStyle={{ borderRadius: 12, opacity: 0.25 }}
              >
                <Text style={styles.cardText}>{item.description}</Text>
                <View style={styles.cardFooter}>
                  <Text style={styles.cardTitle}>{item.title}</Text>
                  <TouchableOpacity>
                    <Ionicons name="call" size={20} color="#00e0ff" />
                  </TouchableOpacity>
                </View>
              </ImageBackground>
            </View>
          )}
        />
      </SafeAreaView>

      <BottomNav />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#001f2d",
    paddingHorizontal: 16,
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#083044",
    borderRadius: 12,
    paddingHorizontal: 12,
    marginBottom: 20,
    height: 45,
  },
  searchInput: {
    flex: 1,
    color: "#fff",
  },
  searchIcon: {
    marginLeft: 8,
  },
  card: {
    backgroundColor: "#083044",
    borderRadius: 12,
    marginBottom: 16,
    overflow: "hidden",
  },
  cardBg: {
    width: "100%",
    height: 120,
    padding: 12,
    justifyContent: "space-between",
  },
  cardText: {
    color: "#fff",
    fontSize: 14,
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardTitle: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
