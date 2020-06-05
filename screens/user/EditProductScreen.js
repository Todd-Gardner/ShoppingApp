import React from "react";
import { View, Text, StyleSheet } from "react-native";

const EditProductScreen = (props) => {
  return (
    <View>
      <Text>Edit product screen</Text>
    </View>
  );
};

// Additional Navigation Options for the page
EditProductScreen.navigationOptions = () => {
  return { headerTitle: "Add/Edit Product" }; //static - was EditProduct
};

const styles = StyleSheet.create({});

export default EditProductScreen;
