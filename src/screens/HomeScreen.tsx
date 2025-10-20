import React, { useState, useCallback } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, RefreshControl, Alert } from "react-native"; 
import { useFocusEffect } from '@react-navigation/native';
import { doc, getDoc, collection, getDocs, query, orderBy, deleteDoc } from 'firebase/firestore'; 
import { auth, db } from '../firebase/firebaseConnection';
import { Colors } from "../theme/colors";
import { Ionicons } from "@expo/vector-icons"; 
interface Transacao {
  id: string;
  nomeCasa: string;
  tipoTransacao: 'deposito' | 'saque';
  valor: number;
  data: string;
}

export default function HomeScreen({ navigation }: any) {
  const [profileName, setProfileName] = useState("");
  const [totalGeral, setTotalGeral] = useState(0);
  const [totalSaques, setTotalSaques] = useState(0);
  const [totalDepositos, setTotalDepositos] = useState(0);
  const [transacoes, setTransacoes] = useState<Transacao[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = useCallback(async () => {
    const user = auth.currentUser;
    if (!user) return;

    setRefreshing(true);
    try {
      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        setProfileName(userDoc.data().nome || user.email);
      }

      const transacoesRef = collection(db, "users", user.uid, "transactions");
      const q = query(transacoesRef, orderBy("data", "desc"));
      const querySnapshot = await getDocs(q);
      
      let depositos = 0;
      let saques = 0;
      const transacoesList: Transacao[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data() as Omit<Transacao, 'id'>;
        transacoesList.push({ id: doc.id, ...data });

        if (data.tipoTransacao === 'deposito') {
          depositos += data.valor;
        } else {
          saques += data.valor;
        }
      });
      
      setTransacoes(transacoesList);
      setTotalDepositos(depositos);
      setTotalSaques(saques);
      setTotalGeral(saques - depositos);

    } catch (error) {
      console.error("Erro ao carregar dados do Firestore:", error);
    } finally {
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  const handleDeleteTransaction = async (transactionId: string) => {
    const user = auth.currentUser;
    if (!user) return;

    Alert.alert(
      "Confirmar Exclusão",
      "Você tem certeza que deseja apagar esta transação? Esta ação não pode ser desfeita.",
      [
        {
          text: "Cancelar",
          style: "cancel"
        },
        { 
          text: "Apagar", 
          onPress: async () => {
            try {
              const transactionDocRef = doc(db, "users", user.uid, "transactions", transactionId);
              await deleteDoc(transactionDocRef);
              loadData(); 
            } catch (error) {
              console.error("Erro ao deletar transação:", error);
              Alert.alert("Erro", "Não foi possível apagar a transação.");
            }
          },
          style: "destructive" 
        }
      ]
    );
  };
  
  const handleLogout = async () => {
    await auth.signOut();
  };
  
  const adicionar = () => {
    navigation.navigate('AdicionarTransacao');
  }

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
        <TouchableOpacity style={styles.botaoSair} onPress={handleLogout}>
          <Text style={styles.botaoTexto}>Sair</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.view01}>
        <Text style={styles.resumoTitulo}>Total: {formatCurrency(totalGeral)}</Text>
        <Text style={styles.resumoTitulo}>Depósitos: {formatCurrency(totalDepositos)}</Text>
        <Text style={styles.resumoTitulo}>Saques: {formatCurrency(totalSaques)}</Text>
      </View>

      <View style={styles.view02}>
        <Text style={styles.tituloExtrato}>Extrato</Text>
        <TouchableOpacity style={styles.Add} onPress={adicionar}>
          <Text style={styles.botaoTexto}>+</Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.view03}
        contentContainerStyle={styles.view03Content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={loadData} colors={[Colors.luxuryGold]} tintColor={Colors.luxuryGold} />
        }
      >
        {transacoes.length === 0 ? (
          <Text style={styles.noTransactionsText}>Nenhuma transação registrada.</Text>
        ) : (
          transacoes.map((item) => (
    
            <View key={item.id} style={styles.transactionItem}>
              <View style={styles.transactionDetails}>
                <Text style={styles.transactionText}>{item.nomeCasa}</Text>
                <Text style={[
                  styles.transactionValue,
                  item.tipoTransacao === 'deposito' ? styles.depositoText : styles.saqueText
                ]}>
                  {item.tipoTransacao === 'deposito' ? '-' : '+'} {formatCurrency(item.valor)}
                </Text>
              </View>

              <TouchableOpacity onPress={() => handleDeleteTransaction(item.id)} style={styles.deleteButton}>
                <Ionicons name="trash-outline" size={24} color="red" />
              </TouchableOpacity>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

// **** ADIÇÃO DE NOVOS ESTILOS ****
const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    alignItems: "center", 
    justifyContent: "flex-start", 
    marginTop: 50,
  },
  ola: { 
    flexDirection: 'row',
    width: '90%',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  titulo: { 
    fontSize: 24,
    fontWeight: 'bold',
  },
  tituloExtrato: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  botaoSair: {
    backgroundColor: "red", 
    padding: 10, 
    borderRadius: 8, 
  },
  botaoTexto: { 
    color: "#fff", 
    fontWeight: "bold", 
    fontSize: 16,
  },
  view01: { 
    justifyContent: "center",
    backgroundColor: Colors.luxuryGold,
    borderRadius: 8,
    width: "90%",
    padding: 20,
    marginBottom: 20,
  },
  resumoTitulo: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  view02: { 
    width: '90%', 
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  Add: {
    backgroundColor: Colors.deepBlue, 
    borderRadius: 50,
    width: 45,
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
  },
  view03: {
    width: '90%',
    flex: 1,
  },
  view03Content: {
    paddingBottom: 20,
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
    borderRadius: 8,
    marginBottom: 8, 
  },
  
  transactionDetails: {
    flex: 1, 
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
    color: 'red',
  },
  saqueText: {
    color: 'green',
  },
  
  deleteButton: {
    padding: 5, 
    marginLeft: 10, 
  },
});