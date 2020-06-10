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
  }
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
      price: "", //wont need or will want to start empty
      description: editedProduct ? editedProduct.description : "",
    },
    inputValidities: {
      title: editedProduct ? true : false, //if editing, the value is already valid
      imageUrl: editedProduct ? true : false,
      price: editedProduct ? true : false,
      description: editedProduct ? true : false,
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
    if (!titleIsValid) {
      Alert.alert("Input Error!", "Please check the errors in the form.", [
        { text: "Will do" }, //not really needed - can use default button
      ]);
      return;
    }
    if (editedProduct) {
      dispatch(
        productActions.updateProduct(prodId, title, imageUrl, description)
      );
    } else {
      // + to convert price from String to Number
      dispatch(productActions.addProduct(title, imageUrl, description, +price));
    }
    // Go back to UserProducts screen after adding/editing
    props.navigation.goBack();
  }, [dispatch, prodId, title, imageUrl, price, description, titleIsValid]); //run when any changes to theese

  // Will be executed after the render cycle
  useEffect(() => {
    //bind submit (now a param) as key to submitHandler
    props.navigation.setParams({ submit: submitHandler });
  }, [submitHandler]); //wont change, only executes once

  // Basic Validation for the Title
  const titleChangeHandler = (text) => {
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
      input: 'title' //what called reducer - should also be in the state
    });
  };

  return (
    <ScrollView>
      <View style={styles.form}>
        <View style={styles.formControl}>
          <Text style={styles.label}>Title</Text>
          <TextInput
            style={styles.input}
            value={title}
            onChangeText={titleChangeHandler}
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
          {!titleIsValid && (
            <Text style={styles.error}>Please enter a valid title!</Text>
          )}
        </View>
        <View style={styles.formControl}>
          <Text style={styles.label}>Image URL</Text>
          <TextInput
            style={styles.input}
            value={imageUrl}
            onChangeText={(text) => setImageUrl(text)}
            keyboardType="url"
          />
        </View>
        {editedProduct ? null : (
          <View style={styles.formControl}>
            <Text style={styles.label}>Price</Text>
            <TextInput
              style={styles.input}
              value={price}
              onChangeText={(text) => setPrice(text)}
              keyboardType="decimal-pad"
            />
          </View>
        )}
        <View style={styles.formControl}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={styles.input}
            value={description}
            onChangeText={(text) => setDescription(text)}
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
