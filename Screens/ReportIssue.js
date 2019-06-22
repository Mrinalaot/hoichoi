import React, { Component } from 'react';
import { View, Text, StatusBar, ToastAndroid } from 'react-native';
import { Surface, Button, TouchableRipple, TextInput, ActivityIndicator } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { submitIssueOrFeedback } from '../actions';

class Video extends Component {

  state = {
    type: 'Issue',
    title: '',
    body: '',
    loading: false,
  }

  componentWillMount() {
    this.setState({ type: this.props.navigation.getParam('type') });
  }

  render() {
    return (
      <View style={{backgroundColor: '#f4181c', flex: 1}}>
        <View style={{height: StatusBar.currentHeight}} />
        <Surface style={{padding: 17, flexDirection: 'row', alignItems: 'center', elevation: 2, backgroundColor: '#f4181c'}}>
          <TouchableRipple onPress={this._invokeBack.bind(this)}>
            <Icon name="arrow-back" size={24} style={{marginRight: 20}} color="white" />
          </TouchableRipple>
          <Text style={{fontSize: 18, fontWeight: '400', flex: 1, color: 'white'}}>{this.getTitle()}</Text>
        </Surface>
        <View style={{flex: 1, backgroundColor: 'white', padding: 20}}>
          <TextInput label="Title" mode="outlined" style={{ marginBottom: 20 }} theme={{colors: {primary: '#f4181c'}}}
            value={this.state.title} onChangeText={title => this.setState({title})} />
          <TextInput label="Description" mode="outlined" style={{ marginBottom: 20 }} theme={{colors: {primary: '#f4181c'}}}
            multiline={true} numberOfLines={10}
            value={this.state.body} onChangeText={body => this.setState({body})} />

          {this.displayButton()}
        </View>
      </View>
    );
  }

  displayButton() {
    if (this.state.loading) {
      return <ActivityIndicator size="large" color="#f4181c" />;
    }

    return (
      <Button mode="contained" onPress={this._submit.bind(this)}
        contentStyle={{ paddingVertical: 10, backgroundColor: '#f4181c' }}
        >Submit</Button>
    );
  }

  getTitle() {
    return this.state.type == 'Issue' ? 'Report an Issue' : 'Give a Feedback';
  }

  _submit() {
    if (this.state.title == '') {
      return this.showMessage('Please enter the title');
    }
    if (this.state.body == '') {
      return this.showMessage('Please enter the description');
    }

    const {title, body} = this.state;
    const labels = [this.state.type];
    const assignees = ['tzsk'];
    this.setState({ loading: true });

    submitIssueOrFeedback({title, body, labels, assignees}).then(response => {
      this.setState({ loading: false });
      if ('id' in response) {
        this.setState({title: '', body: ''});
        return this.showMessage('Thanks for the submission');
      }
      return this.showMessage('Unable to submit the request');
    }).catch(e => {
      this.setState({ loading: false });
      return this.showMessage('Unable to submit the request');
    });
  }

  showMessage(message) {
    ToastAndroid.showWithGravity(message, ToastAndroid.SHORT, ToastAndroid.CENTER);
  }

  _invokeBack() {
    this.props.navigation.goBack();
  }
}

export default Video;