import { Stack } from 'expo-router';

export default function Layout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false, // Remove o header padrão
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="cadastro" />
      <Stack.Screen name="sobre" />
      <Stack.Screen name="cad_caminhao" />
      <Stack.Screen name="perfil_caminhoneiro" />
      <Stack.Screen name ="empresas_salvas" />
      <Stack.Screen name="agendar_entrega" />
      <Stack.Screen name="agendamentos" />
      <Stack.Screen name="perfil_empresa" />
      <Stack.Screen name="Avisos" />
      <Stack.Screen name="display_qr" />
      <Stack.Screen name="Home" />
      <Stack.Screen name="cad_empresa" />
      <Stack.Screen name="vizualizar_motorista" />
      <Stack.Screen name="motoristas_cad" />
      <Stack.Screen name="caminhoes_cad" />
      <Stack.Screen name="agendamentos_feitos" />
      <Stack.Screen name="avisos_empresa" />
    </Stack>
  );
}