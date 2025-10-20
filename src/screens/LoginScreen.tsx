import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert } from "react-native";
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase/firebaseConnection';
import { Colors } from "../theme/colors";

export default function LoginScreen({ navigation }: any) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const handleLogin = async () => {
    if (!email || !senha) {
      Alert.alert("Atenção", "Preencha e-mail e senha.");
      return;
    }
    
    try {
      await signInWithEmailAndPassword(auth, email, senha);
    } catch (error) {
      console.log(error);
      Alert.alert("Erro", "E-mail ou senha inválidos!");
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/images/logo.png")} // Verifique se o caminho do logo está correto
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.titulo}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Digite seu e-mail"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Digite sua senha"
        value={senha}
        onChangeText={setSenha}
        secureTextEntry
      />
      <TouchableOpacity style={styles.botao} onPress={handleLogin}>
        <Text style={styles.botaoTexto}>Entrar</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("Register")}>
        <Text style={styles.linkTexto}>Não tem uma conta? Cadastre-se</Text>
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
    },
    botaoTexto: {
        color: Colors.richBlack,
        fontSize: 18,
        fontWeight: "bold",
    },
    logo: {
        width: 300,
        height: 300,
        marginBottom: 5,
    },
    linkTexto: {
        color: Colors.softWhite,
        marginTop: 20,
        fontSize: 16,
    }
});