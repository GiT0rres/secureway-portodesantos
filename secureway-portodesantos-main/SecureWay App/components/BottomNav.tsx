import React, { useState, useEffect } from "react";
import { View, TouchableOpacity, Text, StyleSheet, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import SideMenu from "./SideMenu";
import { useRouter, usePathname } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { db, auth } from "../services/firebase.config";
import { doc, getDoc } from "firebase/firestore";

interface Usuario {
  nome: string;
  tipo: "empresa" | "motorista" | "admin";
}

export default function BottomNav() {
  const [menuVisible, setMenuVisible] = useState(false);
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);

  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const carregarUsuario = async () => {
      try {
        const user = auth.currentUser;
        if (!user) return;

        const docRef = doc(db, "usuarios", user.uid);
        const snap = await getDoc(docRef);

        if (snap.exists()) {
          const dados = snap.data() as Usuario;
          setUsuario(dados);
        }
      } catch (error) {
        console.error("Erro ao buscar dados do usuário:", error);
      } finally {
        setLoading(false);
      }
    };

    carregarUsuario();
  }, []);

  const handleNavigate = (route: string) => {
    if (pathname !== route) {
      setTimeout(() => {
        router.push(route as any);
      }, 100);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="small" color="#fff" />
      </View>
    );
  }

  return (
    <>
      <SafeAreaView edges={["bottom"]} style={styles.safeArea}>
        <View style={styles.bottomNav}>
          {/* Botão menu lateral */}
          <TouchableOpacity
            style={styles.navButton}
            onPress={() => setMenuVisible(true)}
          >
            <Text style={styles.navIcon}>☰</Text>
          </TouchableOpacity>

          {/* Botão Home */}
          <TouchableOpacity
            style={styles.navButton}
            onPress={() => handleNavigate("/Home")}
          >
            <Ionicons
              name="home-outline"
              size={24}
              color={pathname === "/Home" ? "#fff" : "#5a8a8a"}
            />
          </TouchableOpacity>

          {/* Botão Perfil — muda conforme o tipo */}
          <TouchableOpacity
            style={styles.navButton}
            onPress={() =>
              handleNavigate(
                usuario?.tipo === "empresa"
                  ? "/perfil_empresa"
                  : "/perfil_caminhoneiro"
              )
            }
          >
            <Ionicons
              name="person-outline"
              size={24}
              color={
                pathname === "/perfil_empresa" ||
                pathname === "/perfil_caminhoneiro"
                  ? "#fff"
                  : "#5a8a8a"
              }
            />
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      {/* Menu lateral */}
      <SideMenu
        visible={menuVisible}
        onClose={() => setMenuVisible(false)}
        nome={usuario?.nome || ""}
        tipo={usuario?.tipo || ""}
      />
    </>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: "#001f2d",
  },
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: 12,
    borderTopWidth: 2,
    borderTopColor: "#204950",
  },
  navButton: {
    padding: 10,
    alignItems: "center",
  },
  navIcon: {
    fontSize: 22,
    color: "#fff",
  },
  loadingContainer: {
    backgroundColor: "#001f2d",
    padding: 16,
    alignItems: "center",
  },
});
