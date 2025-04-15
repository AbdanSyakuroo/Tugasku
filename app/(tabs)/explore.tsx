import { View, Text, TextInput, TouchableOpacity, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import tw from 'twrnc';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FontAwesome, FontAwesome5 } from '@expo/vector-icons';

const index = () => {
  const [task, setTask] = useState('');
  const [list, setList] = useState([]);
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
    if (task.trim() === '') return;
  
    const newTask = {
      id: Date.now().toString(), // <- perbaikan di sini
      title: task.trim(),
      completed: false,
    };
  
    setList([...list, newTask]);
    setTask('');
  };
  

  const toggleTask = (id) => {
    const updatedList = list.map(item => 
      item.id === id ? { ...item, completed: !item.completed } : item
    );
    setList(updatedList);
  };

  const deleteTask =  (id:string) => {
   const filtered = list.filter(item => item.id !== id);
   setList(filtered);
  }
  
  const handleEdit = () => {
    const updated = list.map(item => item.id === editId ? {...item, title: task.trim()}
  :item);

  setList(updated);
  setTask('');
  setIsEditing(false);
  setEditId(null);
};

const startEdit = (item:any) => {
  setTask(item.title); //akan mengedit data yang dinamain variabel title contoh "Minum Obat"
  setIsEditing(true); //kalo fungsi ini jalan maka akan mengubah status false jadi true alias dijalankan
  setEditId(item.id); // edit berdasarkan id alias urutan list 1,2 atau 3
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

  return (
    <SafeAreaView style={tw`h-full`}>
      <View style={tw`bg-yellow-200 rounded-b-[20] w-full h-40`}></View>
      <TouchableOpacity style={tw`absolute z-999 right-7 bottom-7 bg-yellow-400 w-12 h-12 justify-center  items-center rounded-full`}>
        <Text style={tw`text-white font-bold text-2xl`}>+</Text>
      </TouchableOpacity>
      <View style={tw`px-3 mt-5`}>
      <View style={tw`flex-row gap-3 px-4`}>
        <FontAwesome name="tasks" size={50} style={tw`mt-1.5`} />
        <View>
            <Text style={tw`text-base font-semibold`}>It Tasks</Text>
        <Text style={tw`text-4xl font-bold `}>Personal "Aura"</Text>
        </View>
      </View>
      <View style={tw`flex-row justify-between gap-2 mt-3 mb-3 mx-1`}>
        <TextInput 
        placeholder='Tambahkan tugas..' 
        style={tw`border border-gray-300 rounded-md w-3/4 pl-3`}
        value={task}
        onChangeText={setTask}
        ></TextInput>
        <TouchableOpacity onPress={isEditing ? handleEdit : addTask} style={tw`bg-yellow-500 p-3 rounded-lg w-1/4`}>
          <Text style={tw`text-white font-semibold text-center`}>{isEditing ? 'Edit' : 'Add' }</Text>
        </TouchableOpacity>
      </View>

      <FlatList
  style={tw`mx-1`}
  data={list}
  keyExtractor={item => item.id}
  renderItem={({ item }) => (
    <TouchableOpacity
      onPress={() => toggleTask(item.id)}
      style={tw`flex-row justify-between gap-2 bg-white p-3 my-1 rounded-sm`}
    >
      <Text style={tw`text-base`}>
        {item.completed ? '✅' : '⬜️'}
      </Text>
      <Text
        style={[
          tw`text-sm font-semibold`,
          item.completed && { textDecorationLine: 'line-through', color: 'gray' },
        ]}
      >
        {item.title}
      </Text>

      <View style={tw`flex-row items-center gap-2`}>
        <TouchableOpacity onPress={ () => startEdit(item)}>
          <Text style={tw`text-blue-500 mr-2`}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={ () => deleteTask(item.id)}>
          <Text style={tw`text-red-500`}>Delete</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity> //nah error ilang sendiri wkkwwkwk
  )}
/>



</View>
    </SafeAreaView>
  )
}

export default index