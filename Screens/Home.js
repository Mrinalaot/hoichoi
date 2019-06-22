import React, { Component } from 'react';
import { View, StatusBar, Image, Animated, Dimensions, FlatList } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { Surface, ActivityIndicator, Avatar, TouchableRipple, FAB } from 'react-native-paper';
import { getAuthToken, getLayout, getContent, getModules } from '../actions';
import Carousel from '../Components/Carousel';
import Horizontal from '../Components/Horizontal';
import Issue from '../Components/Issue';
import firebase from 'firebase';

const AFAB = Animatable.createAnimatableComponent(FAB);

class Home extends Component {

  state = {
    token: null,
    modules: [],
    fetched: false,
    error: false,
  }

  componentWillMount() {
    getAuthToken().then(response => {
      this.setState({token: response.data.authorizationToken});

      return getLayout();
    }).then(({ modules }) => {
      this.setState({modules});
      this.refresh();
    })
    .catch(err => {
      this.setState({fetched: true, error: true});
    });

    this.barHeight = StatusBar.currentHeight;
  }

  render() {
    return (
      <View style={{backgroundColor: '#f4181c', flex: 1}}>
        <View style={{height: this.barHeight}}/>
        <Surface ref="header" style={{
            padding: 10, flexDirection: 'row', backgroundColor: '#f4181c', 
            justifyContent: 'space-between', alignItems: 'center', elevation: 4
          }}>
          <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
            <Image source={require('../assets/logo.jpeg')} style={{width: 120, height: 40}} />
          </View>
          <TouchableRipple onPress={() => this.props.navigation.navigate('Account', {token: this.state.token})}>
            <Avatar.Image source={{uri: firebase.auth().currentUser.photoURL}} size={36} 
              style={{ backgroundColor: 'white', marginRight: 10 }} />
          </TouchableRipple>
        </Surface>
        <Animated.View style={{flex: 1, backgroundColor: 'white'}}>
          {this.renderModules()}
        </Animated.View>
        <AFAB ref="searchIcon" icon="search" animation="zoomIn" onPress={this._onSearchPress.bind(this)}
          style={{position: 'absolute', margin: 16, right: 0, bottom: 0, backgroundColor: '#f4181c'}} />
      </View>
    );
  }

  refresh() {
    getModules(this.state.token).then(({ data }) => {
      let titles = this.state.modules.map(module => {
        return module.title;
      });
      let filtered = data.modules.filter(item => titles.indexOf(item.title) >= 0);
      let modules = this.state.modules.map(module => {
        let found = filtered.find(item => item.title == module.title);
        module.id = found ? found.id : null;
        return module;
      });

      let filteredModules = modules.filter(item => item.id);
      let moduleIds = filteredModules.map(fm => fm.id);
      this.setState({modules: filteredModules, fetched: true});
      
      filteredModules.forEach(fm => {
        getContent(this.state.token, [fm.id]).then(({ data }) => {
          if (data.modules.length < 1) {
            return;
          }
          let foundItem = data.modules.find(m => moduleIds.indexOf(m.id) >= 0);
          if (!foundItem) {
            return;
          }
          let {modules} = this.state;
          let transformed = modules.map(item => {
            if (item.id == foundItem.id) {
              item.data =  foundItem.contentData;
            }

            return item;
          });
          this.setState({modules: transformed});
        });
      });
    })
    .catch(err => {
      this.setState({error: true});
    });
  }

  renderModules() {
    if (! this.state.fetched) {
      return (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <ActivityIndicator size="large" color="#f4181c"/>
        </View>
      );
    }

    if (this.state.error) {
      return <Issue navigation={this.props.navigation} />
    }

    try {
      return (
        <FlatList data={this.state.modules} renderItem={({item}) => this.renderModuleItem(item)} 
          keyExtractor={(item, index) => `${index}`} contentContainerStyle={{paddingBottom: 80}} />
      );
    } catch(e) {
      return <Issue navigation={this.props.navigation} />
    }
  }

  renderModuleItem(module) {
    let height = Dimensions.get('window').width * (9 / 16);
    if (! module.data && !module.id) {
      return (
        <View key={module.title} style={{ height }}>
          <Issue navigation={this.props.navigation} />
        </View>
      );
    }

    if (!module.data) {
      return (
        <View key={module.id} style={{ height, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="red"/>
        </View>
      );
    }

    if (module.component == 'Carousel') {
      return <Carousel key={module.id} title={module.title} data={module.data} onSelect={this._goToDetail.bind(this)} />
    } else {
      return <Horizontal key={module.id} title={module.title} data={module.data} onSelect={this._goToDetail.bind(this)} />
    }
  }

  _onSearchPress() {
    this.props.navigation.navigate('Search', {token: this.state.token});
  }

  _goToDetail(item) {
    const params = {token: this.state.token, data: item};
    if (item.gist.contentType == 'SERIES') {
      this.props.navigation.navigate('Series', {...params, itemId: item.id});
    } else if (item.gist.contentType == 'VIDEO') {
      this.props.navigation.navigate('Video', {...params, itemId: item.gist.id});
    }
  }
}

export default Home;