import React from "react";
import {
  KeyboardAvoidingView,
  ScrollView,
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
} from "react-native";

import Card from "../../components/UI/Card";
import Inputs from "../../components/UI/Inputs";
import Colors from "../../constants/Colors";

const AuthScreen = (props) => {
  return (
    <KeyboardAvoidingView
      style={styles.screen}
      //behavior="padding" //form goes way up
      //keyboardVerticalOffset={50} //{100} from PrOView
      keyboardVerticalOffset={Platform.select({ ios: 0, android: 500 })}
    >
      <Card style={styles.authCard}>
        <ScrollView>
          <Inputs
            id="email"
            label="E-Mail"
            keyboardType="email-address"
            autoCapitalize="none"
            required
            email
            errorMessage="Please enter a valid email address."
            onInputChange={() => {}}
            initialValue=""
          />
          <Inputs
            id="password"
            label="Password"
            keyboardType="default"
            autoCapitalize="none"
            secureTextEntry
            required
            minLength={8}
            errorMessage="Please enter a valid password."
            onInputChange={() => {}}
            initialValue=""
          />
          <View sytle={styles.buttonContainer}>
            <Button title="Login" color={Colors.primary} onPress={() => {}} />
            <Button
              title="Switch to Sign Up"
              color={Colors.accent}
              onPress={() => {}}
            />
          </View>
        </ScrollView>
      </Card>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  authCard: {
    width: "80%",
    maxWidth: 400,
    maxHeight: 400,
    padding: 20,
  },
  buttonContainer: {

  },
});

// Custom Header for page (was Auth)
AuthScreen.navigationOptions = () => { 
    return {
        headerTitle: 'Please Sign In / Sign Up'
    };
};

export default AuthScreen;

