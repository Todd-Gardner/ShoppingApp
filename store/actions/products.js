// Action  Identifiers
export const REMOVE_PRODUCT = "REMOVE_PRODUCT";
export const ADD_PRODUCT = "ADD_PRODUCT";
export const UPDATE_PRODUCT = "UPDATE_PRODUCT";

// Action Creator Functions
export const removeProduct = (productId) => {
  return { type: REMOVE_PRODUCT, pId: productId }; //return the action object
};

export const addProduct = (title, imageUrl, description, price) => {
  //function returns the action
  return async (dispatch) => {
    // Run any acync code you want here
    //creates the products folder in the DB
    const response = await fetch(
      "https://rn-shopping-app-595e5.firebaseio.com/products.json",
      {
        //firebase needs the .json
        method: "POST",
        headers: {
          "Content-Type": "Application/json",
        },
        //turn our objects to json
        body: JSON.stringify({
          title: title, //or like below
          imageUrl,
          description,
          price,
        }),
      }
    ); //.then(Response => {...});

    const resData = await response.json();
   // console.log("resData: ", resData);

    dispatch({
      //action
      type: ADD_PRODUCT,
      productData: {
        id: resData.name,
        title: title, //or like below
        imageUrl,
        description,
        price,
      },
    });
  };
};

export const updateProduct = (productId, title, imageUrl, description) => {
  return {
    type: UPDATE_PRODUCT,
    pId: productId,
    productData: {
      title: title, //or like below
      imageUrl,
      description,
    },
  };
};
