import React, { useReducer, useEffect } from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";

// Wrapper and Validation for the TextInput(s)

// Action Identifiers
const INPUT_CHANGE = "INPUT_CHANGE";
const INPUT_BLUR = "INPUT_BLUR";

// Reducer - Manage value of the input text
const inputReducer = (state, action) => {
  switch (action.type) {
    case INPUT_CHANGE: //every keystroke
      return {
        ...state,
        value: action.value,
        isValid: action.isValid,
      };
    case INPUT_BLUR: //if blurred, consider it editer
      return {
        ...state,
        edited: true,
      };
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
    edited: false, //touched
  });

  // Avoid infinite rendering loop - only fires when this prop changes
  const { id, onInputChange } = props;

  // Forward value and if it is valid back to parent (EditProductScreen) component
  useEffect(() => {
    //call function in parent(props)
    if (inputState.edited) {
      onInputChange(id, inputState.value, inputState.isValid);
    }
  }, [inputState, onInputChange, id]); //runs for all of inputState changes (but only if edited)

  const textChangeHandler = (text) => {
    // Input Validation: (or use Validate.js / Formik)
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
    dispatch({ type: INPUT_CHANGE, value: text, isValid: isValid });
  };

  const lostFocusHandler = () => {
    dispatch({ type: INPUT_BLUR });
  };

  return (
    <View style={styles.formControl}>
      <Text style={styles.label}>{props.label}</Text>
      <TextInput
        {...props} //get props passed in
        style={styles.input}
        //value={title} before useReducer
        value={inputState.value}
        onChangeText={textChangeHandler}
        onBlur={lostFocusHandler}
      />
      {!inputState.isValid && inputState.edited && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{props.errorText}</Text>
        </View>
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
    errorContainer: {
        marginVertical: 5,
        
  },
  errorText: {
      color: "red",
      fontFamily: 'open-sans',
      fontSize: 13
  },
});

export default Inputs;
