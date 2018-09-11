import React, { Component } from 'react';
import { View, StyleSheet, Button } from 'react-native';

export class Flow extends Component {
  render() {
    return (
      <View>
        <Button
          title="Auth"
          onPress={() => this.props.navigation.navigate("Auth")}
        />
      </View>
    )
  }
}

export default Flow;