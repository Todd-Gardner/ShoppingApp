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
      <View style={styles.imageContainer}>
        <Image
          style={styles.image}
          source={{ uri: selectedProduct.imageUrl }}
        />
        <Button title="Add to Cart" onPress={() => {}} />
      </View>
      <View>
        <Text style={styles.price}>${selectedProduct.price.toFixed(2)}</Text>
        <Text style={styles.description}>{selectedProduct.description}</Text>
      </View>
    </ScrollView>
  );
};

// Show title in navigation header
ProductDetailScreen.navigationOptions = (navData) => {
  return {
    headerTitle: navData.navigation.getParam("productTitle"),
  };
};

const styles = StyleSheet.create({
  imageContainer: {
    width: "100%",
    height: 300,
    //overflow: 'hidden'
  },
  image: {
    width: "100%",
    height: "100%",
    //overflow: "hidden"
  },
  price: {
      paddingVertical: 50,
      fontSize: 20,
      fontWeight: 'bold',
      color: '#888',
      textAlign: "center"
    },
  description: {}
});

export default ProductDetailScreen;
