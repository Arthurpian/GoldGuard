import React, { useEffect, useState, useCallback } from "react"; // Adicione useCallback
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, RefreshControl } from "react-native"; // Adicione ScrollView e RefreshControl
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Colors } from "../theme/colors";

// Defina uma interface para a transação para melhor tipagem (se estiver usando TypeScript)
interface Transacao {
  id: string;
  nomeCasa: string;
  tipoTransacao: 'deposito' | 'saque';
  valor: number;
  data: string;
}

export default function HomeScreen({ navigation }: any) {
  const [user, setUser] = useState("");
  const [profileName, setProfileName] = useState("");
  const [totalGeral, setTotalGeral] = useState(0);
  const [totalSaques, setTotalSaques] = useState(0);
  const [totalDepositos, setTotalDepositos] = useState(0);
  const [transacoes, setTransacoes] = useState<Transacao[]>([]); // Estado para as transações
  const [refreshing, setRefreshing] = useState(false); // Estado para o Pull-to-Refresh

  // Função para carregar todos os dados (usuário, totais, transações)
  const loadData = useCallback(async () => {
    setRefreshing(true);
    try {
      const savedUser = await AsyncStorage.getItem("usuario");
      if (savedUser) setUser(savedUser);

      const savedProfileName = await AsyncStorage.getItem("userNome"); // <-- Carrega o nome do perfil
      if (savedProfileName) {
        setProfileName(savedProfileName);
      } else if (savedUser) {
        setProfileName(savedUser); // Se não houver nome no perfil, usa o nome do login
      } else {
        setProfileName('Visitante'); // Se não tiver nenhum, use um padrão
      }

      const savedTotalGeral = await AsyncStorage.getItem("totalGeral");
      setTotalGeral(parseFloat(savedTotalGeral || '0'));

      const savedTotalSaques = await AsyncStorage.getItem("totalSaques");
      setTotalSaques(parseFloat(savedTotalSaques || '0'));

      const savedTotalDepositos = await AsyncStorage.getItem("totalDepositos");
      setTotalDepositos(parseFloat(savedTotalDepositos || '0'));
  
      const savedTransacoes = await AsyncStorage.getItem("transacoes");
      setTransacoes(savedTransacoes ? JSON.parse(savedTransacoes) : []);

      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      } finally {
        setRefreshing(false);
      }
  }, []);

  useEffect(() => {
    loadData();

    // Adiciona um listener para recarregar a tela sempre que ela for focada
    const unsubscribe = navigation.addListener('focus', () => {
      loadData();
    });

    return unsubscribe; // Limpa o listener ao desmontar
  }, [navigation, loadData]); // Dependências do useEffect

  const handleLogout = async () => {
    navigation.replace("Login");
  };

  const adicionar = () => {
    navigation.navigate('AdicionarTransacao'); // Navega para a tela de adicionar transação
  }

  // Função auxiliar para formatar valores monetários
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  return (
    <View style={styles.container}>
      <View style={styles.ola}>
        <Text style={styles.titulo}>Bem-vindo, {profileName} 👋</Text>
        <TouchableOpacity style={styles.botao} onPress={handleLogout}>
          <Text style={styles.botaoTexto}>Sair</Text>
        </TouchableOpacity>
      </View>

      // Na HomeScreen, dentro da view01
      <View style={styles.view01}>
        <Text style={styles.resumoTitulo}>Total: {formatCurrency(totalGeral)}</Text>
        <Text style={styles.resumoTitulo}>Depósitos: {formatCurrency(totalDepositos)}</Text>
        <Text style={styles.resumoTitulo}>Saques: {formatCurrency(totalSaques)}</Text>
      </View>

      <View style={styles.view02}>
        <Text style={styles.tituloExtrato}>Extrato</Text> {/* Mudei o nome do estilo para evitar conflito de tamanho */}
        <TouchableOpacity style={styles.Add} onPress={adicionar}>
          <Text style={styles.botaoTexto}>+</Text>
        </TouchableOpacity>
      </View>

      {/* Nova View para o histórico de transações - view03 */}
      <ScrollView 
        style={styles.view03}
        contentContainerStyle={styles.view03Content} // Estilo para o conteúdo dentro do ScrollView
        refreshControl={ // Adiciona funcionalidade de Pull-to-Refresh
          <RefreshControl refreshing={refreshing} onRefresh={loadData} />
        }
      >
        {transacoes.length === 0 ? (
          <Text style={styles.noTransactionsText}>Nenhuma transação registrada ainda.</Text>
        ) : (
          [...transacoes].reverse().map((item) => ( // Inverte a ordem para mostrar as mais recentes primeiro
            <View key={item.id} style={styles.transactionItem}>
              <Text style={styles.transactionText}>{item.nomeCasa}</Text>
              <Text style={[
                styles.transactionValue,
                item.tipoTransacao === 'deposito' ? styles.depositoText : styles.saqueText
              ]}>
                {item.tipoTransacao === 'deposito' ? '-' : '+'} {formatCurrency(item.valor)}
              </Text>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    alignItems: "center", 
    justifyContent: "flex-start", 
    marginTop: 50, // Ajustei a margem superior
  },
  ola: { 
    width: '90%', // Para alinhar com os outros cards
    justifyContent: 'space-between', // Para empurrar o botão para a direita
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 5, // Pequeno padding para não colar nas bordas
    paddingTop: 10,
  },
  titulo: { 
    fontSize: 24,
    fontWeight: 'bold', // Para destacar o nome do usuário
  },
  tituloExtrato: { // Novo estilo para o título do extrato
    fontSize: 24,
    fontWeight: 'bold',
  },
  botao: { 
    backgroundColor: "red", 
    padding: 10, 
    borderRadius: 8, 
    margin: 10,
  },
  botaoTexto: { 
    color: "#fff", 
    fontWeight: "bold", 
    fontSize: 16, // Aumentei um pouco a fonte
  },
  view01: { 
    alignItems: "baseline", 
    justifyContent: "center",
    backgroundColor: Colors.luxuryGold,
    borderRadius: 8,
    width: "90%",
    height: 150,
    marginBottom: 10, // Espaçamento entre os cards
    paddingLeft: 19, // Ajuste para o texto
  },
  resumoTitulo: {
    fontSize: 20, // Ajustei o tamanho da fonte
    fontWeight: 'bold',
    marginBottom: 5, // Espaçamento entre as linhas
  },
  view02: { 
    width: '90%', 
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 5,
    marginBottom: 10, // Espaçamento entre o título do extrato e a lista
  },
  Add: {
    backgroundColor: Colors.deepBlue, 
    padding: 10,
    borderRadius: 50,
    width: 45, // Defini largura e altura para ser um círculo perfeito
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Estilos para a nova view03 e itens de transação
  view03: {
    width: '90%',
    flex: 1, // Para ocupar o restante do espaço disponível
    backgroundColor: '#f0f0f0', // Cor de fundo para o histórico
    borderRadius: 8,
    padding: 10,
  },
  view03Content: {
    paddingBottom: 20, // Espaço no final da lista
  },
  noTransactionsText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#666',
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    backgroundColor: '#fff',
    borderRadius: 5,
    marginBottom: 5,
  },
  transactionText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  transactionValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  depositoText: {
    color: 'red', // Verde para depósito
  },
  saqueText: {
    color: 'green', // Vermelho para saque
  },
});