import React, { useState, useEffect } from "react";
import { Text, View, TextInput, StyleSheet, Button } from "react-native";
import { Avatar, Input } from "react-native-elements";
import Spacer from "../components/spacer";
import FirebaseSDK from "../services/Firebase";
import * as ImagePicker from "expo-image-picker";
import Constants from "expo-constants";
import * as Permissions from "expo-permissions";

const BIO_LEN = 150;

getPermissionAsync = async () => {
  if (Constants.platform.ios) {
    const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    if (status !== "granted") {
      alert("Sorry, we need camera roll permissions to make this work!");
    }
  }
};

const UpdateProfileScreen = ({ navigation }) => {
  const [name, setName] = useState(navigation.getParam("name", ""));
  const [bio, setBio] = useState(navigation.getParam("bio", ""));
  const [imageURL, setImageURL] = useState(
    navigation.getParam(
      "imageURL",
      "https://doggo-tinder-photos.s3.ca-central-1.amazonaws.com/uploads/loadingdog.png"
    )
  );

  this.name = name;
  this.imageURL = imageURL;
  this.bio = bio;

  _pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [1, 1]
    });

    if (!result.cancelled) {
      console.log(result);
      setImageURL(result.uri);
    }
  };

  useEffect(() => {
    getPermissionAsync();
  }, []);
  return (
    <View style={styles.container}>
      <Avatar
        rounded
        size="xlarge"
        source={{
          uri: imageURL
        }}
        showEditButton
        onEditPress={_pickImage}
        containerStyle={styles.avatar}
      />
      <Spacer>
        <Input placeholder="Name..." value={name} onChangeText={setName} />
      </Spacer>

      <Spacer>
        <Input
          multiline={true}
          placeholder="Bio ..."
          maxLength={BIO_LEN}
          value={bio}
          onChangeText={setBio}
          errorMessage={
            bio.length < BIO_LEN
              ? ""
              : `Please enter ${BIO_LEN} characters or less.`
          }
        />
      </Spacer>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
  avatar: { alignSelf: "center", marginTop: 20 },
  //   nameContainer: { padding: 100 },
  bioContainer: { margin: 15 },
  doneButton: {
    marginRight: 15
  }
});

UpdateProfileScreen.navigationOptions = ({ navigation }) => {
  return {
    headerRight: (
      <Button
        style={styles.doneButton}
        title="Done"
        onPress={() => {
          FirebaseSDK.updateUserProfile({
            name: this.name,
            imageURL: this.imageURL,
            bio: this.bio
          });
          navigation.navigate("ProfileScreen");
        }}
      />
    ),
    headerLeft: null
  };
};

export default UpdateProfileScreen;
