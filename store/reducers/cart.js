import { ADD_TO_CART } from "../actions/cart";
import CartItem from "../../models/cart-item";

// Cart Slice
const initialState = {
  items: {},
  totalAmount: 0,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case ADD_TO_CART:
      const addedProduct = action.product;
      const productTitle = addedProduct.title;
      const productPrice = addedProduct.price;

      let updatedOrNewCartItem;

      if (state.items[addedProduct.id]) {
        // Item already in the Cart
        updatedOrNewCartItem = new CartItem(
          state.items[addedProduct.id].quantity + 1,
          productPrice,
          productTitle,
          state.items[addedProduct.id].sum + productPrice
          // state.items[addedProduct.id].quantity * productPrice
        );
      } else {
        // Item not in the Cart
        updatedOrNewCartItem = new CartItem(
          1,
          productPrice,
          productTitle,
          productPrice
        );
      }
      return {
        //can leave out copying state unless you add something else that isn't updated below.
        //...state,
        items: { ...state.items, [addedProduct.id]: updatedOrNewCartItem },
        totalAmount: state.totalAmount + productPrice, //[] to access dynamically. Not hard coded string
      };
  }
  return state;
};
