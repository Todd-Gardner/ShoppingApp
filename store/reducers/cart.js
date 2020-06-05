import { ADD_TO_CART, REMOVE_FROM_CART } from "../actions/cart";
import { ADD_ORDER } from "../actions/orders";
import { REMOVE_PRODUCT } from "../actions/products";
import CartItem from "../../models/cart-item";

// Cart Slice in State
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
    case REMOVE_FROM_CART:
      const selectedCartItem = state.items[action.pId];
      // If more that 1 in the cart, reduce item by 1. Otherwise, remove from cart.
      const itemCount = selectedCartItem.quantity;
      let updatedCartItems;
      if (itemCount > 1) {
        // need to reduce, not remove
        const updatedCartItem = new CartItem(
          selectedCartItem.quantity - 1,
          selectedCartItem.productPrice,
          selectedCartItem.productTitle,
          selectedCartItem.sum - selectedCartItem.productPrice
        );
        updatedCartItems = { ...state.items, [action.pId]: updatedCartItem };
      } else {
        updatedCartItems = { ...state.items };
        delete updatedCartItems[action.pId];
      }
      return {
        ...state,
        items: updatedCartItems,
        totalAmount: state.totalAmount - selectedCartItem.productPrice,
      };
    case ADD_ORDER:
      // Clear the cart after hitting 'Order Now' button. Using the orders action/reducer
      return initialState;
    case REMOVE_PRODUCT: //from userProductsScreen/ cart/ all products
      if (!state.items[action.pId]) {
        return state;
      }
      const updatedItems = { ...state.items }; //get items from state
      const itemTotal = state.items[action.pId].sum;
      delete updatedItems[action.pId]; //delete the ones with same product Id in the action
      return {
        ...state,
        items: updatedItems,
        totalAmount: state.totalAmount - itemTotal,
      };
  }
  return state;
};
