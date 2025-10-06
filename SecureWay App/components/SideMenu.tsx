import React, { useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Animated } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

interface Props {
  visible: boolean;
  onClose: () => void;
  nome?: string;
  tipo?: "empresa" | "motorista" | "admin" | string;
}

export default function SideMenu({ visible, onClose, nome, tipo }: Props) {
  const router = useRouter();
  const slideAnim = useRef(new Animated.Value(-300)).current;
  const [isMounted, setIsMounted] = useState(visible);

  useEffect(() => {
    if (visible) {
      setIsMounted(true);
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: -300,
        duration: 300,
        useNativeDriver: true,
      }).start(() => setIsMounted(false));
    }
  }, [visible]);

  if (!isMounted) return null;

  const handlePerfil = () => {
    onClose();
    if (tipo === "empresa") {
      router.push("/perfil_empresa");
    } else {
      router.push("/perfil_caminhoneiro");
    }
  };

  return (
    <View style={styles.overlay}>
      <Animated.View style={[styles.menu, { transform: [{ translateX: slideAnim }] }]}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.avatar} />
          <View>
            <Text style={styles.name}>{nome || "Usuário"}</Text>
            <TouchableOpacity onPress={handlePerfil}>
              <Text style={styles.subtitle}>
                {tipo === "empresa" ? "Ver perfil da empresa" : "Ver perfil do motorista"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Itens */}
        <TouchableOpacity
          style={styles.item}
          onPress={() => {
            onClose();
            router.push("/Home");
          }}
        >
          <Ionicons name="home-outline" size={20} color="#fff" />
          <Text style={styles.itemText}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.item}
          onPress={() => {
            onClose();
            router.push("/agendamentos");
          }}
        >
          <Ionicons name="calendar-outline" size={20} color="#fff" />
          <Text style={styles.itemText}>Agendamentos</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.item}
          onPress={() => {
            onClose();
            router.push("/display_qr");
          }}
        >
          <Ionicons name="qr-code-outline" size={20} color="#fff" />
          <Text style={styles.itemText}>Leitor de QR Code</Text>
        </TouchableOpacity>

        {tipo === "motorista" && (
          <TouchableOpacity
            style={styles.item}
            onPress={() => {
              onClose();
              router.push("/empresas_salvas");
            }}
          >
            <Ionicons name="bookmark-outline" size={20} color="#fff" />
            <Text style={styles.itemText}>Empresas Salvas</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={styles.item}
          onPress={() => {
            onClose();
            router.push("/avisos");
          }}
        >
          <Ionicons name="chatbubble-ellipses-outline" size={20} color="#fff" />
          <Text style={styles.itemText}>Status</Text>
        </TouchableOpacity>

        {/* Botão fechar */}
        <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
          <Ionicons name="close" size={24} color="#fff" />
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.4)",
    flexDirection: "row",
  },
  menu: {
    width: "70%",
    backgroundColor: "#083044",
    padding: 20,
    height: "100%",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#00e0ff33",
    paddingBottom: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#00e0ff55",
    marginRight: 12,
  },
  name: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  subtitle: { color: "#aaa", fontSize: 12 },
  item: { flexDirection: "row", alignItems: "center", marginVertical: 12 },
  itemText: { color: "#fff", marginLeft: 10, fontSize: 15 },
  closeBtn: { position: "absolute", top: 20, right: 20 },
});
