import React, { useState } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

type MenuItem = {
  id: string;
  name: string;
  description: string;
  course: string;
  price: number;
};

const Stack = createNativeStackNavigator();

export default function App() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);

  // Add a new menu item
  const addMenuItem = (newItem: MenuItem) => {
    setMenuItems([...menuItems, newItem]);
  };

  // Remove a menu item
  const removeMenuItem = (id: string) => {
    setMenuItems(menuItems.filter(item => item.id !== id));
  };

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerStyle: { backgroundColor: '#121212' }, headerTintColor: '#D4AF37' }}>
        <Stack.Screen name="Home">
          {(props) => <HomeScreen {...props} menuItems={menuItems} />}
        </Stack.Screen>
        <Stack.Screen name="Add Item">
          {(props) => <AddItemScreen {...props} addMenuItem={addMenuItem} removeMenuItem={removeMenuItem} menuItems={menuItems} />}
        </Stack.Screen>
        <Stack.Screen name="Filter">
          {(props) => <FilterScreen {...props} menuItems={menuItems} />}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

          // Home Screen
function HomeScreen({ navigation, menuItems }: any) {
  // Calculate average price by course
  const courses = ['Starters', 'Mains', 'Desserts'];
  const averages = courses.map(course => {
    const filtered = menuItems.filter((item: MenuItem) => item.course === course);
    const avg = filtered.length > 0
      ? (filtered.reduce((sum, item) => sum + item.price, 0) / filtered.length).toFixed(2)
      : '0.00';
    return { course, avg };
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Christoffel’s Cooking Menu</Text>

      <Text style={styles.subtitle}>Total Menu Items: {menuItems.length}</Text>

      <Text style={styles.sectionTitle}>Average Price by Course</Text>
      <View style={styles.table}>
        <View style={styles.tableHeader}>
          <Text style={styles.tableHeaderText}>Course</Text>
          <Text style={styles.tableHeaderText}>Average Price (R)</Text>
        </View>
        {averages.map(({ course, avg }) => (
          <View key={course} style={styles.tableRow}>
            <Text style={styles.tableText}>{course}</Text>
            <Text style={styles.tableText}>{avg}</Text>
          </View>
        ))}
      </View>

      <Text style={styles.sectionTitle}>Full Menu</Text>
      <FlatList
        data={menuItems}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.menuItem}>
            <Text style={styles.menuItemText}>{item.name} ({item.course}) - R{item.price}</Text>
            <Text style={styles.menuItemDesc}>{item.description}</Text>
          </View>
        )}
      />

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Add Item')}>
          <Text style={styles.buttonText}>Add Menu Item</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Filter')}>
          <Text style={styles.buttonText}>Filter Menu</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

        // Add Item Screen 
function AddItemScreen({ navigation, addMenuItem, removeMenuItem, menuItems }: any) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [course, setCourse] = useState('Starters');
  const [price, setPrice] = useState('');

  const handleAddItem = () => {
    if (!name || !description || !price) {
     
     
    }

    const newItem: MenuItem = {
      id: Math.random().toString(),
      name,
      description,
      course,
      price: parseFloat(price),
    };

    addMenuItem(newItem);
    setName('');
    setDescription('');
    setCourse('Starters');
    setPrice('');
   
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add a New Dish</Text>

      <TextInput
        style={styles.input}
        placeholder="Dish Name"
        placeholderTextColor="#555"
        value={name}
        onChangeText={setName}
      />

      <TextInput
        style={styles.input}
        placeholder="Description"
        placeholderTextColor="#555"
        value={description}
        onChangeText={setDescription}
      />

      <Picker selectedValue={course} onValueChange={(value) => setCourse(value)} style={styles.picker}>
        <Picker.Item label="Starters" value="Starters" />
        <Picker.Item label="Mains" value="Mains" />
        <Picker.Item label="Desserts" value="Desserts" />
      </Picker>

      <TextInput
        style={styles.input}
        placeholder="Price (R)"
        placeholderTextColor="#555"
        keyboardType="numeric"
        value={price}
        onChangeText={setPrice}
      />

      <TouchableOpacity style={styles.button} onPress={handleAddItem}>
        <Text style={styles.buttonText}>Add Dish</Text>
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>Current Menu</Text>
      <FlatList
        data={menuItems}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.menuItem}>
            <Text style={styles.menuItemText}>{item.name} ({item.course}) - R{item.price}</Text>
            <TouchableOpacity onPress={() => removeMenuItem(item.id)}>
              <Text style={styles.removeText}>Remove</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

    // Filter Screen
function FilterScreen({ menuItems }: any) {
  const [selectedCourse, setSelectedCourse] = useState('Starters');

  const filteredItems = menuItems.filter((item: MenuItem) => item.course === selectedCourse);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Filter Menu by Course</Text>

      <Picker selectedValue={selectedCourse} onValueChange={(value) => setSelectedCourse(value)} style={styles.picker}>
        <Picker.Item label="Starters" value="Starters" />
        <Picker.Item label="Mains" value="Mains" />
        <Picker.Item label="Desserts" value="Desserts" />
      </Picker>

      <FlatList
        data={filteredItems}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.menuItem}>
            <Text style={styles.menuItemText}>{item.name} - R{item.price}</Text>
            <Text style={styles.menuItemDesc}>{item.description}</Text>
          </View>
        )}
      />
    </View>
  );
}

        // Styles
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212', padding: 20 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#D4AF37', marginBottom: 10, textAlign: 'center' },
  subtitle: { color: '#fff', textAlign: 'center', marginBottom: 20 },
  sectionTitle: { color: '#D4AF37', fontSize: 18, marginVertical: 10 },
  input: { backgroundColor: '#fff', color: '#000', padding: 10, marginBottom: 10, borderRadius: 5 },
  picker: { backgroundColor: '#fff', marginBottom: 10 },
  buttonContainer: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 },
  button: { backgroundColor: '#D4AF37', padding: 10, borderRadius: 5, flex: 1, marginHorizontal: 5 },
  buttonText: { color: '#fff', textAlign: 'center', fontWeight: 'bold' },
  menuItem: { backgroundColor: '#1E1E1E', padding: 10, borderRadius: 5, marginBottom: 10 },
  menuItemText: { color: '#fff', fontWeight: 'bold' },
  menuItemDesc: { color: '#ccc' },
  removeText: { color: 'red', marginTop: 5 },
  table: { borderWidth: 1, borderColor: '#D4AF37', marginBottom: 15 },
  tableHeader: { flexDirection: 'row', backgroundColor: '#D4AF37' },
  tableHeaderText: { flex: 1, color: '#121212', fontWeight: 'bold', padding: 8, textAlign: 'center' },
  tableRow: { flexDirection: 'row', borderTopWidth: 1, borderColor: '#D4AF37' },
  tableText: { flex: 1, color: '#fff', padding: 8, textAlign: 'center' },
});


