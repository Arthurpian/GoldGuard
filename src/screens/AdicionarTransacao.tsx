import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { collection, addDoc } from 'firebase/firestore';
import { db, auth } from '../firebase/firebaseConnection';
import { Colors } from '../theme/colors';

export default function AdicionarTransacaoScreen({ navigation }: any) {
  const [nomeCasa, setNomeCasa] = useState('');
  const [tipoTransacao, setTipoTransacao] = useState<'deposito' | 'saque' | null>(null);
  const [valor, setValor] = useState('');

  const handleSalvarTransacao = async () => {
    const user = auth.currentUser;
    if (!user) {
      Alert.alert('Erro', 'Você precisa estar logado para adicionar uma transação.');
      return;
    }

    if (!nomeCasa || !tipoTransacao || !valor) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos.');
      return;
    }

    const valorNumerico = parseFloat(valor.replace(',', '.'));
    if (isNaN(valorNumerico) || valorNumerico <= 0) {
      Alert.alert('Erro', 'Por favor, insira um valor numérico válido.');
      return;
    }

    try {
      const userTransactionsRef = collection(db, "users", user.uid, "transactions");

      await addDoc(userTransactionsRef, {
        nomeCasa,
        tipoTransacao,
        valor: valorNumerico,
        data: new Date().toISOString(),
      });

      Alert.alert('Sucesso', 'Transação salva com sucesso!');
      navigation.goBack();
    } catch (error) {
      console.error('Erro ao salvar transação:', error);
      Alert.alert('Erro', 'Não foi possível salvar a transação.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Adicionar Transação</Text>

      <TextInput
        style={styles.input}
        placeholder="Nome da Casa de Aposta"
        value={nomeCasa}
        onChangeText={setNomeCasa}
      />

      <View style={styles.radioContainer}>
        <TouchableOpacity
          style={[styles.radioButton, tipoTransacao === 'deposito' && styles.radioButtonSelected]}
          onPress={() => setTipoTransacao('deposito')}
        >
          <Text style={[styles.radioText, tipoTransacao === 'deposito' && styles.radioTextSelected]}>Depósito</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.radioButton, tipoTransacao === 'saque' && styles.radioButtonSelected]}
          onPress={() => setTipoTransacao('saque')}
        >
          <Text style={[styles.radioText, tipoTransacao === 'saque' && styles.radioTextSelected]}>Saque</Text>
        </TouchableOpacity>
      </View>

      <TextInput
        style={styles.input}
        placeholder="Valor (ex: 100,50)"
        keyboardType="numeric"
        value={valor}
        onChangeText={setValor}
      />

      <TouchableOpacity style={styles.botaoSalvar} onPress={handleSalvarTransacao}>
        <Text style={styles.botaoTexto}>Salvar Transação</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginTop: 50,
  },
  titulo: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  input: {
    width: '90%',
    padding: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 20,
    fontSize: 18,
  },
  radioContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '90%',
    marginBottom: 20,
  },
  radioButton: {
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    width: '45%',
    alignItems: 'center',
  },
  radioButtonSelected: {
    backgroundColor: Colors.deepBlue,
    borderColor: Colors.deepBlue,
  },
  radioText: {
    fontSize: 18,
    color: '#333',
  },
  radioTextSelected: {
    color: '#fff',
    fontWeight: 'bold',
  },
  botaoSalvar: {
    backgroundColor: Colors.deepBlue,
    padding: 18,
    borderRadius: 10,
    width: '90%',
    alignItems: 'center',
    marginTop: 30,
  },
  botaoTexto: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});