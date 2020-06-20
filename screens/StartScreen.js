import React, { useEffect } from "react";
import {
  View,
  ActivityIndicator,
  StyleSheet,
  AsyncStorage,
} from "react-native";
import { useDispatch } from "react-redux";

import Colors from "../constants/Colors";
import * as authActions from "../store/actions/auth";

const StartScreen = (props) => {
  const dispatch = useDispatch();

  // Run when component is mounted
  useEffect(() => {
    // Check for token/expiry in phone AsyncStorage
    const tryLogin = async () => {
      //Get data from Storage
      const userData = await AsyncStorage.getItem("userData");
      if (!userData) {
        //No data - go to login (AuthScreen)
        props.navigation.navigate("Auth");
        return;
      }
      const parsedData = JSON.parse(userData); //convert String to Object
      const { token, userId, tokenExpiry } = parsedData;
      //Convert tokenExpiry(ISOString) to Date object
      const expiryDate = new Date(tokenExpiry);

      // Check if token has expired
      if (expiryDate <= new Date() || !token || !userId) {
        //Expired, no token or no userId
        props.navigation.navigate("Auth");
        return;
      }

      // Logged in and token is valid
      props.navigation.navigate("Shop");
      dispatch(authActions.authenticate(userId, token));
    };

    tryLogin();
  }, [dispatch]);

  return (
    <View style={styles.screen}>
      <ActivityIndicator size="large" color={Colors.primary} />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default StartScreen;
