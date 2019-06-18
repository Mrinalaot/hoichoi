import React, { Component } from 'react';
import { Text } from 'react-native';
import { Card } from 'react-native-paper';
import { getImage } from '../actions';
import * as Animatable from 'react-native-animatable';

const AnimatableCard = Animatable.createAnimatableComponent(Card);

export default class VideoCard extends Component {

  render() {
    let { data, height, style } = this.props;
    height = height ? height: 210;

    return (
      <AnimatableCard animation="slideInUp" style={{ ...style, elevation: 4 }}>
        <Card.Cover source={{ uri: getImage(data) }} style={{width: null, height, resizeMode: 'center'}} />
        {this.displayTitle(data)}
      </AnimatableCard>
    );
  }

  displayTitle(data) {
    let {hideTitle, fontSize} = this.props;
    hideTitle = hideTitle ? hideTitle : false;
    fontSize = fontSize ? fontSize : 18;

    if (!hideTitle) {
      return (
        <Card.Content style={{ flex: 1, justifyContent: 'center' }}>
          <Text style={{ fontSize, fontWeight: '400', marginTop: 10 }}>{data.gist.title}</Text>
        </Card.Content>
      );
    }
  }

}