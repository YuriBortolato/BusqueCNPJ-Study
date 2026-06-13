import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

interface Empresa {
  razao_social: string;
  cnpj: string;
  uf: string;
  municipio: string;
  nome_fantasia: string;
}

export default function SearchScreen() {
  const [cnpj, setCnpj] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [historico, setHistorico] = useState<Empresa[]>([]);
  
  const router = useRouter();

  const buscarCnpj = async () => {
    const cnpjLimpo = cnpj.replace(/\D/g, '');

    if (cnpjLimpo.length !== 14) {
      setError('O CNPJ deve conter 14 números.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${cnpjLimpo}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'CNPJ não encontrado na base de dados.');
      }

      const novaEmpresa: Empresa = {
        razao_social: data.razao_social,
        cnpj: data.cnpj,
        uf: data.uf,
        municipio: data.municipio,
        nome_fantasia: data.nome_fantasia || 'Não informado',
      };

      const existe = historico.some((item) => item.cnpj === novaEmpresa.cnpj);
      const novoHistorico = existe ? historico : [novaEmpresa, ...historico];
      
      setHistorico(novoHistorico);

      router.push({
        pathname: '/result',
        params: { 
          empresaData: JSON.stringify(novaEmpresa),
          historicoData: JSON.stringify(novoHistorico)
        },
      });

    } catch (err: any) {
      setError(err.message || 'Erro ao buscar o CNPJ. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Consulta CNPJ</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Digite o CNPJ (apenas números)"
        keyboardType="numeric"
        value={cnpj}
        onChangeText={(text) => {
          setCnpj(text);
          setError('');
        }}
      />

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <TouchableOpacity style={styles.button} onPress={buscarCnpj} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>BUSCAR</Text>}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center', backgroundColor: '#f5f5f5' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center', color: '#333' },
  input: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#ccc', padding: 15, borderRadius: 8, fontSize: 16, marginBottom: 10 },
  errorText: { color: 'red', marginBottom: 10, textAlign: 'center' },
  button: { backgroundColor: '#007BFF', padding: 15, borderRadius: 8, alignItems: 'center' },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});