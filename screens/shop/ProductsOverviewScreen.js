import React from "react";
import { FlatList } from "react-native";
import { useSelector, useDispatch } from "react-redux"; //to tap into the redux store to get products

import ProductItem from "../../components/shop/ProductItem";
import * as CartActions from "../../store/actions/cart"; //import all actions

const ProductsOverviewScreen = (props) => {
  const products = useSelector((state) => state.products.availableProducts);
  const dispatch = useDispatch();

  return (
    <FlatList
      data={products}
      keyExtractor={(item) => item.id}
      renderItem={(itemData) => (
        <ProductItem
          image={itemData.item.imageUrl}
          title={itemData.item.title}
          price={itemData.item.price}
          onViewDetails={() => {
            props.navigation.navigate("ProductDetails", {
              //send these props when navigating
              productId: itemData.item.id,
              productTitle: itemData.item.title,
            });
          }}
          onAddToCart={() => {
            dispatch(CartActions.addToCart(itemData.item)); //call function w/ item
            //props.navigation.navigate("Cart");
          }}
        />
      )}
    />
  ); //keyExtractor for older versions
};

// Static header title (was ProductsOverview)
ProductsOverviewScreen.navigationOptions = {
  headerTitle: "All Products",
};

export default ProductsOverviewScreen;
