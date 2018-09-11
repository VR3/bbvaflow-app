import React, { Component } from 'react';
import { View, StyleSheet, Text, Button } from 'react-native';
import { Colors } from '../utils';

export class Confirmation extends Component {
  static navigationOptions = {
    title: 'Confirmación'
  };
  render() {
    const { amount, concept, createdAt, tokenUsed } = this.props.navigation.state.params; 
    return (
      <View style={styles.container}>
        <Text style={{fontSize: 20, color: Colors.darkBlue}}> Gracias por usar los cajeros de BBVA Bancomer !</Text>
        <Text> Cantidad: {amount} </Text>
        <Text> Concepto: {concept} </Text>
        <Text> Fecha: { createdAt} </Text>
        <Text> Referencia: { tokenUsed } </Text>
        <Button title='Flow' onPress={() => this.props.navigator.navigate('Flow')}/>
      </View>
    )
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
})
export default Confirmation;