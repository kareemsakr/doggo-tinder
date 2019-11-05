import React, { useState, useEffect } from "react";
import { View, Button, StyleSheet, ActivityIndicator } from "react-native";
import { Text, Avatar, Image } from "react-native-elements";
import FirebaseSDK from "../services/Firebase";

const ProfileScreen = ({ navigation }) => {
  const [imageURL, setProfImageURL] = useState(
    "https://doggo-tinder-photos.s3.ca-central-1.amazonaws.com/uploads/loadingdog.png"
  );
  const [ownerImageURL, setownerImageURL] = useState(
    "https://doggo-tinder-photos.s3.ca-central-1.amazonaws.com/uploads/loadingdog.png"
  );
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  this.name = name;
  this.bio = bio;
  this.imageURL = imageURL;
  this.ownerImageURL = ownerImageURL;

  useEffect(() => {
    FirebaseSDK.getUserProfile(snapshot => {
      const profile = snapshot.val();
      console.log("owner picture", profile.owner_picture);
      if (profile) {
        setProfImageURL(profile.profile_picture);
        setownerImageURL(profile.owner_picture);
        setBio(profile.bio);
        setName(profile.name);
      }
    });
  }, []);
  return (
    <View style={{ alignItems: "center" }}>
      <View>
        <View style={styles.container}>
          <Image
            source={{
              uri: imageURL
            }}
            style={{
              width: 300,
              height: 300
            }}
            PlaceholderContent={<ActivityIndicator />}
          />
        </View>
        <View
          style={[
            StyleSheet.absoluteFillObject,
            {
              width: 100,
              height: 100,
              position: "absolute",
              top: 240,
              left: 200,
              borderTopLeftRadius: 250,
              borderTopRightRadius: 250,
              borderBottomLeftRadius: 250,
              borderBottomRightRadius: 250,
              overflow: "hidden"
            }
          ]}
        >
          <Image
            source={{
              uri: ownerImageURL
            }}
            style={{
              width: 100,
              height: 100
            }}
            PlaceholderContent={<ActivityIndicator />}
          />
        </View>
      </View>

      <Text h2>{name}</Text>
      <Text h5>{bio}</Text>
    </View>
  );
};

ProfileScreen.navigationOptions = ({ navigation }) => {
  return {
    headerRight: (
      <Button
        title="Edit"
        onPress={() =>
          navigation.navigate("UpdateProfileScreen", {
            name: this.name,
            imageURL: this.imageURL,
            ownerImageURL: this.ownerImageURL,
            bio: this.bio
          })
        }
      />
    ),
    headerLeft: <Button title="Logout" onPress={FirebaseSDK.logOut} />
  };
};

const styles = StyleSheet.create({
  container: {
    width: 300,
    height: 300,
    borderTopLeftRadius: 250,
    borderTopRightRadius: 250,
    borderBottomLeftRadius: 250,
    borderBottomRightRadius: 250,
    overflow: "hidden",
    alignSelf: "center",
    marginTop: 20
  },
  avatar: { marginTop: 20, flex: 1, borderRadius: 50, height: 300 }
});
export default ProfileScreen;
