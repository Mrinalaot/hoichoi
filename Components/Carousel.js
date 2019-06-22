import React, { Component } from 'react';
import { Text, View, Dimensions, TouchableHighlight, Image } from 'react-native';
import { getImage } from '../actions';
import { IndicatorViewPager, PagerDotIndicator } from 'rn-viewpager';
import * as Animatable from 'react-native-animatable';

let width = Dimensions.get('window').width;
let height = width * (9 / 16);

export default class Carousel extends Component {
    
    render() {
        let { data, title } = this.props;

        return (
            <Animatable.View style={{ backgroundColor: 'white'}} animation="fadeInUp">
                {this.displayTitle(title)}
                <View style={{width, height}}>
                    <IndicatorViewPager style={{flex: 1}} indicator={this.indicator()}>
                        {data.map((item, i) => {
                            return (
                                <View key={i} style={{flex: 1}}>{this.renderItems(item)}</View>
                            );
                        })}
                    </IndicatorViewPager>
                </View>
            </Animatable.View>
        );
    }

    renderItems(data) {
        return (
            <View style={{ flex: 1, padding: 10, borderRadius: 5}}>
                <TouchableHighlight onPress={() => this._goToDetail(data)} style={{ flex: 1 }}>
                    <Image source={{uri: getImage(data)}} 
                        style={{ flex: 1, resizeMode: 'cover', borderRadius: 5}} />
                </TouchableHighlight>
            </View>
        );
    }

    indicator() {
        return <PagerDotIndicator pageCount={this.props.data.length} style={{padding: 10}} 
            dotStyle={{backgroundColor: 'rgba(255, 255, 255, 0.4)'}} selectedDotStyle={{backgroundColor: '#f4181c'}} />
    }

    displayTitle(title) {
        if (! title) {
            return;
        }
        if (title == 'Carousel') {
            return;
        }

        return <Text style={{ fontSize: 16, padding: 10, fontWeight: '500'}}>{title}</Text>
    }

    _goToDetail(data) {
        this.props.onSelect(data);
    }

}