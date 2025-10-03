import React, { useState } from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import SideMenu from "./SideMenu";
import { useRouter, usePathname } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

export default function BottomNav() {
  const [menuVisible, setMenuVisible] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const handleNavigate = (route: string) => {
    if (pathname !== route) {
      setTimeout(() => {
        router.push(route as any);
      }, 100);
    }
  };

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

          {/* Botão perfil */}
          <TouchableOpacity
            style={styles.navButton}
            onPress={() => handleNavigate("/perfil_caminhoneiro")}
          >
            <Ionicons
              name="person-outline"
              size={24}
              color={pathname === "/perfil_caminhoneiro" ? "#fff" : "#5a8a8a"}
            />
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      {/* Menu lateral */}
      <SideMenu visible={menuVisible} onClose={() => setMenuVisible(false)} />
    </>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: "#001f2d", // fundo da nav
  },
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: 12,
     borderTopWidth: 2,
    borderTopColor: "#204950"
  },
  navButton: {
    padding: 10,
    alignItems: "center",
  },
  navIcon: {
    fontSize: 22,
    color: "#fff",
  },
});
