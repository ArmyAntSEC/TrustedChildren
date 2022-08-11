import React from 'react';
import {Text, View, StyleSheet, ScrollView} from 'react-native';

const styles = StyleSheet.create({
  mainView: {
    top: 35,
    paddingVertical: 50,
    height: '100%',
    backgroundColor: '#CCCCCC',
  },
  center: {
    alignItems: 'center',
    fontSize: '300',
    height: 40,
    backgroundColor: '#AAAAAA',
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#005218',
    paddingHorizontal: 32,
    gap: 10,
    width: 182,
    height: 56,
    borderRadius: 48,
    top: 50,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FFFFFF',
    backgroundColor: '#AAAAAA',
  },
});

const Button = props => {
  return (
    <ScrollView>
      <View style={styles.button}>
        <Text style={styles.buttonText}>{props.text}</Text>
      </View>
    </ScrollView>
  );
};

const Greeting = props => {
  return (
    <View style={styles.center}>
      <Text>Hello {props.name}!</Text>
    </View>
  );
};

const CtaButton = props => {
  return <Button text={props.text} />;
};

const App = () => {
  const name = 'Daniel';
  return (
    <View style={[styles.center, styles.mainView]}>
      <Greeting name={name} />
      <Greeting name="Jaina" />
      <Greeting name="Valeera" />
      <CtaButton text="OK" />
    </View>
  );
};

export default App;
