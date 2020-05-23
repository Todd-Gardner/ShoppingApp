import React from "react";
import { FlatList, Text, StyleSheet } from "react-native";
import { useSelector } from "react-redux"; //to tap into the redux store to get products

import ProductItem from "../../components/shop/ProductItem";

const ProductsOverviewScreen = (props) => {
  const products = useSelector((state) => state.products.availableProducts);
  return (
    <FlatList
      data={products}
      keyExtractor={(item) => item.id}
      renderItem={(itemData) => (
        <ProductItem
          image={itemData.item.imageUrl}
          title={itemData.item.title}
          price={itemData.item.price}
          onViewDetails={() => {}}
          onAddToCart={() => {}}
        />
      )}
    />
  ); //keyExtractor for older versions
};

// Static header title (was ProductsOverview)
ProductsOverviewScreen.navigationOptions = {
  headerTitle: "All Products",
};

const styles = StyleSheet.create();

export default ProductsOverviewScreen;
