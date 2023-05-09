import React, { useState } from 'react'
import { EvilIcons,AntDesign } from '@expo/vector-icons';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Image, Alert, SafeAreaView, Modal } from 'react-native'
import { ModalPicker } from "./ModalPickerSignup/ModalPicker";

export default SignUpView = () => {

  const [fullName, setFullName] = useState()
  const [email, setEmail] = useState()
  const [password, setPassword] = useState()

  showAlert = viewId => {
    Alert.alert('Alert', 'Button pressed ' + viewId)
  }
  const [language, setLanguage] = useState("");
  const [ chooseData, setchooseData] = useState('Select Native Language')
  const [isModalVisible, setisModalVisible] = useState(false)
    
  const changeModalVisibility = (bool) => {
      setisModalVisible(bool)
  }

  const setData = (option) => {
      setchooseData(option)
  }

  const [columns, setColumns] = useState(['']);

  const addColumn = () => {
    setColumns([...columns, '']);
  };

  const removeColumn = (index) => {
    const updatedColumns = [...columns];
    updatedColumns.splice(index, 1);
    setColumns(updatedColumns);
  };

  const handleColumnChange = (value, index) => {
    const updatedColumns = [...columns];
    updatedColumns[index] = value;
    setColumns(updatedColumns);
  };
  

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <Image
          style={styles.inputIcon}
          source={{ uri: 'https://img.icons8.com/ios-glyphs/512/user-male-circle.png' }}
        />
        <TextInput
          style={styles.inputs}
          placeholder="Full name"
          keyboardType="email-address"
          underlineColorAndroid="transparent"
          onChangeText={fullName => setFullName({ fullName })}
        />
      </View>

      <View style={styles.inputContainer}>
        <Image
          style={styles.inputIcon}
          source={{ uri: 'https://img.icons8.com/ios-filled/512/circled-envelope.png' }}
        />
        <TextInput
          style={styles.inputs}
          placeholder="Email"
          keyboardType="email-address"
          underlineColorAndroid="transparent"
          onChangeText={email => setEmail({ email })}
        />
      </View>
      <View style={styles.inputContainer}>
        <Image
          style={styles.inputIcon}
          source={{ uri: 'https://img.icons8.com/ios-glyphs/512/key.png' }}
        />
        <TextInput
          style={styles.inputs}
          placeholder="Password"
          secureTextEntry={true}
          underlineColorAndroid="transparent"
          onChangeText={password => setPassword({ password })}
        />
      </View>
      <View style={styles.inputContainer}>
      <Image
          style={styles.inputIcon}
          source={{ uri: 'https://img.icons8.com/ios-glyphs/512/flag.png' }}
        />
            <TouchableOpacity onPress={()=>changeModalVisibility(true)} style={styles.TouchableOpacity}>
                <Text style={styles.text}>{chooseData}</Text>
            </TouchableOpacity>
            <Modal
                transparent={true}
                animationType="fade"
                visible={isModalVisible}
                nRequestClose={()=> changeModalVisibility(false)}
            >
                <ModalPicker
                    changeModalVisibility={changeModalVisibility}
                    setData={setData}
                />
            </Modal>
      </View>
      
      <View>
      {columns.map((column, index) => (
        <View key={index} style={styles.inputContainer}>
          <Image
          style={styles.inputIcon}
          source={{ uri: 'https://img.icons8.com/ios-glyphs/512/language.png' }}
        />
          <TextInput
            value={column}
            placeholder='Target language'
            onChangeText={(value) => handleColumnChange(value, index)}
            style={styles.input}
          />
          {columns.length > 1 && (
            <TouchableOpacity onPress={() => removeColumn(index)}>
              <AntDesign name="delete" size={18} color="black" />
            </TouchableOpacity>
          )}
      <TouchableOpacity onPress={addColumn} style={styles.addButton}>
        <EvilIcons name="plus" size={24} color="black" />
      </TouchableOpacity>
        </View>
      ))}
      </View>
      <TouchableOpacity
        style={[styles.buttonContainer, styles.signupButton]}
        onPress={() => showAlert('sign_up')}>
        <Text style={styles.signUpText}>Sign up</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#B0E0E6',
  },
  inputContainer: {
    borderBottomColor: '#F5FCFF',
    backgroundColor: '#FFFFFF',
    borderRadius: 30,
    borderBottomWidth: 1,
    width: 250,
    height: 45,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    
  },
  inputs: {
    height: 45,
    marginLeft: 16,
    borderBottomColor: '#FFFFFF',
    flex: 1,
  },
  inputIcon: {
    width: 30,
    height: 30,
    marginLeft: 15,
    justifyContent: 'center',
  },
  buttonContainer: {
    height: 45,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    width: 250,
    borderRadius: 30,
  },
  signupButton: {
    backgroundColor: '#3498db',
  },
  signUpText: {
    color: 'white',
  },
  TouchableOpacity: {
    backgroundColor: 'white',
    alignSelf: 'stretch',
    paddingHorizontal: 20,
    marginHorizontal: 20,
  },
  text: {
    marginTop: 15,
    marginLeft: -25,
  },
  input: {
    flex: 1,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  removeText: {
    marginLeft: 15,
    color: 'red',
  },
  addButton: {
    paddingVertical: 5,
    paddingHorizontal: 8,
    alignSelf: 'center',
  },
  addText: {
    color: 'white',
  },
  
})
