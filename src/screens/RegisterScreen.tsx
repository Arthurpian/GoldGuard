import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/firebaseConnection';
import { Colors } from '../theme/colors';

export default function RegisterScreen({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [nome, setNome] = useState('');

  const handleRegister = async () => {
    if (!email || !senha || !nome) {
      Alert.alert("Erro", "Por favor, preencha todos os campos.");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, senha);
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        nome: nome,
        email: user.email,
        idade: '',
        avatarIndex: null,
        createdAt: new Date().toISOString(),
      });
      
    } catch (error: any) {
      console.error(error);
      if (error.code === 'auth/email-already-in-use') {
        Alert.alert("Erro", "Este e-mail já está em uso.");
      } else if (error.code === 'auth/weak-password') {
        Alert.alert("Erro", "A senha deve ter pelo menos 6 caracteres.");
      } else {
        Alert.alert("Erro", "Não foi possível criar a conta.");
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Criar Conta</Text>

      <TextInput
        style={styles.input}
        placeholder="Seu nome"
        value={nome}
        onChangeText={setNome}
      />
      <TextInput
        style={styles.input}
        placeholder="Digite seu e-mail"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Crie uma senha"
        value={senha}
        onChangeText={setSenha}
        secureTextEntry
      />

      <TouchableOpacity style={styles.botao} onPress={handleRegister}>
        <Text style={styles.botaoTexto}>Cadastrar</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={styles.linkTexto}>Já tenho uma conta</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.richBlack,
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
    },
    titulo: {
        fontSize: 28,
        marginBottom: 20,
        fontWeight: "bold",
        color: Colors.luxuryGold,
    },
    input: {
        width: "100%",
        height: 50,
        borderWidth: 1,
        borderColor: Colors.deepBlue,
        borderRadius: 10,
        paddingHorizontal: 15,
        backgroundColor: Colors.softWhite,
        marginBottom: 15,
        color: Colors.richBlack,
    },
    botao: {
        backgroundColor: Colors.luxuryGold,
        padding: 15,
        borderRadius: 10,
        width: "100%",
        alignItems: "center",
        marginTop: 10,
    },
    botaoTexto: {
        color: Colors.richBlack,
        fontSize: 18,
        fontWeight: "bold",
    },
    linkTexto: {
        color: Colors.softWhite,
        marginTop: 20,
        fontSize: 16,
    }
});