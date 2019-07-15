import React, { Component } from 'react';
import { Text, View, Alert, Share } from 'react-native';
import firebase from 'firebase';
import { TouchableRipple, Divider, Surface } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import * as Animatable from 'react-native-animatable';
import config from '../config';
import { Amplitude } from 'expo';
import Cache from '../Cache';

export default class Login extends Component {

  state = { user: null, version: config.version }

  componentWillMount() {
    this.setState({ user: firebase.auth().currentUser });
  }

  componentDidMount() {
    Amplitude.logEventWithProperties('PageView', {
      page: 'Account'
    });
  }

  render() {
    return (
      <View style={{ flex: 1, justifyContent: 'center', backgroundColor: '#f4181c' }}>
        <Surface style={{
          padding: 17, flexDirection: 'row', alignItems: 'center',
          elevation: 5, backgroundColor: '#f4181c'
          }}>
          <TouchableRipple onPress={() => this.props.navigation.goBack()}>
            <Icon name="arrow-left" size={24} style={{marginRight: 20}} color="white"></Icon>
          </TouchableRipple>
          <Text style={{fontSize: 18, fontWeight: '400', flex: 1, color: 'white'}}>My Account</Text>
        </Surface>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Animatable.Image animation="zoomIn" source={{ uri: this.state.user.photoURL }} 
            style={{ width: 100, height: 100, borderRadius: 50, borderColor: 'white', borderWidth: 2 }} />
          <View style={{width: '100%', marginTop: 30}}>
            <Text style={{ fontSize: 16, fontWeight: '600', color: 'white', textAlign: 'center' }}>{this.state.user.displayName}</Text>
            <Text style={{ fontSize: 12, fontWeight: '400', color: 'white', textAlign: 'center' }}>{this.state.user.email}</Text>
          </View>
        </View>
        <View style={{ flex: 2, backgroundColor: 'white' }}>
          <TouchableRipple onPress={this.goToFavorites.bind(this)}>
            <View style={{flexDirection: 'row', alignItems: 'center', padding: 17}}>
              <Icon name="heart-outline" size={24} style={{marginRight: 20}} />
              <Text style={{ fontSize: 18 }}>My Favorites</Text>
            </View>
          </TouchableRipple>
          <Divider />
          <TouchableRipple onPress={this.goToFeedback.bind(this)}>
            <View style={{flexDirection: 'row', alignItems: 'center', padding: 17}}>
              <Icon name="message-alert-outline" size={24} style={{marginRight: 20}} />
              <Text style={{ fontSize: 18 }}>Give a Feedback</Text>
            </View>
          </TouchableRipple>
          <Divider />
          <TouchableRipple onPress={this.goToIssue.bind(this)}>
            <View style={{flexDirection: 'row', alignItems: 'center', padding: 17}}>
              <Icon name="alert-circle-outline" size={24} style={{marginRight: 20}} />
              <Text style={{ fontSize: 18 }}>Report an Issue</Text>
            </View>
          </TouchableRipple>
          <TouchableRipple onPress={this.shareApp.bind(this)}>
            <View style={{flexDirection: 'row', alignItems: 'center', padding: 17}}>
              <Icon name="share-variant" size={24} style={{marginRight: 20}} />
              <Text style={{ fontSize: 18 }}>Share the App</Text>
            </View>
          </TouchableRipple>
          <Divider />
          <TouchableRipple onPress={this.askSignOut.bind(this)}>
            <View style={{flexDirection: 'row', alignItems: 'center', padding: 17}}>
              <Icon name="logout" size={24} style={{marginRight: 20}} />
              <Text style={{ fontSize: 18 }}>Sign Out</Text>
            </View>
          </TouchableRipple>

          <View style={{ flex: 1, justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 20 }}>
            <View style={{ width: '100%' }}>
              <Text style={{ fontSize: 16, fontWeight: '200', textAlign: 'center' }}>App Version</Text>
              <Text style={{ textAlign: 'center' }}>{this.state.version}</Text>
            </View>
          </View>
        </View>
      </View>
    );
  }

  goToFavorites() {
    this.props.navigation.navigate('Favorites', {token: this.props.navigation.getParam('token')});
  }

  goToIssue() {
    this.props.navigation.navigate('Issue', {type: 'Issue'});
  }

  goToFeedback() {
    this.props.navigation.navigate('Issue', {type: 'Feedback'});
  }

  shareApp() {
    Cache.get('layout').then(data => {
      const link = ('apk' in data) ? data.apk : config.apk;
      Share.share({
        title: 'Hoichoi TV Free',
        message: 'Watch all Hoichoi TV content for free. Download the app from here: ' + link
      }, {
        subject: 'Hoichoi TV Free'
      }).then(result => {
        if (result.action == Share.sharedAction) {
          Amplitude.logEventWithProperties('Share', {
            name: this.state.user.displayName,
            email: this.state.user.email,
            link,
          });
        }
      });
    });
  }

  askSignOut() {
    Alert.alert('Are you sure?', 'You want to Sign Out?', [
      {text: 'No, Stay'},
      {text: 'Yes, Sign Out', onPress: this.logOutAsync.bind(this), style: 'destructive'}
    ]);
  }

  async logOutAsync() {
    Amplitude.logEventWithProperties('Logout', {
      name: this.state.user.displayName,
      email: this.state.user.email
    });
    firebase.auth().signOut();
  }

}