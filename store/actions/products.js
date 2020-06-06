// Action  Identifiers
export const REMOVE_PRODUCT = "REMOVE_PRODUCT";
export const ADD_PRODUCT = "ADD_PRODUCT";
export const UPDATE_PRODUCT = "UPDATE_PRODUCT";

// Action Creator Functions
export const removeProduct = (productId) => {
  return { type: REMOVE_PRODUCT, pId: productId }; //return the action object
};

export const addProduct = (title, imageUrl, price, description) => {
  return {
    type: ADD_PRODUCT,
    productData: {
      title: title, //or like below
      imageUrl,
      price,
      description,
    },
  };
};

export const updateProduct = (productId, title, imageUrl, description) => {
  return {
    type: UPDATE_PRODUCT,//
    pId: productId,
    productData: {
      title: title, //or like below
      imageUrl,
      description,
    },
  };
};
