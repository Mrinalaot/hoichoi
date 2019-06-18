import React, { Component } from 'react';
import { View, Text, StatusBar, Image, ToastAndroid } from 'react-native';
import { Surface, TouchableRipple, Avatar, Button, Searchbar } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import firebase from 'firebase';

class Search extends Component {
  state = {
    search: ''
  }

  render() {
    return (
      <View style={{backgroundColor: '#f4181c', flex: 1}}>
        <View style={{height: StatusBar.currentHeight}}/>
        <Surface ref="header" style={{
            padding: 10, flexDirection: 'row', backgroundColor: '#f4181c', 
            justifyContent: 'space-between', alignItems: 'center', elevation: 4
          }}>
          <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
            <TouchableRipple onPress={() => this.props.navigation.goBack()}>
              <Icon name="arrow-left" size={24} style={{marginRight: 10}} color="white"></Icon>
            </TouchableRipple>
            <Image source={require('../assets/logo.jpeg')} style={{width: 120, height: 40}} />
          </View>
          <TouchableRipple onPress={() => this.props.navigation.navigate('Account', {token: this.state.token})}>
            <Avatar.Image source={{uri: firebase.auth().currentUser.photoURL}} size={36} 
              style={{ backgroundColor: 'white', marginRight: 10 }} />
          </TouchableRipple>
        </Surface>
        <Surface style={{ flex: 1, backgroundColor: 'white', elevation: 4 }}>
          <Surface style={{padding: 20, flexDirection: 'row', alignItems: 'center' }}>
            <Text style={{fontSize: 24, fontWeight: '400'}}>Search movies & shows</Text>
          </Surface>
          <View style={{padding: 20, flex: 1, fontSize: 18}}>
            <Searchbar ref="search" placeholder="Try 'byomkesh'" value={this.state.search} 
              style={{paddingVertical: 7}} onSubmitEditing={this.performSearch.bind(this)} autoFocus={true}
              onChangeText={(search) => this.setState({search})} />

            <Button mode="contained" onPress={this.performSearch.bind(this)}
              style={{marginTop: 20}}
              contentStyle={{paddingVertical: 10, backgroundColor: '#f4181c'}}
              >Search</Button>
          </View>
          <View style={{flex: 1}} />
        </Surface>
      </View>
    );
  }

  performSearch() {
    if (this.state.search != '') {
      this.props.navigation.navigate('Result', {search: this.state.search, token: this.props.navigation.getParam('token')});
    } else {
      ToastAndroid.showWithGravity('Please enter search phrase', ToastAndroid.SHORT, ToastAndroid.CENTER);
    }
  }
}

export default Search;
