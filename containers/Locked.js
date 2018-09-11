import React, { Component } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';

export class Locked extends Component {
  static navigationOptions = {
    header: null,
  };
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.lockedContainer}>
          <Text style={styles.lockedHour}>12:51 pm</Text>
          <Text style={styles.lockedDate}>10 Sept 2018</Text>
        </View>
        <Button title="Auth" onPress={() => this.props.navigation.navigate('Auth')}/>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
  },
  lockedContainer: {
    backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
  },
  lockedHour: {
    fontSize: 50,
    color: 'white',
  },
  lockedDate: {
    fontSize: 20,
    color: 'white',
  }
})

export default Locked;