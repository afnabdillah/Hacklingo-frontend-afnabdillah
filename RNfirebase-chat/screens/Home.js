import {
  StyleSheet,
  SafeAreaView,
  Platform,
  StatusBar,
  View,
  Text,
  Dimensions,
} from 'react-native';
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import CustomImageCarousalLandscape from './Landingpage/CustomImageCarousalLandscape';
import Carousel from './Landingpage/Carousel'
import HeaderDefault from '../components/forum/HeaderDefault';
import { fetchArticles } from '../stores/articlesSlices';
import showToast from '../helper/showToast';
import { useNavigation } from '@react-navigation/native';
const lebar = Dimensions.get("window").width


const App = () => {
  const dispatch = useDispatch()
  const articles = useSelector((state) => state.articlesReducer.articles);
  const navigation = useNavigation()
  
  useEffect(() => {
    dispatch(fetchArticles())
      .unwrap()
      .catch((err) => showToast("error", "fetch data error", err.message));
  }, []);

  const data = articles.map((article) => ({
    title: article.title,
    url: article.articleImageUrl, // Replace with the actual image URL from your data if available
    description: "", // Add a description if available in your data
    id: article._id,
  }));

  const data2 = [
    {
      language: "English",
      image: require('../assets/flag_inggris.jpeg'),
    },
    {
      language: "Indonesian",
      image: require('../assets/Flag_Indonesia.png'),
    },
    {
      language: "Deutch",
      image: require('../assets/Flag_Dutch.png'),
    },
    {
      language: "Germany",
      image: require('../assets/Flag_Germany.jpg'),
    },
    {
      language: "Spanish",
      image: require('../assets/Flag_Spanish.png'),
    },
    {
      language: "Japanese",
      image: require('../assets/Flag_Japanese.jpeg'),
    },
    {
      language: "French",
      image: require('../assets/Flag_French.png'),
    },
  ];
  const handleArticlePress = (article) => {
    navigation.navigate('Article', { articleId : article.id }); // Navigate to DetailScreen with article data
  };
  const navigateToGroups = (language) => {
    navigation.navigate("Chats", { screen: "Find Groups", params : { language } });
  };
  return (
    <>
      <HeaderDefault />
      <SafeAreaView style={styles.container}>
        <View style={styles.carouselContainer}>
          <Carousel
            data={data}
            autoPlay={true}
            pagination={true}
            onPress={handleArticlePress}
          />
        </View>
        <View style={styles.carouselContainer}>
          <Text style={styles.text}>FIND GROUP</Text>
          <CustomImageCarousalLandscape
            data={data2}
            autoPlay={false}
            pagination={true}
            navigateToGroups={navigateToGroups}
          />
        </View>
      </SafeAreaView>
    </>
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
    width: lebar * 1
  },
  carouselContainer: {
    marginBottom: 40,
  },
  carouselFlag: {
    marginBottom: 40,
    width: lebar * 2
  }
});