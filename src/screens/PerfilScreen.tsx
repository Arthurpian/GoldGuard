import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, TextInput, Alert, Modal, ScrollView } from 'react-native';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/firebaseConnection';
import { Colors } from '../theme/colors';

const avatars = [
  require('../assets/images/avatar/aguia.png'),
  require('../assets/images/avatar/dragao.png'),
  require('../assets/images/avatar/leao.png'),
  require('../assets/images/avatar/macaco.png'),
  require('../assets/images/avatar/pombo.png')
];
const defaultAvatar = require('../assets/images/avatar/dragao.png');

export default function PerfilScreen({ navigation }: any) {
  const [nome, setNome] = useState('');
  const [idade, setIdade] = useState('');
  const [email, setEmail] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState<number | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const loadProfileData = useCallback(async () => {
    const user = auth.currentUser;
    if (!user) return;

    try {
      const docRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        setNome(data.nome || '');
        setIdade(data.idade || '');
        setEmail(data.email || '');
        setSelectedAvatar(data.avatarIndex !== undefined && data.avatarIndex !== null ? data.avatarIndex : null);
      }
    } catch (error) {
      console.error("Erro ao carregar dados do perfil:", error);
    }
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', loadProfileData);
    return unsubscribe;
  }, [navigation, loadProfileData]);

  const handleSalvarPerfil = async () => {
    const user = auth.currentUser;
    if (!user) return;

    if (!nome) {
      Alert.alert('Erro', 'O nome não pode estar vazio.');
      return;
    }
    if (idade && (isNaN(parseInt(idade, 10)) || parseInt(idade, 10) <= 0)) {
        Alert.alert('Erro', 'Por favor, insira uma idade válida.');
        return;
    }

    try {
      const userDocRef = doc(db, 'users', user.uid);
      await updateDoc(userDocRef, {
        nome: nome,
        idade: idade,
        avatarIndex: selectedAvatar,
      });
      
      Alert.alert('Sucesso', 'Perfil atualizado com sucesso!');
    } catch (error) {
      console.error("Erro ao salvar perfil:", error);
      Alert.alert('Erro', 'Não foi possível salvar o perfil.');
    }
  };

  const currentAvatarSource = selectedAvatar !== null ? avatars[selectedAvatar] : defaultAvatar;

  return (
    <ScrollView contentContainerStyle={styles.scrollContent}>
      <View style={styles.container}>

        <Text style={styles.titulo}>Meu Perfil</Text>

        <View style={styles.avatarSection}> 
          <TouchableOpacity onPress={() => setModalVisible(true)}>
            <Image
              source={currentAvatarSource}
              style={styles.avatar}
            />
            <Text style={styles.changeAvatarText}>Mudar Avatar</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Nome:</Text>
          <TextInput
            style={styles.input}
            placeholder="Seu nome"
            value={nome}
            onChangeText={setNome}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Idade:</Text>
          <TextInput
            style={styles.input}
            placeholder="Sua idade"
            keyboardType="numeric"
            value={idade}
            onChangeText={setIdade}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>E-mail:</Text>
          <Text style={styles.emailText}>{email || 'E-mail não disponível'}</Text>
        </View>

        <TouchableOpacity style={styles.botaoSalvar} onPress={handleSalvarPerfil}>
          <Text style={styles.botaoTexto}>Salvar Perfil</Text>
        </TouchableOpacity>

        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalBackground}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>Escolha seu Avatar</Text>
              <View style={styles.avatarGrid}>
                {avatars.map((avatarSource, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.avatarOption,
                      selectedAvatar === index && styles.avatarOptionSelected
                    ]}
                    onPress={() => {
                      setSelectedAvatar(index);
                      setModalVisible(false);
                    }}
                  >
                    <Image source={avatarSource} style={styles.avatarOptionImage} />
                  </TouchableOpacity>
                ))}
              </View>
              <TouchableOpacity style={styles.closeModalButton} onPress={() => setModalVisible(false)}>
                <Text style={styles.closeModalButtonText}>Fechar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

      </View>
    </ScrollView>
  );
}

// Seus estilos originais de PerfilScreen
const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingVertical: 30, 
  },
  container: {
    flex: 1,
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 20,
  },
  titulo: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#333',
    paddingTop: 25,
  },
  avatarSection: { 
    alignItems: 'center',
    marginBottom: 30, 
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: Colors.deepBlue,
    marginBottom: 10,
  },
  changeAvatarText: {
    color: Colors.deepBlue,
    fontSize: 16,
    textDecorationLine: 'underline',
    textAlign: 'center', 
  },
  inputGroup: {
    width: '90%',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: '#555',
    marginBottom: 5,
    fontWeight: 'bold',
  },
  input: {
    width: '100%',
    padding: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    fontSize: 18,
    backgroundColor: '#fff',
  },
  emailText: {
    width: '100%',
    padding: 15,
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 8,
    fontSize: 18,
    backgroundColor: '#f9f9f9',
    color: '#666',
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
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContainer: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  avatarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 20,
  },
  avatarOption: {
    margin: 10,
    borderWidth: 2,
    borderColor: 'transparent',
    borderRadius: 50,
  },
  avatarOptionSelected: {
    borderColor: Colors.deepBlue,
  },
  avatarOptionImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  closeModalButton: {
    marginTop: 15,
    padding: 12,
    backgroundColor: '#ccc',
    borderRadius: 8,
    width: '60%',
    alignItems: 'center',
  },
  closeModalButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
});