import React, { Component } from 'react';
import { View } from 'react-native';
import { Google, Amplitude } from 'expo';
import config from '../config';
import firebase from 'firebase';
import { TouchableRipple, ActivityIndicator } from 'react-native-paper';
import * as Animatable from 'react-native-animatable';

export default class Login extends Component {

  state = {loading: false}

  componentDidMount() {
    Amplitude.logEventWithProperties('PageView', {
      page: 'Login'
    });
  }

  isUserEqual = (googleUser, firebaseUser) => {
    if (firebaseUser) {
      var providerData = firebaseUser.providerData;
      for (var i = 0; i < providerData.length; i++) {
        if (
          providerData[i].providerId ===
          firebase.auth.GoogleAuthProvider.PROVIDER_ID &&
          providerData[i].uid === googleUser.getBasicProfile().getId()
        ) {
          return true;
        }
      }
    }
    return false;
  };

  onSignIn = googleUser => {
    var unsubscribe = firebase.auth().onAuthStateChanged((firebaseUser) => {
      unsubscribe();
      if (!this.isUserEqual(googleUser, firebaseUser)) {
        var credential = firebase.auth.GoogleAuthProvider.credential(
          googleUser.idToken,
          googleUser.accessToken
        );

        firebase.auth().signInWithCredential(credential).then(result => {
          this.setState({loading: false});
          Amplitude.logEventWithProperties('Login', {
            name: firebaseUser.displayName,
            email: firebaseUser.email
          });
        });
      }
    });
  };

  render() {
    return (
      <View style={{ flex: 1, justifyContent: 'center', padding: 40, backgroundColor: '#f4181c' }}>
        <View style={{flex: 2, justifyContent: 'center', alignItems: 'center'}}>
          <Animatable.Image animation="zoomIn" source={require('../assets/logo.jpeg')} style={{ width: 300, height: 100, marginBottom: 30 }} />
        </View>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          {this.displayButton()}
        </View>
      </View>
    );
  }

  displayButton() {
    if (this.state.loading) {
      return (
        <ActivityIndicator size="large" color="white" />
      );
    }

    return (
      <TouchableRipple onPress={this.loginAsync.bind(this)}>
        <Animatable.Image animation="zoomIn" source={require('../assets/signin.png')} style={{ width: 220, height: 50 }} />
      </TouchableRipple>
    );
  }

  async loginAsync() {
    this.setState({loading: true});
    let result = await Google.logInAsync({ clientId: config.clientId });
    if (result.type == 'success') {
      this.onSignIn(result);
    } else {
      this.setState({loading: false});
    }
  }

}