import React, { Component } from 'react';
import { View, StyleSheet, Button } from 'react-native';

export class Verification extends Component {
  render() {
    return (
      <View>
      <Button onPress={() => this.props.navigator.navigate('Flow')}>
        Flow
      </Button>
      </View>
    )
  }
}

export default Verification;