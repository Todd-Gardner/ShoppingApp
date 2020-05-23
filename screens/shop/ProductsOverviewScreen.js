import React from "react";
import { FlatList, Text, StyleSheet } from "react-native";
import { useSelector } from "react-redux"; //to tap into the redux store to get products

const ProductsOverviewScreen = (props) => {
  const products = useSelector((state) => state.products.availableProducts);
  return (
    <FlatList
      data={products}
      keyExtractor={(item) => item.id}
      renderItem={(itemData) => <Text>{itemData.item.title}</Text>}
    />
  ); //keyExtractor for older versions
};

// Static header title (was ProductsOverview)
/* ProductsOverviewScreen.navigationOptions = {
    headerTitle: 'All products'
}; */

const styles = StyleSheet.create();

export default ProductsOverviewScreen;
