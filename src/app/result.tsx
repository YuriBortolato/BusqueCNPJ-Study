import { useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { FlatList, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function ResultScreen() {
  const { empresaData, historicoData } = useLocalSearchParams();
  
  const dados = empresaData ? JSON.parse(empresaData as string) : null;
  const historico = historicoData ? JSON.parse(historicoData as string) : [];

  const [mostrarHistorico, setMostrarHistorico] = useState(false);

  if (!dados) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Nenhum dado encontrado.</Text>
      </View>
    );
  }

  const renderMainCard = (item: any) => (
    <View style={styles.card}>
      <Text style={styles.title}>Informações do CNPJ</Text>
      
      <View style={styles.row}>
        <Text style={styles.label}>RAZÃO SOCIAL</Text>
        <Text style={styles.value}>{item.razao_social}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>CNPJ</Text>
        <Text style={styles.value}>{item.cnpj}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>UF</Text>
        <Text style={styles.value}>{item.uf}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>MUNICÍPIO</Text>
        <Text style={styles.value}>{item.municipio}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>NOME FANTASIA</Text>
        <Text style={styles.value}>{item.nome_fantasia}</Text>
      </View>
    </View>
  );

  const renderHistoryCard = (item: any) => (
    <View style={styles.historyCard}>
      <Text style={styles.historyLabel}>Razão Social: <Text style={styles.historyValue}>{item.razao_social}</Text></Text>
      <Text style={styles.historyLabel}>CNPJ: <Text style={styles.historyValue}>{item.cnpj}</Text></Text>
      <Text style={styles.historyLabel}>UF: <Text style={styles.historyValue}>{item.uf}</Text></Text>
      <Text style={styles.historyLabel}>Município: <Text style={styles.historyValue}>{item.municipio}</Text></Text>
      <Text style={styles.historyLabel}>Nome Fantasia: <Text style={styles.historyValue}>{item.nome_fantasia}</Text></Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {!mostrarHistorico ? (
        <ScrollView style={styles.scrollArea}>
          {renderMainCard(dados)}
        </ScrollView>
      ) : (
        <View style={styles.historyContainer}>
          <Text style={styles.historyTitle}>Histórico de Consultas</Text>
          <FlatList
            data={historico}
            keyExtractor={(item, index) => item.cnpj + index}
            contentContainerStyle={{ paddingBottom: 20 }}
            renderItem={({ item }) => renderHistoryCard(item)}
          />
        </View>
      )}

      <TouchableOpacity 
        style={[styles.historyButton, mostrarHistorico && styles.backButton]} 
        onPress={() => setMostrarHistorico(!mostrarHistorico)}
      >
        <Text style={styles.historyButtonText}>
          {mostrarHistorico ? 'VOLTAR PARA A EMPRESA' : 'CONSULTAR HISTÓRICO'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', padding: 15 },
  scrollArea: { flex: 1 },
  historyContainer: { flex: 1 },
  historyTitle: { fontSize: 20, fontWeight: 'bold', textAlign: 'center', marginBottom: 15, color: '#333' },
  
  card: { backgroundColor: '#fff', padding: 20, borderRadius: 8, elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, marginBottom: 20 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 20, color: '#333', borderBottomWidth: 1, borderBottomColor: '#eee', paddingBottom: 10, textAlign: 'center' },
  row: { marginBottom: 15, borderBottomWidth: 1, borderBottomColor: '#f0f0f0', paddingBottom: 8 },
  label: { fontSize: 12, color: '#007BFF', fontWeight: 'bold', letterSpacing: 1 },
  value: { fontSize: 16, color: '#222', marginTop: 4, fontWeight: '500' },
  errorText: { color: 'red', textAlign: 'center', marginTop: 20, fontSize: 16 },
  
  historyCard: { backgroundColor: '#fff', padding: 12, borderRadius: 8, marginBottom: 10, borderWidth: 1, borderColor: '#ccc' },
  historyLabel: { fontWeight: 'bold', color: '#555', marginBottom: 2, fontSize: 13 },
  historyValue: { fontWeight: 'normal', color: '#222', fontSize: 13 },

  historyButton: { backgroundColor: '#343a40', padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 10 },
  backButton: { backgroundColor: '#007BFF' },
  historyButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' }
});