import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Dimensions, FlatList, Animated } from 'react-native';
import CarouselItem from './CarouselItem';

const { width } = Dimensions.get('window');

const infiniteScroll = (dataList, flatListRef) => {

  const numberOfData = dataList.length;
  
  let scrollValue = 0;
  
  let scrolled = 0;

  setInterval(() => {
    scrolled++;
    if (scrolled < numberOfData) scrollValue = scrollValue + width;
    else {
      scrollValue = 0;
      scrolled = 0;
    }

    if (flatListRef.current) {
      flatListRef.current.scrollToOffset({ animated: true, offset: scrollValue });
    }
  }, 3000);
}

const Carousel = ({ data, onPress }) => {

  const scrollX = new Animated.Value(0);
  
  let position = Animated.divide(scrollX, width);
  
  const [dataList, setDataList] = useState(data);
  
  const flatListRef = useRef(null);

  useEffect(() => {
    setDataList(data);
    infiniteScroll(dataList, flatListRef);
  }, [data]);

  if (data && data.length) {
    return (
      <View>
        <FlatList
          data={data}
          ref={flatListRef}
          keyExtractor={(item, index) => 'key' + index}
          horizontal
          pagingEnabled
          scrollEnabled
          snapToAlignment="center"
          scrollEventThrottle={16}
          decelerationRate={"fast"}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => {
            return <CarouselItem item={item} onPress={() => onPress(item)} />
          }}
          onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], { useNativeDriver: false })}
        />

        <View style={styles.dotView}>
          {data.map((_, i) => {
            let opacity = position.interpolate({
              inputRange: [i - 1, i, i + 1],
              outputRange: [0.3, 1, 0.3],
              extrapolate: 'clamp',
            });
            return (
              <Animated.View
                key={i}
                style={{ opacity, height: 10, width: 10, backgroundColor: '#ff8c00', margin: 8, borderRadius: 5 }}
              />
            );
          })}
        </View>
      </View>
    );
  }
  return null;
};

const styles = StyleSheet.create({
  dotView: { flexDirection: 'row', justifyContent: 'center', },
});

export default Carousel;
