// Action  Identifiers
export const REMOVE_PRODUCT = "REMOVE_PRODUCT";

// Action Creator Functions
export const removeProduct = (productId) => {
  return { type: REMOVE_PRODUCT, pId: productId }; //return the action object
};
