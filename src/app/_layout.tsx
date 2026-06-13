import { Stack } from 'expo-router';

export default function Layout() {
  return (
    <Stack>
      {/* Tela inicial de Busca */}
      <Stack.Screen 
        name="index" 
        options={{ 
          title: 'Buscar Empresa',
          headerTitleAlign: 'center'
        }} 
      />
      
      {/* Tela de Resultados */}
      <Stack.Screen 
        name="result" 
        options={{ 
          title: 'Detalhes do CNPJ',
          headerTitleAlign: 'center'
        }} 
      />
    </Stack>
  );
}