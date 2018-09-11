import React from 'react';
import { StyleSheet, Text, View, Platform, Linking } from 'react-native';
import { createStackNavigator } from 'react-navigation';
import OneSignal from 'react-native-onesignal';
import {
  Auth,
  Flow,
  Confirmation,
  Verification,
  Scanner,
  Locked,
} from './containers';
import { Status } from './components';
import { Colors } from './utils';

export class App extends React.Component {
  componentWillMount() {
    OneSignal.init("850af6fc-6f49-4aa6-93db-485b39ea917d");
  
    OneSignal.addEventListener('received', this.onReceived);
    OneSignal.addEventListener('opened', this.onOpened);
    OneSignal.addEventListener('ids', this.onIds);
    console.log('One Signal', OneSignal);
    if (Platform.OS === 'android') {
      Linking.getInitialURL().then(url => {
        this.navigate(url);
      });
    } else {
        Linking.addEventListener('url', this.handleOpenURL);
      }
  }

  state = {
    flow: []
  }

  componentWillUnmount() {
      OneSignal.removeEventListener('received', this.onReceived);
      OneSignal.removeEventListener('opened', this.onOpened);
      OneSignal.removeEventListener('ids', this.onIds);
      Linking.removeEventListener('url', this.handleOpenURL);
  }

  handleOpenURL = (event) => { // D
    //this.navigate(event.url);
  }



  onReceived(notification) {
      console.log("Notification received: ", notification);
      this.setState({
        flow: notification.payload.additionalData,
      })
  }

  onOpened(openResult) {
    console.log('Message: ', openResult.notification.payload.body);
    console.log('Data: ', openResult.notification.payload.additionalData);
    console.log('isActive: ', openResult.notification.isAppInFocus);
    console.log('openResult: ', openResult);
  }

  onIds(device) {
  console.log('Device info: ', device);
  }
  render() {
    const { flow } = this.state;
    return (
      <View style={styles.container}>
        <Status/>
        <RootNav {...flow} />
      </View>
    );
  }
}
const RootNav = createStackNavigator({
  Locked,
  Auth: {
    screen: Auth,
    path: 'auth'
  },
  Flow,
  Confirmation,
  Verification,
  Scanner: {
    screen: Scanner,
    path: 'scanner'
  },
}, {
  initialRouteName: 'Locked',
  navigationOptions: {
    header: props => (
      <View style={styles.headerContainer}>
        <View style={styles.headerElements}>
          <Text style={styles.headerText}></Text>
        </View>
      </View>
    )
  }
})

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    height: 80,
    backgroundColor: Colors.aquaBlue
  },
  headerElements: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 18,
    color: 'white',
  }
});

export default App;