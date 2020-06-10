import React, { useEffect, useCallback, useReducer } from "react";
import {
  ScrollView,
  View,
  Text,
  TextInput,
  StyleSheet,
  Platform,
  Alert,
} from "react-native";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import { useSelector, useDispatch } from "react-redux";

import HeaderButton from "../../components/UI/HeaderButton";
import * as productActions from "../../store/actions/products"; //import all of the actions
import Colors from "../../constants/Colors";

// TODO: Add surrounding views if want bordrerBottom for TextInput - working now!?
// Set text to show beginning, not end in description textInput(on android)
// ***Error shows when editing***

// Reduce the amount of useState() for form validations - Centralize
//(outside of function unless you need to use props) so wont have alot of rerender cycles
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
    // form Validity
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

const EditProductScreen = (props) => {
  // Get the product id passed in from navigation
  const prodId = props.navigation.getParam("productId");

  // Find the product slice from the store that matches prodId
  const editedProduct = useSelector((state) =>
    state.products.userProducts.find((prod) => prod.id === prodId)
  );

  const dispatch = useDispatch();

  // Call the formReducer with initial state & destructure
  const [formState, dispatchFormState] = useReducer(formReducer, {
    //always get back State(snapshot) & function
    inputValues: {
      title: editedProduct ? editedProduct.title : "",
      imageUrl: editedProduct ? editedProduct.imageUrl : "",
      description: editedProduct ? editedProduct.description : "",
      price: "", //wont need or will want to start empty
    },
    inputValidities: {
      title: editedProduct ? true : false, //if editing, the value is already valid
      imageUrl: editedProduct ? true : false,
      description: editedProduct ? true : false,
      price: editedProduct ? true : false,
    },
    formIsValid: editedProduct ? true : false, //initially false when adding new product
  });

  /* - Used this BEFORE adding the useReducer (import useState)- 
  // Save/Populate the input if editedProduct
  const [title, setTitle] = useState(editedProduct ? editedProduct.title : "");
  const [titleIsValid, setTitleIsValid] = useState(false);
  const [imageUrl, setImageUrl] = useState(
    editedProduct && editedProduct.imageUrl
  );
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState(
    editedProduct && editedProduct.description
  );*/

  // Add/Update a product
  const submitHandler = useCallback(() => {
    // Validation (can also import and use Validate.js library for more complex)
    //if (!titleIsValid) {
    if (!formState.formIsValid) { //if any false, show errore
      Alert.alert("Input Error!", "Please check the errors in the form.", [
        { text: "Will do" }, //not really needed - can use default button
      ]);
      return;
    }
    if (editedProduct) {
      dispatch(
        productActions.updateProduct(
          prodId,
          formState.inputValues.title,
          formState.inputValues.imageUrl,
          formState.inputValues.description
        )
      );
    } else {
      // + to convert price from String to Number
      dispatch(
        productActions.addProduct(
          formState.inputValues.title,
          formState.inputValues.imageUrl,
          formState.inputValues.description,
          +formState.inputValues.price, //price is last in ProductItem
        )
      );
    }
    // Go back to UserProducts screen after adding/editing
    props.navigation.goBack();
  }, [dispatch, prodId, formState]); //run when any changes to theese

  // Will be executed after the render cycle
  useEffect(() => {
    //bind submit (now a param) as key to submitHandler
    props.navigation.setParams({ submit: submitHandler });
  }, [submitHandler]); //wont change, only executes once

  // Basic Validation
  const textChangeHandler = (inputId, text) => {
    let isValid = false;
    //trim white space
    if (text.trim().length > 0) {
      // === 0
      isValid = true;
      /* //setTitleIsValid(false); -using useState
    } else {
      //setTitleIsValid(true); - using useState */
    }
    //setTitle(text); - when using useState

    // dispatch with action object
    dispatchFormState({
      type: FORM_INPUT_UPDATE,
      value: text,
      isValid: isValid,
      input: inputId, //what called reducer - should also be in the state
    });
  };

  return (
    <ScrollView>
      <View style={styles.form}>
        <View style={styles.formControl}>
          <Text style={styles.label}>Title</Text>
          <TextInput
            style={styles.input}
            //value={title} before useReducer
            value={formState.inputValues.title}
            onChangeText={textChangeHandler.bind(this, "title")}
            keyboardType="default"
            autoCapitalize="words" //sentences
            autoCorrect
            returnKeyType="next"
            onSubmitEditing={() => console.log("onSubmitEditing - return")}
            onEndEditing={() =>
              console.log("onEndEditing - return or lose focus")
            }
            //maxLength='...'
          />
          {!formState.inputValidities.title && (
            <Text style={styles.error}>Please enter a valid title!</Text>
          )}
        </View>
        <View style={styles.formControl}>
          <Text style={styles.label}>Image URL</Text>
          <TextInput
            style={styles.input}
            value={formState.inputValues.imageUrl} //
            //onChangeText={(text) => setImageUrl(text)} (for all)
            onChangeText={textChangeHandler.bind(this, "imageUrl")}
            keyboardType="url"
          />
        </View>
        {editedProduct ? null : (
          <View style={styles.formControl}>
            <Text style={styles.label}>Price</Text>
            <TextInput
              style={styles.input}
              value={formState.inputValues.price}
              onChangeText={textChangeHandler.bind(this, "price")}//or anon()
              keyboardType="decimal-pad"
            />
          </View>
        )}
        <View style={styles.formControl}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={styles.input}
            value={formState.inputValues.description}
            onChangeText={(text) => textChangeHandler('description', text)}//or bind
          />
        </View>
      </View>
    </ScrollView>
  );
};

// Additional Navigation Options for the page - Config -
EditProductScreen.navigationOptions = (navData) => {
  // Get 'submit'/ submitHandler that was set w/ useEffect above
  const submitFn = navData.navigation.getParam("submit");
  // Dynamic title
  return {
    headerTitle: navData.navigation.getParam("productId")
      ? "Edit Product"
      : "Add Product",
    headerRight: () => (
      <HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item
          title="Add"
          iconName={
            Platform.OS === "android" ? "md-checkmark" : "ios-checkmark"
          } //create
          onPress={submitFn}
        />
      </HeaderButtons>
    ),
  };
};

const styles = StyleSheet.create({
  form: {
    margin: 20,
  },
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

export default EditProductScreen;
