import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import BottomNav from "../components/BottomNav";
import { fazerLogin } from "../services/authService";

export default function Index() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleLogin = async () => {
    // Verificação mais segura
    const emailValue = email || "";
    const senhaValue = senha || "";

    if (!emailValue.trim() || !senhaValue.trim()) {
      Alert.alert("Atenção", "Preencha todos os campos");
      return;
    }

    setIsLoggingIn(true);

    try {
      const result = await fazerLogin(emailValue.trim(), senhaValue);

      if (result.success && result.userData) {
        const userData = result.userData;
        
        // Redirecionar baseado no tipo de usuário
        if (userData.tipo === "empresa") {
          router.replace("/perfil_empresa");
        } else {
          router.replace("/perfil_caminhoneiro");
        }
      } else {
        Alert.alert("Erro", result.message || "Falha ao fazer login");
      }
    } catch (error) {
      console.error("Erro no login:", error);
      Alert.alert("Erro", "Ocorreu um erro ao fazer login");
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0a3d3d" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent} 
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.title}>Faça o Login</Text>

          <View style={styles.form}>
            <TextInput
              style={styles.input}
              placeholder="E-mail"
              placeholderTextColor="#5a8a8a"
              value={email}
              onChangeText={(text) => setEmail(text)}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              editable={!isLoggingIn}
            />

            <TextInput
              style={styles.input}
              placeholder="Senha"
              placeholderTextColor="#5a8a8a"
              value={senha}
              onChangeText={(text) => setSenha(text)}
              secureTextEntry={true}
              autoCapitalize="none"
              editable={!isLoggingIn}
            />

            <TouchableOpacity
              style={[styles.loginButton, isLoggingIn && styles.loginButtonDisabled]}
              onPress={handleLogin}
              disabled={isLoggingIn}
            >
              {isLoggingIn ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.loginButtonText}>Entrar</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity 
              onPress={() => router.push("/cadastro")}
              disabled={isLoggingIn}
            >
              <Text style={styles.link}>
                Não tem uma conta? <Text style={styles.linkBold}>Cadastre-se</Text>
              </Text>
            </TouchableOpacity>

            <TouchableOpacity 
              onPress={() => router.push("/cad_empresa")}
              disabled={isLoggingIn}
              style={styles.empresaLink}
            >
              <Text style={styles.link}>
                Cadastre sua <Text style={styles.linkBold}>Empresa</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      <BottomNav />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#001f2d" },
  keyboardView: { flex: 1 },
  scrollContent: { flexGrow: 1, justifyContent: "center", padding: 24 },
  title: { 
    fontSize: 28, 
    fontWeight: "bold", 
    color: "#fff", 
    marginBottom: 24, 
    textAlign: "center" 
  },
  form: { width: "100%" },
  input: { 
    backgroundColor: "#134949", 
    padding: 16, 
    borderRadius: 12, 
    color: "#fff", 
    marginBottom: 16,
    fontSize: 16 
  },
  loginButton: { 
    backgroundColor: "#1a7070", 
    padding: 16, 
    borderRadius: 12, 
    alignItems: "center", 
    marginBottom: 16 
  },
  loginButtonDisabled: {
    opacity: 0.7
  },
  loginButtonText: { 
    color: "#fff", 
    fontWeight: "bold", 
    fontSize: 16 
  },
  link: { 
    color: "#6eb5b5", 
    textAlign: "center", 
    marginTop: 8,
    fontSize: 14
  },
  linkBold: {
    fontWeight: "bold",
    color: "#3694AD"
  },
  empresaLink: {
    marginTop: 12
  }
});