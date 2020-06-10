import React, { useReducer } from "react";
import { View, Text, TextInput, StyleSheet, ActionSheetIOS } from "react-native";

// Wrapper and Validation for the TextInput(s)

// Action Identifiers
const INPUT_CHANGE = 'INPUT_CHANGE';

// Reducer - Manage value of the input text
const inputReducer = (state, action) => { 
    switch (action.type) {
        case INPUT_CHANGE:
            
        default:
            return state;
    }
};

const Inputs = (props) => {
    // Call the reducer with current state object
    const [inputState, dispatch] = useReducer(inputReducer, {
      //see if initial value changed
        value: props.initialValue ? props.initialValue : "",
        isValid: props.initiallyValid,
        edited: false //touched
    });

    const textChangeHandler = text => { 
        // Input Validation: (or use Validate.js)
        const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        let isValid = true; //helper variable
        if (props.required && text.trim().length === 0) {
            isValid = false;
        }
        if (props.email && !emailRegex.test(text.toLowerCase())) {
            isValid = false;
        }
        if (props.min != null && +text < props.min) {
            isValid = false;
        }
        if (props.max != null && +text > props.max) {
            isValid = false;
        }
        if (props.minLength != null && text.length < props.minLength) {
            isValid = false;
        }
        dispatch({ type: INPUT_CHANGE, value: text, isValid: isValid })
    };

  return (
    <View style={styles.formControl}>
      <Text style={styles.label}>{props.label}</Text>
      <TextInput
        {...props} //get props passed in
        style={styles.input}
        //value={title} before useReducer
        value={formState.inputValues.title}
        onChangeText={textChangeHandler}
      />
      {!formState.inputValidities.title && (
        <Text style={styles.error}>{props.errorText}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  formControl: {
    width: "100%",
  },
  label: {
    fontFamily: "open-sans-bold",
    marginVertical: 5,
    //color: Colors.accent,
  },
  input: {
    paddingHorizontal: 2,
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: "#CCC", //#888 ?
  },
  error: {
    color: "red",
  },
});

export default Inputs;

<View style={styles.formControl}>
  <Text style={styles.label}>Price</Text>
  <TextInput
    style={styles.input}
    value={formState.inputValues.price}
    onChangeText={textChangeHandler.bind(this, "price")} //or anon()
    keyboardType="decimal-pad"
  />
</View>;
<View style={styles.formControl}>
  <Text style={styles.label}>Description</Text>
  <TextInput
    style={styles.input}
    value={formState.inputValues.description}
    onChangeText={(text) => textChangeHandler("description", text)} //or bind
  />
</View>;