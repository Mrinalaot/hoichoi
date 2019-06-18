import React, { Component } from 'react';
import { View, Text, StatusBar, ListView, Dimensions } from 'react-native';
import { Surface, ActivityIndicator, TouchableRipple } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {IndicatorViewPager, PagerTitleIndicator} from 'rn-viewpager';
import VideoCard from '../Components/VideoCard';
import Favorite from '../favorite';

export default class Favorites extends Component {

  state = {
    seriesDataSource: null,
    videosDataSource: null,
    fetched: false,
    seriesList: [],
    videoList: [],
  }

  componentWillMount() {
    this.barHeight = StatusBar.currentHeight;

    const provider = new ListView.DataSource({rowHasChanged: (r1, r2) => {
        return r1 !== r2;
    }});
    this.rowRenderer = this._rowRenderer.bind(this);

    Promise.all([Favorite.series().get(), Favorite.video().get()]).then(findings => {
      let series = Array.isArray(findings[0]) ? findings[0] : [];
      let videos = Array.isArray(findings[1]) ? findings[1] : [];
      this.setState({
        seriesList: series,
        videoList: videos,
        seriesDataSource: provider.cloneWithRows(series), 
        videosDataSource: provider.cloneWithRows(videos), 
        fetched: true
      });
    });
  }

  render() {
    return (
      <View style={{backgroundColor: '#f4181c', flex: 1}}>
        <View style={{height: this.barHeight}}></View>
        <Surface style={{padding: 17, flexDirection: 'row', alignItems: 'center', elevation: 2}}>
          <TouchableRipple onPress={this._invokeBack.bind(this)}>
            <Icon name="arrow-back" size={24} style={{marginRight: 20}}></Icon>
          </TouchableRipple>
          <Text style={{fontSize: 18, fontWeight: '400', flex: 1}}>Favorites</Text>
        </Surface>
        <View style={{flex: 1, backgroundColor: 'white'}}>
          {this.renderList()}
        </View>
      </View>
    );
  }

  renderList() {
    if (! this.state.fetched) {
      return (
        <View style={{flex: 1, justifyContent: 'center'}}>
          <ActivityIndicator size="large" color="red"/>
        </View>
      );
    }

    if (this.state.seriesList.length < 1 && this.state.videoList.length < 1) {
      return (
        <View style={{flex: 1, justifyContent: "center", alignItems: "center"}}>
          <Text>No Favorites</Text>
        </View>
      );
    }

    return (
      <IndicatorViewPager style={{flex: 1, flexDirection: 'column-reverse'}} indicator={this._indicators()}>
        {this.displaySeriesList()}
        {this.displayVideoList()}
      </IndicatorViewPager>
    );
  }

  displaySeriesList() {
    if (this.state.seriesList.length) {
      return (
        <View>
          <ListView dataSource={this.state.seriesDataSource} renderRow={this.rowRenderer} enableEmptySections={true}/>
        </View>
      );
    }
  }

  displayVideoList() {
    if (this.state.videoList.length) {
      return (
        <View>
          <ListView dataSource={this.state.videosDataSource} renderRow={this.rowRenderer} enableEmptySections={true}/>
        </View>
      );
    }
  }

  _rowRenderer(data) {
    return (
      <View key={data.id} style={{padding: 10, justifyContent: 'center'}}>
        <TouchableRipple onPress={() => this._goToDetail(data)}>
          <VideoCard data={data} />
        </TouchableRipple>
      </View>
    );
  }

  _indicators() {
    const { width } = Dimensions.get('window');
    let titles = [];
    this.state.seriesList.length ? titles.push('Series') : null;
    this.state.videoList.length ? titles.push('Videos') : null;
    
    return (
      <PagerTitleIndicator 
        style={{flexDirection: 'row'}}
        itemStyle={{margin: 0}}
        itemTextStyle={{fontSize: 18, fontWeight: '400', width: width / titles.length, textAlign: 'center'}}
        selectedItemTextStyle={{ fontSize: 18, fontWeight: '500', color: 'red', width: width / titles.length, textAlign: 'center'}}
        selectedBorderStyle={{ borderColor: 'red' }}
        titles={titles} />
    );
  }

  _goToDetail(item) {
    const params = {token: this.props.navigation.getParam('token'), data: item};
    if (item.gist.contentType == 'SERIES') {
      this.props.navigation.navigate('Series', {...params, itemId: item.id});
    } else if (item.gist.contentType == 'VIDEO') {
      this.props.navigation.navigate('Video', {...params, itemId: item.gist.id});
    }
  }

  _invokeBack() {
    this.props.navigation.goBack();
  }

}