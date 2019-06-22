import React, { Component } from 'react';
import { View, Text, StatusBar, Image, Dimensions, ScrollView, FlatList } from 'react-native';
import { Surface, Paragraph, ActivityIndicator, TouchableRipple } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { getImage, getSeries } from '../actions';
import VideoCard from '../Components/VideoCard';
import Issue from '../Components/Issue';
import Favorite from '../favorite';

class Series extends Component {

  state = {
    data: null,
    fetched: false,
    favorite: false,
    error: false,
  }

  componentWillMount() {
    let series = this.props.navigation.getParam('data');

    this.setState({ data: series });
    getSeries(series, this.props.navigation.getParam('token')).then(seriesPage => {
      let module = seriesPage.data.modules.find(item => item.moduleType == 'ShowDetailModule');
      this.setState({data: module.contentData[0], fetched: true});
    }).catch(e => {
      this.setState({fetched: true, error: true});
    });

    this.setFavorite(series);
  }

  render() {
    return (
      <View style={{backgroundColor: '#f4181c', flex: 1}}>
        <View style={{height: StatusBar.currentHeight}}></View>
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
          {this.displayContent()}
        </View>
      </View>
    );
  }

  displayContent() {
    if (this.state.error) {
      return <Issue navigation={this.props.navigation} />
    }

    const width = Dimensions.get('window').width;
    const height = (width / 16) * 9;

    return (
      <ScrollView style={{flex: 1}}>
        <View>
          <Image source={{uri: getImage(this.state.data)}} style={{width, height}}/>
        </View>
        <View style={{padding: 20}}>
          <Text style={{fontSize:20, fontWeight: '500'}}>{this.state.data.gist.title}</Text>
        </View>
        <Paragraph style={{paddingHorizontal: 20}}>
          {this.state.data.gist.description}
        </Paragraph>

        {this.renderSeasons()}

      </ScrollView>
    );
  }

  renderSeasons() {
    if (! this.state.fetched) {
      return (
        <View style={{flex: 1, justifyContent: 'center', height: 300}}>
          <ActivityIndicator size="large" color="red"/>
        </View>
      );
    }

    return (
      <View style={{flex: 1, marginBottom: 50}}>
        <FlatList data={this.state.data.seasons.reverse()} renderItem={({item}) => this._renderSeason(item)} 
          keyExtractor={(item, index) => `${index}`} />
      </View>
    );
  }

  _renderSeason(season) {
    return (
      <View style={{height: 290}} key={season.id}>
        <Text style={{fontSize: 18, fontWeight: '500', padding: 20}}>{season.title}</Text>
        <View style={{flex: 1, paddingHorizontal: 10}}>
          <FlatList data={season.episodes} horizontal={true}
            showsHorizontalScrollIndicator={false} keyExtractor={(item, index) => `${index}`}
            renderItem={({item}) => this._renderEpisodes(item)} 
            />
        </View>
      </View>
    );
  }

  _renderEpisodes(data) {
    const width = Dimensions.get('window').width * (2 / 3);
    return (
      <View style={{padding: 10, width, borderRadius: 5, flex: 1}}>
        <TouchableRipple onPress={() => this._goToDetail(data)}>
          <VideoCard data={data} height={140} fontSize={14} style={{height: '100%'}} />
        </TouchableRipple>
      </View>
    );
  }

  toggleFavorite() {
    let series = this.props.navigation.getParam('data');
    if (this.state.favorite) {
      Favorite.series().delete(series).then(() => {
        this.setFavorite(series);
      });
    }

    Favorite.series().set(series).then(() => {
      this.setFavorite(series);
    });
  }

  displayFavoriteIcon() {
    if (this.state.favorite) {
      return <Icon name="favorite" size={24} color="white" />
    }

    return <Icon name="favorite-border" size={24} color="white" />
  }

  setFavorite(series) {
    Favorite.series().has(series).then(favorite => this.setState({favorite}));
  }

  _goToDetail(item) {
    const params = {token: this.props.navigation.getParam('token'), data: item};
    this.props.navigation.navigate('Video', {...params, itemId: item.gist.id});
  }

  _invokeBack() {
    this.props.navigation.goBack();
  }
}

export default Series;