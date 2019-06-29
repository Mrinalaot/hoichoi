import React, { Component } from 'react';
import { View, Text, Dimensions, TouchableHighlight, Image, FlatList } from 'react-native';
import { getImage } from '../actions';
import * as Animatable from 'react-native-animatable';

export default class Horizontal extends Component {
    
    render() {
        let { title, data } = this.props;

        return (
            <Animatable.View style={{ backgroundColor: 'white'}} animation="fadeInUp">
                <Text style={{ fontSize: 16, padding: 10, fontWeight: '500'}}>{title}</Text>
                <FlatList data={data} horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    renderItem={({item}) => this.renderItems(item)} 
                    keyExtractor={(item, index) => `${index}`}
                    />
            </Animatable.View>
        );
    }

    renderItems(data) {
        let theWidth = Dimensions.get('window').width * (2 / 3);
        let theHeight = theWidth * (9 / 16);
        return (
            <View style={{ margin: 10, width: theWidth, borderColor: 'grey', borderRadius: 5, elevation: 5}}>
                <TouchableHighlight onPress={() => this._goToDetail(data)} style={{width: theWidth, height: theHeight}}>
                    <Image source={{uri: getImage(data)}} 
                        style={{ flex: 1, resizeMode: 'cover', borderRadius: 5}} />
                </TouchableHighlight>
            </View>
        );
    }

    _goToDetail(data) {
        this.props.onSelect(data);
    }

}