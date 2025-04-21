import { View, Text, TextInput, TouchableOpacity, FlatList, ScrollView, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import tw from 'twrnc';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FontAwesome, FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';

const index = () => {

  interface Task {
    id: string;
    task: string;
    mapel: string;
    deadline: string;
    isCompleted: boolean;
    category: string;
  }

  const [showForm, setShowForm] = useState(false);
  const [task, setTask] = useState('');
  const [mapel, setMapel] = useState('');
  const [deadline, setDeadline] = useState('');
  const [category, setCategory] = useState('');
  const [list, setList] = useState<Task[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState('');

  const generateId = () => Date.now().toString() + Math.random().toString(36).substr(2, 9);

  const saveTasks = async () => {
    try {
      await AsyncStorage.setItem('tasks', JSON.stringify(list));
      console.log('Berhasil Simpan Data');
    } catch (error) {
      console.log('Gagal simpan :', error);
    }
  };

  const addTask = () => {
    if (!task.trim() || !mapel.trim() || !deadline.trim() || !category.trim()) {
      Alert.alert('Data Input Gagal', 'Belum Kamu Isi Datanya');
      return;
    }

    if (task.length < 3) {
      Alert.alert('Gagal Input', 'Nama Tugasnya Kependekan Nih, Yang bener kamu');
      return;
    }

    const newTask = {
      id: editId || Date.now().toString(),
      task: task.trim(),
      mapel: mapel.trim(),
      deadline: deadline.trim(),
      isCompleted: false,
      category: category,
    };
    

    if (editId) {
      const updated = list.map((item) => (item.id === editId ? newTask : item));
      setList(updated);
    } else {
      setList([...list, newTask]);
    }

    setTask('');
    setMapel('');
    setDeadline('');
    setEditId('');
    setCategory('');
  };

  const toggleComplete = (id: string) => {
    const updatedList = list.map((item) =>
      item.id === id ? { ...item, isCompleted: !item.isCompleted } : item
    );
    setList(updatedList);
  };

  const deleteTask = (id: string) => {
    Alert.alert(
      'Konfirmasi Hapus',
      'Apakah kamu yakin ingin menghapus tugas ini?',
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Hapus',
          style: 'destructive',
          onPress: () => {
            const filtered = list.filter(item => item.id !== id);
            setList(filtered);
          },
        },
      ]
    );
  };

  const startEdit = (item: Task) => {
    setTask(item.task);
    setMapel(item.mapel);
    setDeadline(item.deadline);
    setEditId(item.id);
    setCategory(item.category);
    setShowForm(true);
  };

  const loadTasks = async () => {
    try {
      const saved = await AsyncStorage.getItem('tasks');
      if (saved !== null) {
        setList(JSON.parse(saved));
        console.log('Berhasil load data');
      }
    } catch (error) {
      console.log('Gagal load:', error);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  useEffect(() => {
    saveTasks();
  }, [list]);

  useEffect(() => {
    if (!showForm) {
      setTask('');
      setMapel('');
      setDeadline('');
      setEditId('');
    }
  }, [showForm]);

  return (
    <SafeAreaView style={tw`flex-1 bg-gray-200`}>
      <ScrollView contentContainerStyle={{ flexGrow: 1, marginBottom: 0 }}>
        <View style={tw`bg-blue-600 w-full h-50 flex justify-center`}>
          <Text style={tw`text-white font-bold text-3xl ml-5 mt-5`}>Tugasku.Id</Text>
          <Text style={tw`text-white font-normal text-sm ml-5.5`}>
            Tempat Menyimpan Seluruh Tugasmu Disini
          </Text>
        </View>

        <View style={tw`bg-white flex-1 py-2 rounded-b-md p-4 shadow-xl`}>
          {showForm && (
            <>
              <Text style={tw`text-xl font-black mb-5`}>
                {editId ? 'Edit Data' : 'Tambah Daftar'}
              </Text>
              <TextInput
                style={tw`border border-gray-300 rounded-lg p-3 mb-2 bg-gray-200 shadow-2xl`}
                placeholder="Ada Tugas Apa Hari Ini?"
                value={task}
                onChangeText={setTask}
              />
              <TextInput
                style={tw`border border-gray-300 rounded-lg p-3 mb-2 bg-gray-200 shadow-2xl`}
                placeholder="Mata Pelajaran/Kuliahnya apa tu?"
                value={mapel}
                onChangeText={setMapel}
              />
              <TextInput
                style={tw`border border-gray-300 rounded-lg p-3 bg-gray-200 shadow-2xl`}
                placeholder="Contoh : 15 April 2025"
                value={deadline}
                onChangeText={setDeadline}
              />
              <View style={tw`bg-gray-200 shadow-2xl rounded-lg border border-neutral-300 h-11.5 justify-center mb-4 mt-3`}>
                <Picker
                  selectedValue={category}
                  onValueChange={(itemValue) => setCategory(itemValue)}
                  style={tw`w-full mb-2 mt-2 text-gray-600`}
                >
                  <Picker.Item label="Pilih Kategori" value="" />
                  <Picker.Item label="PR" value="PR" />
                  <Picker.Item label="Proyek" value="Proyek" />
                  <Picker.Item label="Resume" value="Resume" />
                  <Picker.Item label="Ujian" value="Ujian" />
                  <Picker.Item label="Laprak" value="Laporan Praktikum" />
                  <Picker.Item label="Praktikum" value="Praktikum" />
                  <Picker.Item label="Praktikum + Pretest awal" value="Praktikum + Pretest " />
                </Picker>
              </View>
              <TouchableOpacity
                onPress={addTask}
                style={tw`bg-${editId ? 'yellow-600' : '[#032A4E]'} p-3 rounded-lg mb-5`}
              >
                <Text style={tw`text-white text-lg text-center font-black`}>
                  {editId ? 'Simpan Perubahan' : 'Tambah Tugas'}
                </Text>
              </TouchableOpacity>
            </>
          )}

          <Text style={tw`text-2xl font-bold`}>📋 Daftar Tugasku</Text>
          {list.length > 0 ? (
            <Text style={tw`text-lg font-bold text-green-700 mb-2 mt-1 ml-1.1`}>
              ✅ Ada Tugas Nih Kamu!
            </Text>
          ) : (
            <Text style={tw`text-lg font-bold text-gray-500 mb-2`}>
              🎉 Selamat, nggak ada tugas hari ini!
            </Text>
          )}

          <FlatList
            scrollEnabled={false}
            data={list}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => toggleComplete(item.id)} activeOpacity={0.9}>
                <View
                  style={tw`flex-row justify-between items-center gap-4 p-4 rounded-lg shadow-lg mb-3 border border-gray-200 mt-2 ${
                    item.isCompleted ? 'bg-green-100 border-green-300' : 'bg-white'
                  }`}
                >
                  {item.isCompleted ? (
                    <FontAwesome name="check-square" style={tw``} size={28} color={'green'} />
                  ) : (
                    <FontAwesome name="square-o" style={tw``} size={30} color={'gray'} />
                  )}

                  <View style={tw`flex-1 pr-3`}>
                    <Text style={tw`text-xl font-extrabold`}>{item.task}</Text>
                    <Text style={tw`text-sm font-base text-gray-600 mt-0.5`}>{item.mapel}</Text>
                    <Text style={tw`text-sm font-base text-gray-600`}>
                      Kategori : {item.category}
                    </Text>
                    <Text style={tw`text-lg font-extrabold text-[#8B1A10]`}>{item.deadline}</Text>
                  </View>

                  <View style={tw`flex-row items-center gap-1 right-1`}>
                    <TouchableOpacity onPress={() => startEdit(item)}>
                      <View style={tw`bg-[#032A4E] w-10 h-10 items-center justify-center rounded-md`}>
                        <MaterialIcons name="mode-edit" style={tw`text-white`} size={26} />
                      </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => deleteTask(item.id)}>
                      <View style={tw`bg-[#8B1A10] w-10 h-10 items-center justify-center rounded-md`}>
                        <FontAwesome5 name="trash-alt" style={tw`text-white`} size={26} />
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableOpacity>
            )}
            ListEmptyComponent={<View style={tw`mb-6`} />}
          />
        </View>
      </ScrollView>

      <TouchableOpacity
        onPress={() => setShowForm(!showForm)}
        style={tw`absolute z-999 right-7 bottom-10 bg-black w-12 h-12 justify-center items-center rounded-full`}
      >
        <Text style={tw`text-white font-bold text-xl`}>{showForm ? 'x' : '+'}</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default index;
