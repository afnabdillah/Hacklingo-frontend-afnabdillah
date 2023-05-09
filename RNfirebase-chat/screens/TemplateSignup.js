import React, { useState } from 'react'
import { EvilIcons,AntDesign } from '@expo/vector-icons';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Image, Alert, SafeAreaView, Modal } from 'react-native'
import SelectDropdown from 'react-native-select-dropdown';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

export default SignUpView = () => {

  const countries = [
    'Egypt',
    'Canada',
    'Australia',
    'Ireland',
    'Brazil',
    'England',
    'Dubai',
    'France',
    'Germany',
    'Saudi Arabia',
    'Argentina',
    'India',
  ];

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
      <SelectDropdown
            data={countries}
            // defaultValueByIndex={1}
            // defaultValue={'Egypt'}
            onSelect={(selectedItem, index) => {
              console.log(selectedItem, index);
            }}
            defaultButtonText={'Select native Language'}
            buttonTextAfterSelection={(selectedItem, index) => {
              return selectedItem;
            }}
            rowTextForSelection={(item, index) => {
              return item;
            }}
            buttonStyle={styles.dropdown1BtnStyle}
            buttonTextStyle={styles.dropdown1BtnTxtStyle}
            renderDropdownIcon={isOpened => {
              return <FontAwesome name={isOpened ? 'chevron-up' : 'chevron-down'} color={'white'} size={18} />;
            }}
            dropdownIconPosition={'right'}
            dropdownStyle={styles.dropdown1DropdownStyle}
            rowStyle={styles.dropdown1RowStyle}
            rowTextStyle={styles.dropdown1RowTxtStyle}
          />
      </View>
      
      <View>
      {columns.map((column, index) => (
        <View key={index} style={styles.inputContainer}>
          <SelectDropdown
            data={countries}
            // defaultValueByIndex={1}
            // defaultValue={'Egypt'}
            onSelect={(selectedItem, index) => {
              console.log(selectedItem, index);
            }}
            defaultButtonText={'Select Target Language'}
            buttonTextAfterSelection={(selectedItem, index) => {
              return selectedItem;
            }}
            rowTextForSelection={(item, index) => {
              return item;
            }}
            buttonStyle={styles.dropdown1BtnStyle}
            buttonTextStyle={styles.dropdown1BtnTxtStyle}
            renderDropdownIcon={isOpened => {
              return <FontAwesome name={isOpened ? 'chevron-up' : 'chevron-down'} color={'#f8f8ff'} size={18} />;
            }}
            dropdownIconPosition={'right'}
            dropdownStyle={styles.dropdown1DropdownStyle}
            rowStyle={styles.dropdown1RowStyle}
            rowTextStyle={styles.dropdown1RowTxtStyle}
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
  addButton: {
    paddingVertical: 5,
    paddingHorizontal: 8,
    alignSelf: 'center',
  },
  dropdown1BtnStyle: {
    width: '80%',
    height: 45,
    backgroundColor: 'white',
    borderRadius: 30,
    // borderWidth: 1,
    borderColor: '#444',
  },
  dropdown1BtnTxtStyle: {color: '#444', right: 30, fontSize: 13},
  dropdown1RowStyle: { backgroundColor: '#EFEFEF', borderBottomColor: '#C5C5C5'},
  dropdown1DropdownStyle: { backgroundColor: '#EFEFEF', borderRadius:30 ,width:250},
  dropdown1RowTxtStyle: {color: '#444', alignSelf: 'center'},
})
