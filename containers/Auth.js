import React, { Component } from 'react';
import { View, StyleSheet, Text, Button, SafeAreaView } from 'react-native';
import { Colors } from '../utils';
import PINCode from '@haskkor/react-native-pincode'

export class Auth extends Component {
  static navigationOptions = {
    header: null,
  };

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.authContainer}>
          <View style={styles.authHeaderContainer}>
            <Text style={styles.authHeaderTitle}> BBVA Flow</Text>
            <Text style={styles.authHeaderSubtitle}>Ingresa tu código de accesso a BBVA Bancomer Flow</Text>
          </View>
          <View style={styles.authPinContainer}>
            <PINCode
              status={'choose'}
              iconButtonDeleteDisabled={true}
              passwordComponent={false}
              colorPassword={Colors.white}
              colorPasswordError={Colors.coolGray}
              stylePinCodeButtonCircle={{backgroundColor: 'transparent'}}
              storedPin={'1111'}
              finishProcess={() => { this.props.navigation.navigate('Scanner')}}
              />
          </View>
          <Button title="Scanner" onPress={() => this.props.navigation.navigate('Scanner')}/>
        </View>
      </SafeAreaView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.aquaBlue,
    alignItems: 'center',
    justifyContent: 'center',
  },
  authContainer: {
    alignContent: 'center',
  },
  authHeaderContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  authHeaderTitle: {
    fontSize: 40,
    fontWeight: '400',
    color: Colors.white
  },
  authHeaderSubtitle: {
    fontSize: 20,
    color: Colors.white,
    paddingHorizontal: 20,
    textAlign: 'center',
  },
  authPinContainer: {
    flex: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
})


export default Auth;