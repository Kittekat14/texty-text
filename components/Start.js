import React from 'react';
import { Button, View, Text, TextInput, ImageBackground, StyleSheet, Platform, KeyboardAvoidingView  } from 'react-native';
//import Poppins from '../assets/fonts/Poppins-Regular.ttf';

export default class Start extends React.Component {
 constructor(props) {
  super(props);
   this.state = {
     text: "",
     background: ""
   };
 }

 setBgColor = (color) => {
    this.setState({ background: color });
  };

 render() {
   return (
     <View style={{ flex: 1, heigth: "100%", width: "100%",  }}>
       <ImageBackground
         style={{
           flex: 1,
           justifyContent: "flex-end",
           alignItems: "center",
         }}
         resizeMode="cover"
         source={require("../assets/BackgroundImage.png")}
       >
         <View style={styles.container}>
           <View style={styles.textInputContainer}>
             <TextInput
               style={{
                 height: 40,
                 width: "88%",
                 borderColor: "gray",
                 borderWidth: 1,
                 opacity: 0.5,
                 marginBottom: 10,
               }}
               onChangeText={(text) => this.setState({ text })}
               value={this.state.text}
               placeholder="Your Name"
             />
             <View style={{ width: "88%" }}>
               <Button
                 title="Go to Chat"
                 color="#757083"
                 accessibilityLabel="This button leads you to the chat room"
                 onPress={() =>
                   this.props.navigation.navigate("Chat", {
                     text: this.state.text,
                     color: this.state.background,
                   })
                 }
               />
             </View>
             <Text>You wrote: {this.state.text}</Text>
             <Text>Choose Background Color:</Text>
             <Text>You selected: {this.state.background}</Text>
           </View>
           <View style={styles.colorContainer}>
             <Text
               style={{
                 width: 50,
                 height: 50,
                 backgroundColor: "#090C08",
                 borderRadius: 50 / 2,
               }}
               onPress={() => this.setBgColor("#090C08")}
             ></Text>
             <Text
               style={{
                 width: 50,
                 height: 50,
                 backgroundColor: "#474056",
                 borderRadius: 50 / 2,
               }}
               onPress={() => this.setBgColor("#474056")}
             ></Text>
             <Text
               style={{
                 width: 50,
                 height: 50,
                 backgroundColor: "#8A95A5",
                 borderRadius: 50 / 2,
               }}
               onPress={() => this.setBgColor("#8A95A5")}
             ></Text>
             <Text
               style={{
                 width: 50,
                 height: 50,
                 backgroundColor: "#B9C6AE",
                 borderRadius: 50 / 2,
               }}
               onPress={() => this.setBgColor("#B9C6AE")}
             ></Text>
           </View>
         </View>
       </ImageBackground>
       {Platform.OS === "android" ? (
         <KeyboardAvoidingView behavior="height" />
       ) : null}
     </View>
   );
 }
}

const styles = StyleSheet.create({
  textInputContainer: {
    flex: 0.3,
    width: "88%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    fontFamily: "Poppins-Regular",
    fontWeight: "300",
    fontSize: 16,
    color: "#757083",
  },
  colorContainer: {
    flex: 0.1,
    width: "88%",
    flexDirection: "row",
    justifyContent: "space-evenly",
    backgroundColor: "white",
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end",
    width: "88%",
    height: "44%",
    bottom: 20,
  },
});
  
