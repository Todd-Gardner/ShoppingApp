import React from "react";
import {
  ScrollView,
  View,
  Text,
  Image,
  Button,
  StyleSheet,
  Platform,
} from "react-native";
import { useSelector, useDispatch } from "react-redux"; //to get product from store
import { HeaderButtons, Item } from "react-navigation-header-buttons";

import Colors from "../../constants/Colors";
import * as cartActions from "../../store/actions/cart";
import HeaderButton from "../../components/UI/HeaderButton";

const ProductDetailScreen = (props) => {
  const productId = props.navigation.getParam("productId");

  //get the single product
  const selectedProduct = useSelector((state) =>
    state.products.availableProducts.find((product) => product.id === productId)
  );
  const dispatch = useDispatch();

  return (
    <ScrollView>
      <Image style={styles.image} source={{ uri: selectedProduct.imageUrl }} />
      <View style={styles.buttonContainer}>
        <Button
          color={Colors.primary}
          title="Add to Cart"
          onPress={() => {
            dispatch(cartActions.addToCart(selectedProduct));
            //props.navigation.navigate("Cart");
          }}
        />
      </View>
      <Text style={styles.price}>${selectedProduct.price.toFixed(2)}</Text>
      <Text style={styles.description}>{selectedProduct.description}</Text>
    </ScrollView>
  );
};

// Show title in navigation header (dynamically)
ProductDetailScreen.navigationOptions = (navData) => {
  return {
    headerTitle: navData.navigation.getParam("productTitle"),
    headerRight: () => (
      <HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item
          title="Cart"
          iconName={Platform.OS === "android" ? "md-cart" : "ios-cart"}
          // color={Platform.OS === "android" ? "white" : Colors.primary}
          onPress={() => {
            navData.navigation.navigate("Cart");
          }}
        />
      </HeaderButtons>
    ),
  };
};

const styles = StyleSheet.create({
  image: {
    width: "100%",
    height: 300,
    //overflow: "hidden"
  },
  buttonContainer: {
    marginVertical: 10,
    alignItems: "center",
  },
  price: {
    marginVertical: 10, //20
    fontSize: 20,
    //fontWeight: "bold",
    fontFamily: "open-sans-bold",
    color: "#888",
    textAlign: "center",
  },
  description: {
    fontFamily: "open-sans",
    fontSize: 14,
    textAlign: "center",
    marginHorizontal: 20,
  },
});

export default ProductDetailScreen;
