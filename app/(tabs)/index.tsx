import { View, Text, TextInput, TouchableOpacity, FlatList, ScrollView, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import tw from 'twrnc';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FontAwesome, FontAwesome5 } from '@expo/vector-icons';
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
  // const [showPicker, setShowPicker] = useState(false)
  const [list, setList] = useState<Task[]>([]);  // <-- Menentukan tipe list sebagai array of Task
  
  const [isEditing, setIsEditing] = 
  useState(false);
  const [editId, setEditId] = useState(null);

  const saveTasks = async () => {
    try{
      await AsyncStorage.setItem('tasks', JSON.stringify(list));
      console.log('Berhasil Simpan Data');
    } catch (error) {
      console.log('Gagal simpan :', error);
    }
  };

 

  const addTask = () => {
    if (!task.trim() || !mapel.trim() || !deadline.trim()) return;

    const newTask = {
      id: editId ?? Date.now().toString(),
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
    setEditId(null);
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
        {
          text: 'Batal',
          style: 'cancel',
        },
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
  

// Fungsi untuk memulai edit berdasarkan item yang dipilih
const startEdit = (item: Task) => {
  setTask(item.task);  // Mengisi task dengan nilai dari task yang dipilih
  setMapel(item.mapel); // Mengisi mapel dengan nilai dari mapel yang dipilih
  setDeadline(item.deadline);
  setEditId(item.id); 
  setCategory(item.category) // Set editId untuk menandai item yang sedang diedit
  setShowForm(true); 
};

  const loadTasks = async () => {
    try{
      const saved = await AsyncStorage.getItem('tasks');
      if (saved !== null ) {
        setList(JSON.parse(saved));
        console.log('Berhasil load data');
      }
    } catch (error) {
      console.log('Gagal load:', error);
    }
  }

  // const clearAppData = async () => {
  //   try {
  //     const keys = await AsyncStorage.getAllKeys();
  //     await AsyncStorage.multiRemove(keys);
  //     console.log('Semua data berhasil dihapus');
  //   } catch (error) {
  //     console.error('Gagal menghapus data aplikasi:', error);
  //   }
  // };
  

  useEffect(() => {
    loadTasks();
  }, []);

 useEffect(() => {
    saveTasks();
  }, [list]);

  useEffect(() => {
    if (!showForm) {
      // Reset form saat ditutup
      setTask('');
      setMapel('');
      setDeadline('');
      setEditId(null);
    }
  }, [showForm]);
  return (
    <SafeAreaView style={tw`flex-1 bg-gray-200 h-full`}>
      <ScrollView>
      <View style={tw`bg-blue-600 w-full h-50 flex justify-center` }>
        <Text style={tw`text-white font-bold text-3xl ml-5 mt-5`}>Tugasku.Id</Text>
        <Text style={tw`text-white font-normal text-sm ml-5.5`}>Tempat Menyimpan Seluruh Tugasmu Disini</Text>
      </View>
      <View>
        
      </View>
      <View style={tw``}>
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
        style={tw`border border-gray-300 rounded p-2  bg-white shadow-xl`}
        placeholder="Contoh : 15 April 2025"
        value={deadline}
        onChangeText={setDeadline}
      />
    <View style={tw`border border-neutral-300 h-10 flex justify-center mb-3 mt-3`}>
      <Picker
  selectedValue={category}
  onValueChange={(itemValue) => setCategory(itemValue)}
  style={[
    tw`w-full pt-2 mb-2`,
      // Menambahkan border manual
  ]}
>
  <Picker.Item label="Pilih Kategori" value="" />
  <Picker.Item label="PR" value="PR" />
  <Picker.Item label="Proyek" value="Proyek" />
  <Picker.Item label="Ujian" value="Ujian" />
</Picker>
</View>
      
      <TouchableOpacity
        onPress={() => {
          addTask();
        }}
        style={tw`bg-${editId ? 'yellow-600' : 'blue-500'} p-3 rounded-sm mb-5`}
      >
        <Text style={tw` text-white text-center font-bold`}>
          {editId ? 'Simpan Perubahan' : 'Tambah Tugas'}
        </Text>
      </TouchableOpacity>
    </>
  )}
    <Text style={tw`text-2xl font-bold mt-6  bottom-4`}>Daftar Tugasku</Text>
    <FlatList
    scrollEnabled = {false}
  data={list}
  keyExtractor={(item) => item.id}
  renderItem={({ item }) => (
    <TouchableOpacity onPress={() => toggleComplete(item.id)}
    activeOpacity={0.9} >
      <View
        style={[
          tw`bg-white p-4 rounded-lg shadow-lg mb-3 border border-gray-200`,
          item.isCompleted && tw`bg-green-100 border-green-300`,  // Ganti latar belakang dan border saat selesai
        ]}
      >
        <Text
          style={[
            tw`text-lg font-semibold`,
            item.isCompleted && tw`line-through text-gray-500`,  // Garis tengah dan warna lebih gelap saat selesai
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
          <TouchableOpacity onPress={() => deleteTask(item.id)}>
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
      </View>
      
      </ScrollView>
      <TouchableOpacity 
  onPress={() => setShowForm(!showForm)}
  style={tw`absolute z-999 right-7 bottom-10 bg-black w-12 h-12 justify-center  items-center rounded-full`}>
        <Text style={tw`text-white font-bold text-xl`}>{showForm ? 'x' : '+'}</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

export default index