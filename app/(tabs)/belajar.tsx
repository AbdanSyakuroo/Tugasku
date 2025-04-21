import { View, Text, TextInput, TouchableOpacity, FlatList, ScrollView, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import tw from 'twrnc';
import { taskService, Task } from '../../services/taskService';

const belajar = () => {
  const [showForm, setShowForm] = useState(false);
  const [task, setTask] = useState('');
  const [mapel, setMapel] = useState('');
  const [deadline, setDeadline] = useState('');
  const [category, setCategory] = useState('');
  const [list, setList] = useState<Task[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState<string>('');

  const loadTasks = async () => {
    try {
      const tasks = await taskService.getAllTasks();
      setList(tasks);
    } catch (error) {
      console.error('Error loading tasks:', error);
      Alert.alert('Error', 'Gagal memuat data tugas');
    }
  };

  const addTask = async () => {
    if (!task.trim() || !mapel.trim() || !deadline.trim()) return;

    const newTask = {
      task: task.trim(),
      mapel: mapel.trim(),
      deadline: deadline.trim(),
      isCompleted: false,
      category: category,
    };

    try {
      if (editId) {
        await taskService.updateTask(editId, newTask);
      } else {
        await taskService.createTask(newTask);
      }
      loadTasks();
      resetForm();
    } catch (error) {
      console.error('Error saving task:', error);
      Alert.alert('Error', 'Gagal menyimpan tugas');
    }
  };

  const toggleComplete = async (id: string) => {
    try {
      const taskToUpdate = list.find(item => item.id === id);
      if (taskToUpdate) {
        await taskService.updateTask(id, {
          ...taskToUpdate,
          isCompleted: !taskToUpdate.isCompleted
        });
        loadTasks();
      }
    } catch (error) {
      console.error('Error updating task:', error);
      Alert.alert('Error', 'Gagal mengupdate status tugas');
    }
  };

  const deleteTask = async (id: string) => {
    Alert.alert(
      'Konfirmasi Hapus',
      'Apakah kamu yakin ingin menghapus tugas ini?',
      [
        {
          text: 'Batal',
          style: 'cancel',
        },
        {
          text: 'Hapus',
          style: 'destructive',
          onPress: async () => {
            try {
              await taskService.deleteTask(id);
              loadTasks();
            } catch (error) {
              console.error('Error deleting task:', error);
              Alert.alert('Error', 'Gagal menghapus tugas');
            }
          },
        },
      ]
    );
  };

  const startEdit = (item: Task) => {
    setTask(item.task);
    setMapel(item.mapel);
    setDeadline(item.deadline);
    setEditId(item.id || '');
    setCategory(item.category);
    setShowForm(true);
  };

  const resetForm = () => {
    setTask('');
    setMapel('');
    setDeadline('');
    setEditId('');
    setCategory('');
    setShowForm(false);
  };

  useEffect(() => {
    loadTasks();
  }, []);

  return (
    <SafeAreaView style={tw`flex-1 bg-gray-200 h-full`}>
      <ScrollView>
        <View style={tw`bg-blue-600 w-full h-50 flex justify-center`}>
          <Text style={tw`text-white font-bold text-3xl ml-5 mt-5`}>Tugasku.Id</Text>
          <Text style={tw`text-white font-normal text-sm ml-5.5`}>Tempat Menyimpan Seluruh Tugasmu Disini</Text>
        </View>

        <View style={tw`bg-white bottom-12 mt-4 py-2 rounded-t-3xl rounded-b-md p-4 shadow-xl`}>
          {showForm && (
            <>
              <Text style={tw`text-xl font-black mb-5`}>{editId ? 'Edit Data' : 'Tambah Daftar'}</Text>
              <TextInput
                style={tw`border border-gray-300 rounded p-2 mb-2 bg-white shadow-xl`}
                placeholder="Nama Tugas"
                value={task}
                onChangeText={setTask}
              />
              <TextInput
                style={tw`border border-gray-300 rounded p-2 mb-2 bg-white shadow-xl`}
                placeholder="Mata Pelajaran"
                value={mapel}
                onChangeText={setMapel}
              />
              <TextInput
                style={tw`border border-gray-300 rounded p-2 bg-white shadow-xl`}
                placeholder="Contoh : 15 April 2025"
                value={deadline}
                onChangeText={setDeadline}
              />
              <View style={tw`border border-neutral-300 h-10 flex justify-center mb-3 mt-3`}>
                <TextInput
                  style={tw`w-full pt-2 mb-2`}
                  placeholder="Kategori"
                  value={category}
                  onChangeText={setCategory}
                />
              </View>

              <TouchableOpacity
                onPress={addTask}
                style={tw`bg-${editId ? 'yellow-600' : 'blue-500'} p-3 rounded-sm mb-5`}
              >
                <Text style={tw`text-white text-center font-bold`}>
                  {editId ? 'Simpan Perubahan' : 'Tambah Tugas'}
                </Text>
              </TouchableOpacity>
            </>
          )}

          <Text style={tw`text-2xl font-bold mt-6 bottom-4`}>Daftar Tugasku</Text>
          <FlatList
            scrollEnabled={false}
            data={list}
            keyExtractor={(item) => item.id || ''}
            renderItem={({ item }) => (
              <TouchableOpacity 
                onPress={() => item.id && toggleComplete(item.id)}
                activeOpacity={0.9}
              >
                <View
                  style={[
                    tw`bg-white p-4 rounded-lg shadow-lg mb-3 border border-gray-200`,
                    item.isCompleted && tw`bg-green-100 border-green-300`,
                  ]}
                >
                  <Text
                    style={[
                      tw`text-lg font-semibold`,
                      item.isCompleted && tw`line-through text-gray-500`,
                    ]}
                  >
                    {item.task}
                  </Text>
                  <Text style={tw`text-sm font-semibold text-gray-600 mb-1`}>📘 {item.mapel}</Text>
                  <Text style={tw`text-sm font-semibold text-gray-600`}>📅 {item.deadline}</Text>
                  <Text style={tw`text-sm font-semibold text-gray-600`}>📝 {item.category}</Text>
                  <View style={tw`flex-row gap-3 mt-3`}>
                    <TouchableOpacity onPress={() => startEdit(item)}>
                      <View style={tw`bg-yellow-600 px-4 py-2 rounded-md`}>
                        <Text style={tw`text-white font-bold`}>Edit</Text>
                      </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => item.id && deleteTask(item.id)}>
                      <View style={tw`bg-red-600 px-4 py-2 rounded-md`}>
                        <Text style={tw`text-white font-bold`}>Hapus</Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableOpacity>
            )}
          />
        </View>
      </ScrollView>

      <TouchableOpacity 
        onPress={() => setShowForm(!showForm)}
        style={tw`absolute z-999 right-7 bottom-10 bg-black w-12 h-12 justify-center items-center rounded-full`}
      >
        <Text style={tw`text-white font-bold text-xl`}>{showForm ? '❌' : '➕'}</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default belajar;