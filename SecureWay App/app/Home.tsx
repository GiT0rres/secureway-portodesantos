import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  Image,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { collection, query, where, getDocs, onSnapshot, doc, deleteDoc } from "firebase/firestore";
import { db, auth } from "../services/firebase.config";
import BottomNav from "../components/BottomNav";
import { obterUsuarioAtual } from "../services/authService";

interface Profissional {
  id: string;
  nomeCompleto: string;
  telefone: string;
  fotoPerfil?: string;
  tipo: "empresa" | "caminhoneiro";
}

export default function Home() {
  const [profissionais, setProfissionais] = useState<Profissional[]>([]);
  const [filtrados, setFiltrados] = useState<Profissional[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedPhone, setSelectedPhone] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [userType, setUserType] = useState<"empresa" | "caminhoneiro" | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [selectedProfissional, setSelectedProfissional] = useState<Profissional | null>(null);
  const [passwordError, setPasswordError] = useState("");

  // Função para carregar profissionais
  const carregarProfissionais = async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        setLoading(false);
        return;
      }

      const userData = await obterUsuarioAtual();
      if (!userData) {
        setLoading(false);
        return;
      }

      setUserType(userData.tipo);

      // Se for empresa, busca motoristas. Se for motorista, busca empresas
      const tipoParaBuscar = userData.tipo === "empresa" ? "caminhoneiro" : "empresa";
      const q = query(
        collection(db, "usuarios"),
        where("tipo", "==", tipoParaBuscar)
      );
      const querySnapshot = await getDocs(q);
      const profissionaisData: Profissional[] = [];

      querySnapshot.forEach((doc) => {
        profissionaisData.push({
          id: doc.id,
          ...doc.data(),
        } as Profissional);
      });

      setProfissionais(profissionaisData);
      setFiltrados(profissionaisData);
    } catch (error) {
      console.error("Erro ao carregar profissionais:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Buscar profissionais na montagem com listener em tempo real
  useEffect(() => {
    let unsubscribe: any;

    const setupListener = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          setLoading(false);
          return;
        }

        const userData = await obterUsuarioAtual();
        if (!userData) {
          setLoading(false);
          return;
        }

        setUserType(userData.tipo);

        const tipoParaBuscar = userData.tipo === "empresa" ? "caminhoneiro" : "empresa";
        const q = query(
          collection(db, "usuarios"),
          where("tipo", "==", tipoParaBuscar)
        );

        // Listener em tempo real
        unsubscribe = onSnapshot(q, (snapshot) => {
          const profissionaisData: Profissional[] = [];
          snapshot.forEach((doc) => {
            profissionaisData.push({
              id: doc.id,
              ...doc.data(),
            } as Profissional);
          });

          setProfissionais(profissionaisData);
          setFiltrados(profissionaisData);
          setLoading(false);
        }, (error) => {
          console.error("Erro ao escutar profissionais:", error);
          setLoading(false);
        });
      } catch (error) {
        console.error("Erro ao configurar listener:", error);
        setLoading(false);
      }
    };

    setupListener();

    // Limpar listener ao desmontar
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  // Filtrar profissionais pela pesquisa
  const handleSearch = (text: string) => {
    setSearch(text);
    if (text.trim() === "") {
      setFiltrados(profissionais);
    } else {
      const filtered = profissionais.filter((prof) =>
        prof.nomeCompleto.toLowerCase().includes(text.toLowerCase())
      );
      setFiltrados(filtered);
    }
  };

  // Formatar telefone no padrão (DDD) NNNNN-NNNN
  const formatPhone = (phone: string): string => {
    const digits = phone.replace(/\D/g, "");
    if (digits.length === 11) {
      return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
    }
    return phone;
  };

  // Mostrar modal com número de telefone
  const handlePhonePress = (phone: string) => {
    setSelectedPhone(formatPhone(phone));
    setShowModal(true);
  };

  // Deletar profissional
  const handleDeletePress = (prof: Profissional) => {
    setSelectedProfissional(prof);
    setPasswordInput("");
    setPasswordError("");
    setShowDeleteModal(true);
  };

  // Confirmar deleção
  const confirmarDelecao = async () => {
    if (passwordInput !== "admin67") {
      setPasswordError("Senha incorreta!");
      return;
    }

    try {
      if (selectedProfissional) {
        await deleteDoc(doc(db, "usuarios", selectedProfissional.id));
        setShowDeleteModal(false);
        setPasswordInput("");
        setPasswordError("");
        setSelectedProfissional(null);
      }
    } catch (error) {
      console.error("Erro ao deletar profissional:", error);
      setPasswordError("Erro ao deletar. Tente novamente.");
    }
  };

  // Renderizar card do profissional
  const renderCard = ({ item }: { item: Profissional }) => (
    <View style={styles.card}>
      <Image
        source={{
          uri: item.fotoPerfil || "https://via.placeholder.com/150",
        }}
        style={styles.cardImage}
      />
      <View style={styles.cardOverlay}>
        <View style={styles.cardContent}>
          <Text style={styles.cardTitle} numberOfLines={2}>
            {item.nomeCompleto}
          </Text>
        </View>
        <View style={styles.cardButtons}>
          <TouchableOpacity
            style={styles.phoneButton}
            onPress={() => handlePhonePress(item.telefone)}
          >
            <Ionicons name="call" size={20} color="#00e0ff" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => handleDeletePress(item)}
          >
            <Ionicons name="trash" size={20} color="#ff4444" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#00e0ff" />
          <Text style={styles.loadingText}>Carregando...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <>
      <SafeAreaView style={styles.container}>
        {/* Campo de pesquisa */}
        <View style={styles.searchBox}>
          <TextInput
            placeholder={userType === "empresa" ? "Pesquisar motorista" : "Pesquisar empresa"}
            placeholderTextColor="#aaa"
            style={styles.searchInput}
            value={search}
            onChangeText={handleSearch}
          />
          <Ionicons name="search" size={20} color="#aaa" style={styles.searchIcon} />
        </View>

        {/* Lista de profissionais */}
        {filtrados.length > 0 ? (
          <FlatList
            key="1"
            data={filtrados}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ paddingBottom: 80 }}
            showsVerticalScrollIndicator={false}
            renderItem={renderCard}
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true);
              carregarProfissionais();
            }}
          />
        ) : (
          <View style={styles.emptyContainer}>
            <Ionicons name="search" size={64} color="#00e0ff" />
            <Text style={styles.emptyText}>
              {userType === "empresa" ? "Nenhum motorista encontrado" : "Nenhuma empresa encontrada"}
            </Text>
          </View>
        )}
      </SafeAreaView>

      {/* Modal com número de telefone */}
      <Modal
        visible={showModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Número</Text>
            <Text style={styles.modalPhone}>{selectedPhone}</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowModal(false)}
            >
              <Text style={styles.closeButtonText}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal de confirmação de senha para deletar */}
      <Modal
        visible={showDeleteModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowDeleteModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Deletar {selectedProfissional?.nomeCompleto}</Text>
            <Text style={styles.deleteWarning}>Digite a senha para confirmar a exclusão</Text>
            <TextInput
              placeholder="Senha"
              placeholderTextColor="#aaa"
              secureTextEntry
              style={styles.passwordInput}
              value={passwordInput}
              onChangeText={(text) => {
                setPasswordInput(text);
                setPasswordError("");
              }}
            />
            {passwordError ? (
              <Text style={styles.errorText}>{passwordError}</Text>
            ) : null}
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setShowDeleteModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.deleteConfirmButton}
                onPress={confirmarDelecao}
              >
                <Text style={styles.deleteConfirmButtonText}>Deletar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <BottomNav />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#001f2d",
    paddingHorizontal: 12,
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#083044",
    borderRadius: 12,
    paddingHorizontal: 12,
    marginBottom: 20,
    marginTop: 10,
    height: 45,
  },
  searchInput: {
    flex: 1,
    color: "#fff",
    fontSize: 14,
  },
  searchIcon: {
    marginLeft: 8,
  },
  card: {
    backgroundColor: "#083044",
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 12,
    position: "relative",
    height: 140,
  },
  cardImage: {
    width: "100%",
    height: "100%",
    backgroundColor: "#0a1f2e",
  },
  cardOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    paddingVertical: 16,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  cardContent: {
    flex: 1,
    marginRight: 12,
  },
  cardTitle: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
    marginRight: 8,
  },
  cardButtons: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },
  phoneButton: {
    padding: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  deleteButton: {
    padding: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    color: "#00e0ff",
    marginTop: 12,
    fontSize: 14,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    color: "#aaa",
    fontSize: 16,
    marginTop: 12,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#083044",
    borderRadius: 16,
    padding: 24,
    width: "80%",
    alignItems: "center",
  },
  modalTitle: {
    color: "#00e0ff",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
  },
  modalPhone: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 24,
    letterSpacing: 1,
  },
  closeButton: {
    backgroundColor: "#00e0ff",
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 8,
  },
  closeButtonText: {
    color: "#001f2d",
    fontWeight: "bold",
    fontSize: 14,
  },
  passwordInput: {
    borderWidth: 1,
    borderColor: "#00e0ff",
    borderRadius: 8,
    padding: 12,
    color: "#fff",
    marginBottom: 12,
    width: "100%",
  },
  errorText: {
    color: "#ff4444",
    fontSize: 12,
    marginBottom: 12,
    alignSelf: "center",
  },
  deleteWarning: {
    color: "#aaa",
    fontSize: 14,
    marginBottom: 16,
    textAlign: "center",
  },
  modalButtons: {
    flexDirection: "row",
    gap: 12,
    width: "100%",
  },
  cancelButton: {
    flex: 1,
    backgroundColor: "#083044",
    borderWidth: 1,
    borderColor: "#00e0ff",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  cancelButtonText: {
    color: "#00e0ff",
    fontWeight: "bold",
    fontSize: 14,
  },
  deleteConfirmButton: {
    flex: 1,
    backgroundColor: "#ff4444",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  deleteConfirmButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
});