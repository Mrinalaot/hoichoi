import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { Button } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

class Issue extends Component {
  render() {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#eeeeee' }}>
        <Icon name="bug-outline" size={32} style={{ padding: 10 }} />
        <Text style={{ fontSize: 16, marginBottom: 20 }}>Something went wrong</Text>
        <Button mode="contained" onPress={this._goToIssuePage.bind(this)}
          contentStyle={{ backgroundColor: 'grey' }}
          >Report an Issue</Button>
      </View>
    );
  }

  _goToIssuePage() {
    this.props.navigation.navigate('Issue', {type: 'Issue'});
  }
}

export default Issue;
