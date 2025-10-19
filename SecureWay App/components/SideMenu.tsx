import React, { useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Animated } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { obterUsuarioAtual, UserData } from "../services/authService";

interface Props {
  visible: boolean;
  onClose: () => void;
}

export default function SideMenu({ visible, onClose }: Props) {
  const router = useRouter();
  const slideAnim = useRef(new Animated.Value(-300)).current;
  const [isMounted, setIsMounted] = useState(visible);
  const [userData, setUserData] = useState<UserData | null>(null);

  // Carrega os dados do usuário quando o menu fica visível
  useEffect(() => {
    if (visible) {
      carregarDadosUsuario();
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

  const carregarDadosUsuario = async () => {
    try {
      const user = await obterUsuarioAtual();
      if (user) {
        setUserData(user);
      }
    } catch (error) {
      console.error("Erro ao carregar dados do usuário:", error);
    }
  };

  if (!isMounted) return null;

  const handlePerfil = () => {
    onClose();
    if (userData?.tipo === "empresa") {
      router.push("/perfil_empresa");
    } else {
      router.push("/perfil_caminhoneiro");
    }
  };

  const handleAgendamentos = () => {
    onClose();
    if (userData?.tipo === "empresa") {
      router.push("/perfil_empresa");
    } else {
      router.push("/agendamentos");
    }
  };

  return (
    <View style={styles.overlay}>
      <Animated.View style={[styles.menu, { transform: [{ translateX: slideAnim }] }]}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.avatar}>
            <Ionicons 
              name={userData?.tipo === "empresa" ? "business" : "person"} 
              size={24} 
              color="#00e0ff" 
            />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.name} numberOfLines={1}>
              {userData?.nomeCompleto || "Usuário"}
            </Text>
            <TouchableOpacity onPress={handlePerfil}>
              <Text style={styles.subtitle}>
                {userData?.tipo === "empresa" ? "Ver perfil da empresa" : "Ver perfil do motorista"}
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
          onPress={handleAgendamentos}
        >
          <Ionicons name="calendar-outline" size={20} color="#fff" />
          <Text style={styles.itemText}>
            {userData?.tipo === "empresa" ? "Gerenciar Agendamentos" : "Agendamentos"}
          </Text>
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

        {userData?.tipo === "empresa" && (
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
    backgroundColor: "#083044",
    borderWidth: 2,
    borderColor: "#00e0ff",
    marginRight: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  name: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  subtitle: { color: "#aaa", fontSize: 12 },
  item: { flexDirection: "row", alignItems: "center", marginVertical: 12 },
  itemText: { color: "#fff", marginLeft: 10, fontSize: 15 },
  closeBtn: { position: "absolute", top: 20, right: 20 },
});