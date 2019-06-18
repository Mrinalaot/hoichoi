import React, { Component } from 'react';
import { View } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import firebase from 'firebase';
import config from '../config';
import * as Animatable from 'react-native-animatable';

firebase.initializeApp(config.firebase);

export default class Landing extends Component {

    componentDidMount() {
        const navigation = this.props.navigation;
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                navigation.navigate('App');
            } else {
                navigation.navigate('Login');
            }
        });
    }

    render() {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f4181c' }}>
                <View style={{flex: 2, justifyContent: 'center', alignItems: 'center'}}>
                    <Animatable.Image animation="zoomIn" source={require('../assets/icon.png')} 
                        style={{ width: 150, height: 150, marginBottom: 30 }} />
                </View>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator size="large" color="white" />
                </View>
            </View>
        );
    }

}