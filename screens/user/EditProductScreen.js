import React, { useState } from "react";
import {
  ScrollView,
  View,
  Text,
  TextInput,
  StyleSheet,
  Platform,
} from "react-native";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import { useSelector } from "react-redux";

import HeaderButton from "../../components/UI/HeaderButton";
import Colors from "../../constants/Colors";

// TODO: Add surrounding views if want bordrerBottom for TextInput
// Set text to show start, not end in textImput

const EditProductScreen = (props) => {
  // Get the product id passed in from navigation
  const prodId = props.navigation.getParam("productId");

  // Find the product slice from the store that matches prodId
  const editedProduct = useSelector((state) =>
    state.products.userProducts.find((prod) => prod.id === prodId)
  );

  // Save/Populate the input if editedProduct
  const [title, setTitle] = useState(editedProduct ? editedProduct.title : "");
  const [imageUrl, setImageUrl] = useState(
    editedProduct && editedProduct.imageUrl
  );
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState(
    editedProduct && editedProduct.description
  );

  return (
    <ScrollView>
      <View style={styles.form}>
        <View style={styles.formControl}>
          <Text style={styles.label}>Title</Text>
          <TextInput
            style={styles.input}
            value={title}
            onChangeText={(text) => setTitle(text)}
          />
        </View>
        <View style={styles.formControl}>
          <Text style={styles.label}>Image URL</Text>
          <TextInput
            style={styles.input}
            value={imageUrl}
            onChangeText={(text) => setImageUrl(text)}
          />
        </View>
        {editedProduct ? null : (
          <View style={styles.formControl}>
            <Text style={styles.label}>Price</Text>
            <TextInput
              style={styles.input}
              value={price}
              onChangeText={(text) => setPrice(text)}
            />
          </View>
        )}
        <View style={styles.formControl}>
          <Text style={styles.label}>Description</Text>
          <View style={{ borderBottomWidth: 1, borderBottomColor: "#CCC" }}>
            <TextInput
              style={styles.input}
              value={description}
              onChangeText={(text) => setDescription(text)}
            />
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

// Additional Navigation Options for the page - Config -
EditProductScreen.navigationOptions = (navData) => {
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
          onPress={() => {
            // submit form
          }}
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
    marginVertical: 8,
    //color: Colors.accent,
  },
  imput: {
    paddingHorizontal: 2,
    paddingVertical: 5,
    borderBottomWidth: 1, // move this into surrounding view (see description input above)
    borderBottomColor: "#CCC", //#888 ?
  },
});

export default EditProductScreen;
