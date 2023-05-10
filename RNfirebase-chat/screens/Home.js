import {
  StyleSheet,
  SafeAreaView,
  Platform,
  StatusBar,
  View,
  Text,
} from 'react-native';
import React from 'react';
import CustomImageCarousalLandscape from './Landingpage/CustomImageCarousalLandscape';
import Carousel from './Landingpage/Carousel'
import HeaderPost from '../components/forum/HeaderPost';
import HeaderDefault from '../components/forum/HeaderDefault';
import { HeaderChat } from './HeadersChat/HeaderChat';

const App = () => {
  const data = [
    {
      title: 'Anise Aroma Art Bazar', url: 'https://i.ibb.co/hYjK44F/anise-aroma-art-bazaar-277253.jpg',
      description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
      id: 1

    },
    {
      title: 'Food inside a Bowl', url: 'https://i.ibb.co/JtS24qP/food-inside-bowl-1854037.jpg',
      description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
      id: 2
    },
    {
      title: 'Vegatable Salad', url: 'https://i.ibb.co/JxykVBt/flat-lay-photography-of-vegetable-salad-on-plate-1640777.jpg',
      description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
      id: 3
    }
  ];
  const data2 = [
    {
      image: require('../assets/flag_inggris.jpeg'),
    },
    {
      image: require('../assets/Flag_Indonesia.png'),
    }
  ];
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.carouselContainer}>
        <Carousel
          data={data}
          autoPlay={true}
          pagination={true}
          sliderHeight={180} // Add this line to set a custom height for the top carousel
        />
      </View>
      <View style={styles.carouselContainer}>
        <Text style={styles.text}>SELECT LANGUAGE</Text>
        <CustomImageCarousalLandscape
          data={data2}
          autoPlay={false}
          pagination={true}
        />
      </View>
    </SafeAreaView>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    backgroundColor: 'white',
  },
  text: {
    textAlign: 'center',
    color: 'black',
    marginBottom: 10,
    fontSize: 22,
    fontWeight: "bold",
  },
  carouselContainer: {
    marginBottom: 40,
  },
});