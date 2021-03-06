import React, {Component} from 'react';
import {Platform,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image
} from 'react-native';
import ImagePicker from 'react-native-image-picker';
import Firebase from 'react-native-firebase';
import { createStackNavigator } from 'react-navigation';

type Props = {};
export default class App extends Component<Props> {
  state = {
    uri: ""
  };

  openPicker = () => {
    ImagePicker.showImagePicker({}, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        const source = { uri: response.uri };
        this.setState(source);
      }
    });
  };

  upload = () => {
    Firebase.storage()
      .ref("images/" + new Date().getTime())
      .putFile(this.state.uri, { contentType: "image/jpeg" })
      .then(({ downloadURL }) =>
        Firebase.database()
          .ref("images/" + new Date().getTime())
          .set({ downloadURL })
      )
      .then(() => alert("Uploaded"))
      .catch(error => {
        console.log(error);
        alert("Error");
      });
  };

  render() {
    return (
      <View style={styles.container}>
        <Image source={{uri: this.state.uri}} style={styles.image} />
        <TouchableOpacity style={styles.button} onPress={this.openPicker}>
          <Text>Open</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={this.upload}>
          <Text>Send</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  image: {
    width: "100%",
    height: 200,
    backgroundColor: "#EEE",
  },
  button: {
    padding: 20,
  },
});
