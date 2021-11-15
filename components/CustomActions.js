import React, { Component } from 'react';
import PropTypes from "prop-types";
import { TouchableHighlight, Image, Button, View, Text, StyleSheet } from 'react-native';
import * as Permissions from "expo-permissions";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import firebase from "firebase";

export default class CustomActions extends Component {

  // Let the user pick an image from the device's image library:
  pickImage = async () => {
    const { status } = await Permissions.askAsync(Permissions.MEDIA_LIBRARY);
    try {
      if (status === "granted") {
        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: "Images",  //only images
        }).catch((error) => console.log(error));
        if (!result.cancelled) {
          const imageUrl = await this.uploadImageFetch(result.uri);
          this.props.onSend({ image: imageUrl });
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  // Let the user take a photo with device's camera:
  takePhoto = async () => {
    const { status } = await Permissions.askAsync(
      Permissions.MEDIA_LIBRARY,
      Permissions.CAMERA
    );
    try {
      if (status === "granted") {
        const result = await ImagePicker.launchCameraAsync().catch((error) => console.log(error));

        if (!result.cancelled) {
          const imageUrl = await this.uploadImageFetch(result.uri);
          this.props.onSend({ image: imageUrl });
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  //get the location of the user by using GPS:
  getLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync(); 
      //Permissions.askAsync(Permissions.LOCATION); ->deprecated
      if (status === "granted") {
        const result = await Location.getCurrentPositionAsync({}).catch(
          (error) => console.log(error)
        );
        const longitude = JSON.stringify(result.coords.longitude);
        const latitude = JSON.stringify(result.coords.latitude);
        if (result) {
          this.props.onSend({
            location: {
              longitude: longitude,
              latitude: latitude,
            },
          });
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  //Upload images to firebase:

  uploadImageFetch = async (uri) => {
    try{
    // To convert image to blob format
      const blob = await new Promise((resolve, reject) => {
        // To create new XMLHttp request
        const xhr = new XMLHttpRequest();
        xhr.onload = function () {
          resolve(xhr.response);
        };
        xhr.onerror = function (error) {
          console.log(error);
          reject(new TypeError('Network Request Failed'));
        };
        // This opens connection to receive image data and reponds as blob
        xhr.responseType = 'blob';
        xhr.open('GET', uri, true);
        xhr.send(null);
      });
    
    const imageNameBefore = uri.split("/");
    const imageName = imageNameBefore[imageNameBefore.length - 1];
    const ref = firebase.storage().ref().child(`images/${imageName}`);
    const snapshot = await ref.put(blob);
    blob.close();

    return await snapshot.ref.getDownloadURL();
    } catch (error) {
      console.log(error.message);
    }
  };

  // function that handles each communication feature
  onActionPress = () => {
    const options = [
      "Choose From Library",
      "Take Picture",
      "Send Location",
      "Cancel",
    ];
    const cancelButtonIndex = options.length - 1;
    this.context.actionSheet().showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
      },
      async (buttonIndex) => {
        switch (buttonIndex) {
          case 0:
            console.log("user wants to pick an image");
            return this.imagePicker();
          case 1:
            console.log("user wants to take a photo");
            return this.takePhoto();
          case 2:
            console.log("user wants to get their location");
            return this.getLocation();
          default:
        }
      },
    );
  };

  render() {
    return (
      <div>
        <TouchableHighlight
          onPress={this.onActionPress}
          style={[styles.container]}
          underlayColor="white"
        >
          <View style={[styles.wrapper, this.props.wrapperStyle]}>
            <Text style={[styles.iconText, this.props.iconTextStyle]}>+</Text>
          </View>
        </TouchableHighlight>
      </div>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: 26,
    height: 26,
    marginLeft: 10,
    marginBottom: 10,
  },
  wrapper: {
    borderRadius: 13,
    borderColor: "#b2b2b2",
    borderWidth: 2,
    flex: 1,
  },
  iconText: {
    color: "#b2b2b2",
    fontWeight: "bold",
    fontSize: 16,
    backgroundColor: "transparent",
    textAlign: "center",
  },
});

CustomActions.contextTypes = {
  actionSheet: PropTypes.func,
};

