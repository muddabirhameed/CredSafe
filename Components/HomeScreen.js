import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const HomeScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Hello World from HomeScreen!</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF', // You can change to Colors.background if using your theme
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000', // Or use theme color
  },
});

export default HomeScreen;
