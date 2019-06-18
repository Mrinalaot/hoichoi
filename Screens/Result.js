import React, { Component } from 'react';
import { View, Text, StatusBar, ListView, Dimensions, FlatList } from 'react-native';
import { Surface, ActivityIndicator, TouchableRipple } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { searchVideos, searchSeries } from '../actions';
import {IndicatorViewPager, PagerTitleIndicator} from 'rn-viewpager';
import VideoCard from '../Components/VideoCard';

export default class Result extends Component {

  state = {
    fetched: false,
    seriesList: [],
    videoList: [],
  }

  componentWillMount() {
    this.barHeight = StatusBar.currentHeight;

    const term = this.props.navigation.getParam('search');
    Promise.all([searchSeries(term), searchVideos(term)]).then(findings => {
      let series = findings[0].data;
      let videos = findings[1].data;
      this.setState({
        seriesList: series,
        videoList: videos,
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
          <Text style={{fontSize: 18, fontWeight: '400', flex: 1}}>Results for '{this.props.navigation.getParam('search')}'</Text>
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
          <Text>No Results Found</Text>
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
          <FlatList data={this.state.seriesList} renderItem={({item}) => this._rowRenderer(item)} 
            keyExtractor={(item, index) => `${index}`}/>
        </View>
      );
    }
  }

  displayVideoList() {
    if (this.state.videoList.length) {
      return (
        <View>
          <FlatList data={this.state.videoList} renderItem={({item}) => this._rowRenderer(item)} 
            keyExtractor={(item, index) => `${index}`}/>
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
    let width = Dimensions.get('window').width;
    let titles = [];
    this.state.seriesList.length ? titles.push('Series') : null;
    this.state.videoList.length ? titles.push('Videos') : null;

    width = width / titles.length;

    return (
      <PagerTitleIndicator 
        style={{flexDirection: 'row'}}
        itemStyle={{margin: 0}}
        itemTextStyle={{fontSize: 18, fontWeight: '400', width, textAlign: 'center'}}
        selectedItemTextStyle={{ fontSize: 18, fontWeight: '500', color: 'red', width, textAlign: 'center'}}
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
