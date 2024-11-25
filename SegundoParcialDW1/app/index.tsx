import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList, Image, ActivityIndicator, SafeAreaView, TouchableOpacity, Modal, TextInput, Button, Platform } from 'react-native';
import { getTeams, addTeam, Team } from './api/apiServices';
import { Link } from 'expo-router';

export default function Home() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [newTeam, setNewTeam] = useState({ name: '', description: '', logo: '' });
  const [lastId, setLastId] = useState(0);

  const fetchTeams = async () => {
    setLoading(true);
    try {
      const data = await getTeams();
      setTeams(data);


      if (data && data.length > 0) {
        const maxId = Math.max(...data.map((team : Team) => parseInt(team.id, 10) || 0));
        setLastId(maxId);
      }
    } catch (error) {
      console.error('Error fetching teams:', error);
      alert('No se pudieron cargar los equipos. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  const handleAddTeam = async () => {
    if (newTeam.name && newTeam.description && newTeam.logo) {
      const newId = lastId + 1; 
      const teamToAdd: Team = {
        id: newId.toString(),
        points: 0,
        goals: 0,
        ...newTeam,
      };

      try {
        const success = await addTeam(teamToAdd);
        if (success) {
          setLastId(newId); 
          setNewTeam({ name: '', description: '', logo: '' });
          setModalVisible(false);
          fetchTeams();
        } else {
          alert('Error al agregar el equipo. Intenta nuevamente.');
        }
      } catch (error) {
        console.error('Error adding team:', error);
        alert('Error al agregar el equipo.');
      }
    } else {
      alert('Por favor, completa todos los campos.');
    }
  };

  const renderItem = ({ item }: { item: Team }) => (
    <Link
      href={{
        pathname: '/details',
        params: { id: item.id },
      }}
      style={styles.card}
    >
      <Image source={{ uri: item.logo }} style={styles.teamImage} />
      <Text style={styles.teamName}>{item.name}</Text>
    </Link>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ActivityIndicator size="large" color="#0000ff" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <Text style={styles.pageTitle}>FIFA - Equipos Oficiales</Text>

      <TouchableOpacity
        style={platformStyles.addButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={platformStyles.addButtonText}>+ {Platform.OS === 'android' ? 'Nuevo Equipo' : 'Crear Equipo'}</Text>
      </TouchableOpacity>

      <FlatList
        data={teams}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
      />

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Agregar Nuevo Equipo</Text>
            <TextInput
              style={styles.input}
              placeholder="Nombre del equipo"
              placeholderTextColor="#555"
              value={newTeam.name}
              onChangeText={(text) => setNewTeam({ ...newTeam, name: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Descripción"
              placeholderTextColor="#555"
              value={newTeam.description}
              onChangeText={(text) => setNewTeam({ ...newTeam, description: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="URL del logo"
              placeholderTextColor="#555"
              value={newTeam.logo}
              onChangeText={(text) => setNewTeam({ ...newTeam, logo: text })}
            />

            <View style={styles.modalButtons}>
              <Button title="Agregar" onPress={handleAddTeam} />
              <Button title="Cancelar" color="red" onPress={() => setModalVisible(false)} />
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const platformStyles = StyleSheet.create({
  addButton: {
    alignSelf: Platform.OS === 'android' ? 'flex-start' : 'flex-end',
    backgroundColor: Platform.OS === 'android' ? 'blue' : 'green',
    padding: 12,
    borderRadius: 10,
    marginVertical: 10,
  },
  addButtonText: {
    color: Platform.OS === 'android' ? 'white' : 'black',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },
});

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f7f7f7',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 20 : 0,
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
    color: '#333',
    marginVertical: 20,
  },
  card: {
    flex: 1,
    margin: 10,
    padding: 15,
    borderRadius: 15,
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    alignItems: 'center',
    justifyContent: 'center',
    maxWidth: '90%',
    minHeight: 150,
  },
  teamImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: '#ddd',
  },
  teamName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '85%',
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    backgroundColor: '#f2f2f2',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    color: '#333',
    fontSize: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
});
