import React, { useState, useEffect, useReducer, useCallback } from "react";
import {
  KeyboardAvoidingView,
  ScrollView,
  View,
  Button,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useDispatch } from "react-redux";

import Card from "../../components/UI/Card";
import Inputs from "../../components/UI/Inputs";
import Colors from "../../constants/Colors";
import * as authActions from "../../store/actions/auth";

// TODO: Put buttons side by side ?
// TODO: Disable button if entries not valid
// FIX: Test signup/login. Have to hit button twice? (after keyboard hides)

const FORM_INPUT_UPDATE = "FORM_INPUT_UPDATE";

const formReducer = (state, action) => {
  //use switch if alot of if's
  if (action.type === FORM_INPUT_UPDATE) {
    const updatedValues = {
      ...state.inputValues,
      // Dynamically override key/value
      [action.input]: action.value,
    };
    const updatedValidities = {
      ...state.inputValidities,
      [action.input]: action.isValid,
    };
    // form Validity or (Validate.js / Formik)
    let updatedFormIsValid = true; //helper variable
    //loop through updatedValidities (old and new updated one)
    for (const key in updatedValidities) {
      //All have to be true for the form to be valid
      updatedFormIsValid = updatedFormIsValid && updatedValidities[key];
    }
    // return new state snapshot
    return {
      formIsValid: updatedFormIsValid,
      inputValues: updatedValues,
      inputValidities: updatedValidities,
    };
  }
  // if no if's checked, return current state
  return state;
};

const AuthScreen = (props) => {
  const [isSignup, setIsSignup] = useState(false);
  const [error, setError] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  // Initialize/call the formReducer with initial state & destructure
  const [formState, dispatchFormState] = useReducer(formReducer, {
    //always get back State(snapshot) & function
    inputValues: {
      email: "", //initially
      password: "",
    },
    inputValidities: {
      email: false, //initially false when adding new
      password: false,
    },
    formIsValid: false, //initially false when adding new product
  });

  // Hook to receive Errors from auth actions
  useEffect(() => {
    if (error) {
      Alert.alert("An Error Occurred!", error, [{ text: "Ok, Thank You" }]);
    }
  }, [error]);

  const authHandler = async () => {
    let action;
    if (isSignup) {
      action = authActions.signup(
        formState.inputValues.email,
        formState.inputValues.password
      );
    } else {
      action = authActions.login(
        formState.inputValues.email,
        formState.inputValues.password
      );
    }
    setError(null);
    setIsLoading(true);
    try {
      await dispatch(action);
      // Successful login/sign in - Go to Products page
      props.navigation.navigate("Shop");
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
    }
    //setIsLoading(false); now we nav to different page, so moved to catch
  };

  // Validation
  //Wrap in useCallback so isn't rebuilt unnecessarily & cause useEffect runs in Inputs.js
  const inputChangeHandler = useCallback(
    (inputId, inputValue, inputValidity) => {
      // dispatch with action object
      dispatchFormState({
        type: FORM_INPUT_UPDATE,
        value: inputValue,
        isValid: inputValidity,
        input: inputId, //what called reducer - should also be in the state
      });
    },
    [dispatchFormState]
  );

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      //behavior="padding" //form goes way up
      //keyboardVerticalOffset={50} //{100} from PrOView
      keyboardVerticalOffset={Platform.select({
        ios: 0,
        android: 500,
      })}
    >
      <LinearGradient
        colors={[Colors.accent, Colors.primary]}
        style={styles.gradient}
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
              errorText="Please enter a valid email address."
              onInputChange={inputChangeHandler}
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
              errorText="Please enter a valid password."
              onInputChange={inputChangeHandler}
              initialValue=""
            />
            <View style={styles.buttonContainer}>
              {isLoading ? (
                <ActivityIndicator size="small" color={Colors.primary} />
              ) : (
                <Button
                  title={isSignup ? "Sign Up" : "Login"}
                  color={Colors.primary}
                  onPress={authHandler}
                />
              )}
            </View>
            <View style={styles.buttonContainer}>
              <Button
                title={`Switch to ${isSignup ? "Login" : "Sign Up"}`}
                color={Colors.accent}
                onPress={() => setIsSignup((prevState) => !prevState)} //toggle
              />
            </View>
          </ScrollView>
        </Card>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    // above colors={["#FFEDFF", "#FFE3FF"]}
  },
  authCard: {
    width: "80%",
    maxWidth: 400,
    maxHeight: 400,
    padding: 20,
  },
  buttonContainer: {
    marginTop: 10,
  },
});

// Custom Header for page (was Auth)
AuthScreen.navigationOptions = () => {
  return {
    headerTitle: "Please Sign In / Sign Up",
  };
};

export default AuthScreen;
