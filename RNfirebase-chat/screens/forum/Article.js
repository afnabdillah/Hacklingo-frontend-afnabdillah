import React from 'react';
import { ScrollView, Text, StyleSheet, Image } from 'react-native';
import { useRoute } from '@react-navigation/native'
const Article = () => {
  const route = useRoute();
  const { article } = route.params;
  console.log(article, "<<< article")
  return (
    <ScrollView>
      <Text style={styles.title}>Highly Motivated and Detail-Oriented Software Developer</Text>
      <Text style={styles.subtitle}>Published on May 10, 2023</Text>
      <Text style={styles.author}>By Admin</Text>
      <Image
        style={{ height: 200, width: '100%' }}
        source={{ uri: "https://contenthub-static.grammarly.com/blog/wp-content/uploads/2022/08/BMD-3398.png" }}
      />
      <Text style={[styles.content, { marginTop: 10 }]}>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis vestibulum risus non ullamcorper auctor.
        Nulla facilisi. Nam et massa massa. Aenean lacinia dolor non lectus auctor, vitae bibendum ex dapibus.
        Curabitur euismod malesuada lacus, id sollicitudin lorem commodo in. Nulla facilisi. Proin in dolor id
        sapien iaculis elementum.
      </Text>
      <Text style={styles.content}>
        Fusce non semper tortor. Cras eget massa ex. Duis accumsan fringilla tortor, non vestibulum erat dapibus
        a. Donec nec lacinia mauris. Aliquam malesuada interdum odio, in lobortis urna mattis a. Morbi efficitur
        ultricies magna, at tincidunt lectus fringilla sed. Quisque pulvinar purus ut justo elementum dapibus.
      </Text>
      <Text style={styles.content}>
        Fusce non semper tortor. Cras eget massa ex. Duis accumsan fringilla tortor, non vestibulum erat dapibus
        a. Donec nec lacinia mauris. Aliquam malesuada interdum odio, in lobortis urna mattis a. Morbi efficitur
        ultricies magna, at tincidunt lectus fringilla sed. Quisque pulvinar purus ut justo elementum dapibus.
      </Text>
      <Text style={styles.content}>
        Fusce non semper tortor. Cras eget massa ex. Duis accumsan fringilla tortor, non vestibulum erat dapibus
        a. Donec nec lacinia mauris. Aliquam malesuada interdum odio, in lobortis urna mattis a. Morbi efficitur
        ultricies magna, at tincidunt lectus fringilla sed. Quisque pulvinar purus ut justo elementum dapibus.
      </Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    padding: 20,
    // backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#888',
    marginBottom: 10,
  },
  author: {
    fontSize: 14,
    color: '#888',
    marginBottom: 20,
  },
  content: {
    fontStyle: 'italic',
    fontSize: 16,
    lineHeight: 20,
    marginBottom: 10,
    padding: 5
  },
});

export default Article;
