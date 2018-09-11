import React, { Component } from 'react';
import { View, StatusBar } from 'react-native';

export class Status extends Component {
  render() {
    return (
      <View>
       <StatusBar barStyle='light-content'/>
      </View>
    )
  }
}

export default Status;