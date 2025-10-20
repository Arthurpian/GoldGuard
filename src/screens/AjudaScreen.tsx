import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { Colors } from '../theme/colors';

export default function AjudaScreen() {
  const openLink = (url: string) => {
    Linking.openURL(url).catch(err => console.error("Couldn't load page", err));
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Text style={styles.tituloPrincipal}>Os Riscos das Apostas Esportivas</Text>
      <Text style={styles.subtitulo}>Informação e Conscientização</Text>


      <View style={styles.cardMateria}>
        <Text style={styles.tituloMateria}>O Lado Sombrio das Apostas Online: Entenda os Perigos</Text>
        <Text style={styles.paragrafo}>
          As apostas esportivas online cresceram exponencialmente, atraindo milhões de pessoas com a promessa de ganhos rápidos e emoção. No entanto, é crucial entender que essa atividade carrega riscos significativos que podem afetar a saúde financeira, mental e social dos indivíduos.
        </Text>
        <TouchableOpacity 
          style={styles.linkButton} 
          onPress={() => openLink('https://pp.nexojornal.com.br/perguntas-que-a-ciencia-ja-respondeu/2024/10/29/o-vicio-em-apostas-sinais-consequencias-tratamentos-e-recomendacoes-em-9-pontos')} 

        >
          <Text style={styles.linkButtonText}>Leia mais sobre os perigos</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.disclaimer}>
        <Text style={styles.disclaimerText}>
          Esta seção tem o objetivo de conscientizar sobre os riscos das apostas e não deve ser interpretada como um conselho financeiro ou psicológico. Em caso de dúvidas ou necessidade de ajuda, procure profissionais qualificados.
        </Text>
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5', 
  },
  contentContainer: {
    padding: 20,
    paddingTop: 50, 
    alignItems: 'center',
  },
  tituloPrincipal: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitulo: {
    fontSize: 18,
    color: '#666',
    marginBottom: 30,
    textAlign: 'center',
  },
  cardMateria: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    marginBottom: 25,
    width: '100%',
    maxWidth: 600, 
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tituloMateria: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.deepBlue, 
  },
  paragrafo: {
    fontSize: 16,
    lineHeight: 24,
    color: '#444',
    marginBottom: 10,
  },
  listItem: {
    fontSize: 16,
    lineHeight: 24,
    color: '#444',
    marginLeft: 10,
    marginBottom: 5,
  },
  linkButton: {
    marginTop: 15,
    backgroundColor: Colors.luxuryGold, 
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  linkButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  disclaimer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#fff3cd', 
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ffeeba',
    width: '100%',
    maxWidth: 600,
  },
  disclaimerText: {
    fontSize: 14,
    color: '#856404',
    textAlign: 'center',
  },
});