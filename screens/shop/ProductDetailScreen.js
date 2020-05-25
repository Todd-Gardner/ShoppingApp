import React from "react";
import {
  ScrollView,
  View,
  Text,
  Image,
  Button,
  StyleSheet,
} from "react-native";
import { useSelector } from "react-redux"; //to get product from store

const ProductDetailScreen = (props) => {
  const productId = props.navigation.getParam("productId");
  //get the single product
  const selectedProduct = useSelector((state) =>
    state.products.availableProducts.find((product) => product.id === productId)
  );

  return (
    <ScrollView>
      <View>
        <Text>{selectedProduct.title}</Text>
      </View>
    </ScrollView>
  );
};

// Show title in navigation header
ProductDetailScreen.navigationOptions = (navData) => {
  return {
    headerTitle: navData.navigation.getParam("productTitle")
  };
};

const styles = StyleSheet.create({});

export default ProductDetailScreen;
