import React, { Component } from 'react';
import { View, Text, Image, Dimensions, Linking, ScrollView } from 'react-native';
import { Surface, ActivityIndicator, Button, Paragraph, TouchableRipple } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { getVideos, getVideoSources, getImage } from '../actions';
import Favorite from '../favorite';
import Issue from '../Components/Issue';

class Video extends Component {

  state = {
    data: null,
    sources: [],
    fetched: false,
    favorite: false,
    error: false,
  }

  componentWillMount() {
    const itemId = this.props.navigation.getParam('itemId');
    const token = this.props.navigation.getParam('token');
    const video = this.props.navigation.getParam('data');
    this.setState({data: video});

    getVideos(itemId, token).then(response => {
      let result = response.data.records[0];
      this.setState({data: result, sources: getVideoSources(result), fetched: true});
    }).catch(err => {
      this.setState({fetched: true, error: true});
    });

    this.setFavorite(video);
  }

  render() {
    const width = Dimensions.get('window').width;
    const height = (width / 16) * 9;

    return (
      <View style={{backgroundColor: '#f4181c', flex: 1}}>
        <Surface style={{padding: 17, flexDirection: 'row', alignItems: 'center', elevation: 5, backgroundColor: '#f4181c'}}>
          <TouchableRipple onPress={this._invokeBack.bind(this)}>
            <Icon name="arrow-back" size={24} style={{marginRight: 20}} color="white" />
          </TouchableRipple>
          <Text style={{fontSize: 18, fontWeight: '400', flex: 1, color: 'white'}}>{this.state.data.gist.title}</Text>
          <TouchableRipple onPress={this.toggleFavorite.bind(this)}>
            {this.displayFavoriteIcon()}
          </TouchableRipple>
        </Surface>
        <View style={{flex: 1, backgroundColor: 'white'}}>
          <ScrollView style={{flex: 1}}>
            <Image source={{uri: getImage(this.state.data)}} style={{width, height}}/>
            <View style={{padding: 20}}>
              <Text style={{fontSize:20, fontWeight: '500'}}>{this.state.data.gist.title}</Text>
            </View>
            <Paragraph style={{paddingHorizontal: 20}}>
              {this.state.data.gist.description}
            </Paragraph>
            <View style={{height: 300}}>
              {this.display()}
            </View>
          </ScrollView>
        </View>
      </View>
    );
  }

  display() {
    if (!this.state.fetched) {
      return (
        <View style={{flex: 1, justifyContent: 'center'}}>
          <ActivityIndicator size="large" color="red"/>
        </View>
      );
    }

    if (this.state.error) {
      return <Issue navigation={this.props.navigation} />
    }

    return (
      <View style={{flex: 1, justifyContent: "space-around", padding: 20}}>
        {this.state.sources.map(src => {
          return (
            <Button mode="outlined" icon="play-circle-outline" onPress={() => this._openVideo(src)} 
              key={src.label} borderless={true}
              style={{borderWidth: 1, borderColor: '#f4181c', borderRadius: 5}}
              color="#f4181c" contentStyle={{paddingVertical: 6}}>
              PLAY {src.label}
            </Button>
          )
        })}
      </View>
    );
  }

  toggleFavorite() {
    let video = this.props.navigation.getParam('data');
    if (this.state.favorite) {
      Favorite.video().delete(video).then(() => {
        this.setFavorite(video);
      });
    }

    Favorite.video().set(video).then(() => {
      this.setFavorite(video);
    });
  }

  displayFavoriteIcon() {
    if (this.state.favorite) {
      return <Icon name="favorite" size={24} color="white" />
    }

    return <Icon name="favorite-border" size={24} color="white" />
  }

  setFavorite(video) {
    Favorite.video().has(video).then(favorite => this.setState({favorite}));
  }

  _openVideo(source) {
    Linking.openURL(source.src);
  }

  _getImage(size) {
    return (
      <Image source={{uri: getImage(this.state.data) }} style={{width: size, height: size}} />
    );
  }

  _invokeBack() {
    this.props.navigation.goBack();
  }
}

export default Video;