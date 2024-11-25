import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, SafeAreaView, ActivityIndicator, Button, Alert, TextInput } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { getTeamById, deleteTeamById, updateTeam, Team } from './api/apiServices';

export default function Details() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [team, setTeam] = useState<Team | null>(null); 
  const [loading, setLoading] = useState(true);
  const [newDescription, setNewDescription] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchTeam = async () => {
      if (!id) return;
      const data = await getTeamById(id);
      if (data) {
        setTeam(data); 
        setNewDescription(data.description);
      }
      setLoading(false);
    };

    fetchTeam();
  }, [id]);

  const handleDelete = async () => {
    if (!team) return;
    Alert.alert(
      'Confirmar eliminación',
      '¿Estás seguro de que deseas eliminar este equipo?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Eliminar',
          onPress: async () => {
            const success = await deleteTeamById(id);
            if (success) {
              Alert.alert('Eliminado', 'El equipo ha sido eliminado correctamente', [
                {
                  text: 'OK',
                  onPress: () => router.replace('/'),
                },
              ]);
            } else {
              Alert.alert('Error', 'No se pudo eliminar el equipo');
            }
          },
        },
      ]
    );
  };

  const handleUpdateTeam = async () => {
    if (team) {
      const updatedTeam = { ...team, description: newDescription };
      const success = await updateTeam(id, updatedTeam);
      if (success) {
        Alert.alert('Actualizado', 'El equipo ha sido actualizado correctamente');
        setIsEditing(false);
      } else {
        Alert.alert('Error', 'No se pudo actualizar el equipo');
      }
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ActivityIndicator size="large" color="#0000ff" />
      </SafeAreaView>
    );
  }

  if (!team) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Text style={styles.error}>Equipo no encontrado</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.teamName}>{team.name}</Text>

        {isEditing ? (
          <TextInput
            style={styles.input}
            value={newDescription}
            onChangeText={setNewDescription}
            placeholder="Editar descripción"
          />
        ) : (
          <Text style={styles.description}>{team.description}</Text>
        )}

        {isEditing ? (
          <Button title="Actualizar Equipo" onPress={handleUpdateTeam} />
        ) : (
          <Button title="Editar Equipo" onPress={() => setIsEditing(true)} />
        )}

        <Button title="Eliminar Equipo" color="red" onPress={handleDelete} />

        <Text style={styles.backText} onPress={() => router.replace('/')}>
          Volver al inicio
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff', paddingHorizontal: 20 },
  container: { alignItems: 'center', marginTop: 20 },
  teamName: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  description: { fontSize: 16, textAlign: 'center', marginBottom: 20 },
  error: { fontSize: 20, color: 'red', textAlign: 'center' },
  backText: { fontSize: 18, color: '#007bff', marginTop: 20, textDecorationLine: 'underline' },
  input: {
    width: '100%',
    backgroundColor: '#f2f2f2',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    color: '#000',
  },
});
