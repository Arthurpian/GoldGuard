import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors } from '../theme/colors'; // Certifique-se de que o caminho está correto

export default function AdicionarTransacaoScreen({ navigation }: any) {
  const [nomeCasa, setNomeCasa] = useState('');
  const [tipoTransacao, setTipoTransacao] = useState<'deposito' | 'saque' | null>(null);
  const [valor, setValor] = useState('');

  const handleSalvarTransacao = async () => {
    if (!nomeCasa || !tipoTransacao || !valor) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos.');
      return;
    }

    const valorNumerico = parseFloat(valor.replace(',', '.')); // Garante que é um número e aceita vírgula
    if (isNaN(valorNumerico) || valorNumerico <= 0) {
      Alert.alert('Erro', 'Por favor, insira um valor numérico válido maior que zero.');
      return;
    }

    const novaTransacao = {
      id: Date.now().toString(), // Um ID único baseado no timestamp
      nomeCasa,
      tipoTransacao,
      valor: valorNumerico,
      data: new Date().toISOString(), // Salva a data e hora da transação
    };

    try {
      // 1. Carregar transações existentes
      const transacoesSalvas = await AsyncStorage.getItem('transacoes');
      const transacoes = transacoesSalvas ? JSON.parse(transacoesSalvas) : [];

      // 2. Adicionar a nova transação
      transacoes.push(novaTransacao);
      await AsyncStorage.setItem('transacoes', JSON.stringify(transacoes));

      // 3. Atualizar os totais
      let totalGeral = parseFloat(await AsyncStorage.getItem('totalGeral') || '0');
      let totalSaques = parseFloat(await AsyncStorage.getItem('totalSaques') || '0');
      let totalDepositos = parseFloat(await AsyncStorage.getItem('totalDepositos') || '0');

      if (tipoTransacao === 'deposito') {
        totalGeral -= valorNumerico;
        totalDepositos += valorNumerico;
      } else { // saque
        totalGeral += valorNumerico;
        totalSaques += valorNumerico;
      }

      await AsyncStorage.setItem('totalGeral', totalGeral.toString());
      await AsyncStorage.setItem('totalSaques', totalSaques.toString());
      await AsyncStorage.setItem('totalDepositos', totalDepositos.toString());

      Alert.alert('Sucesso', 'Transação salva com sucesso!');
      navigation.goBack(); // Volta para a tela anterior (HomeScreen)
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
        placeholder="Valor (ex: 100.50)"
        keyboardType="numeric" // Garante que o teclado numérico seja exibido
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
    backgroundColor: Colors.deepBlue, // Ou outra cor de sua preferência
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
    backgroundColor: Colors.deepBlue, // Use uma cor de sua paleta
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