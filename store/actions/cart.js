// Action Identifier
export const ADD_TO_CART = "ADD_TO_CART";

// Action Creator Function
export const addToCart = (product) => {
  return { type: ADD_TO_CART, product: product }; //return action object
};
