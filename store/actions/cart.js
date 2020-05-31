// Action Identifiers
export const ADD_TO_CART = "ADD_TO_CART";
export const REMOVE_FROM_CART = "REMOVE_FROM_CART";

// Action Creator Functions
export const addToCart = (product) => {
  return { type: ADD_TO_CART, product: product }; //return action object
};

export const removeFromCart = (productId) => {
  return { type: REMOVE_FROM_CART, pId: productId };
};
