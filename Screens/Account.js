import React, { Component } from 'react';
import { Text, View, Image, StatusBar, Alert } from 'react-native';
import firebase from 'firebase';
import { TouchableRipple, Divider, Surface } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import * as Animatable from 'react-native-animatable';

export default class Login extends Component {

  state = { user: null }

  componentWillMount() {
    this.setState({ user: firebase.auth().currentUser });
  }

  render() {
    return (
      <View style={{ flex: 1, justifyContent: 'center', backgroundColor: '#f4181c' }}>
        <View style={{height: StatusBar.currentHeight}} />
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
              <Text style={{ textAlign: 'center' }}>1.3.3</Text>
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

  askSignOut() {
    Alert.alert('Are you sure?', 'You want to log out?', [
      {text: 'Yes', onPress: this.logOutAsync.bind(this), style: 'destructive'},
      {text: 'No'}
    ])
  }

  async logOutAsync() {
    firebase.auth().signOut();
  }

}