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
import Inputs from "../../components/UI/Inputs";
import Colors from "../../constants/Colors";

// TODO: Add surrounding views if want bordrerBottom for TextInput - working now!?
// Set text to show beginning, not end in description textInput(on android)
// ***Error shows when editing***

// Reduce the amount of useState() for form validations - Centralize
//(outside of function unless you need to use props) so wont have alot of rerender cycles
// Action Identifiers
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
    if (!formState.formIsValid) {
      //if any false, show errore
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
          +formState.inputValues.price //price is last in ProductItem
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

  // Validation
  //Wrap in useCallback so isn't rebuilt unnecessarily & cause useEffect runs in Inputs.js
  const inputChangeHandler = useCallback((inputId, inputValue, inputValidity) => {
    // dispatch with action object
    dispatchFormState({
      type: FORM_INPUT_UPDATE,
      value: inputValue,
      isValid: inputValidity,
      input: inputId, //what called reducer - should also be in the state
    });
  }), [dispatchFormState]; //dependency

  return (
    <ScrollView>
      <View style={styles.form}>
        <Inputs
          id="title" //so no bind needed
          label="Title"
          errorText="Please enter a valid title!"
          keyboardType="default"
          autoCapitalize="words" //sentences
          autoCorrect
          returnKeyType="next"
          minLength={2}
          required
          onInputChange={ inputChangeHandler }
          initialValue={ editedProduct ? editedProduct.title : '' }
          initiallyValid={ !!editedProduct }
          //!! double bang - if none, false
          //maxLength='...'
        />
        <Inputs
          id="imageUrl"
          label="Image URL"
          errorText="Please enter a valid image URL!"
          keyboardType="url"
          returnKeyType="next"
          required
          onInputChange={ inputChangeHandler }
          initialValue={ editedProduct ? editedProduct.imageUrl : '' }
          initiallyValid={ !!editedProduct }
          
        />
        {editedProduct ? null : (
          <Inputs
            id="price"
            label="Price"
            errorText="Please enter a valid price!"
            keyboardType="decimal-pad"
            returnKeyType="next"
            required
            onInputChange={ inputChangeHandler }
            min={0.1}
            //wont have initial value - cant edit
          />
        )}
        <Inputs
          id="description"
          label="Description"
          errorText="Please enter a valid description!"
          keyboardType="default"
          autoCapitalize="sentences"
          autoCorrect
          multiline
          numberOfLines={ 3 }
          minLength={5}
          required
          onInputChange={ inputChangeHandler }
          initialValue={ editedProduct ? editedProduct.description : '' }
          initiallyValid={ !!editedProduct }
          //returnKeyType="next"
          onSubmitEditing={() => console.log("onSubmitEditing - return")}
          onEndEditing={() =>
            console.log("onEndEditing - return or lose focus")
          }
        />
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
});

export default EditProductScreen;
