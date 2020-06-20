import Product from "../../models/product";

// Action  Identifiers
export const REMOVE_PRODUCT = "REMOVE_PRODUCT";
export const ADD_PRODUCT = "ADD_PRODUCT";
export const UPDATE_PRODUCT = "UPDATE_PRODUCT";
export const GET_PRODUCTS = "GET_PRODUCTS"; //SET?

// TODO: add error handling

// Action Creator Functions - CRUD Functions
export const fetchProducts = () => {
  return async (dispatch, getState) => {
    const userId = getState().auth.userId;
    // Run any acync code you want here
    try {
      //creates the products folder in the DB if not there
      const response = await fetch(
        "https://rn-shopping-app-595e5.firebaseio.com/products.json"
      ); //.then(Response => {...});
      // Dont need to put header/body etc...GET etc is default

      // Throw Error for 400/500 response codes
      if (!response.ok) {
        //could also check the response.body for specific reason
        throw new Error("Could not connect to the database.");
      }

      const resData = await response.json();
      // console.log("resData: ", resData); //returns object w/ unique id '-M...'

      const loadedProducts = [];
      // Map the keys from the object to array
      for (const key in resData) {
        loadedProducts.push(
          new Product(
            key,
            resData[key].ownerId, //'u1'
            resData[key].title,
            resData[key].imageUrl,
            resData[key].description,
            resData[key].price
          )
        );
      }

      dispatch({
        type: GET_PRODUCTS,
        products: loadedProducts,
        userProducts: loadedProducts.filter(
          (product) => product.ownerId === userId
        ),
      });
    } catch (err) {
      console.log("ERROR: ", err);
      //can thow error to custom analytics server (Jira / Sentry)
      throw err; //throw to parent (ProductsOverviewScreen)
    }
  };
};

export const removeProduct = (productId) => {
  //Using redux thunk - dispatch/getState. getState is all of redux store state
  return async (dispatch, getState) => {
    const token = getState().auth.token;
    const response = await fetch(
      `https://rn-shopping-app-595e5.firebaseio.com/products/${productId}.json?auth=${token}`,
      {
        method: "DELETE",
      }
    );
    // Check for errors - throw to parent component
    if (!response.ok) {
      throw new Error("Could not remove the product from the database.");
    }

    dispatch({
      type: REMOVE_PRODUCT,
      pId: productId,
    }); //return the action object
  };
};

export const addProduct = (title, imageUrl, description, price) => {
  //function returns the action
  //ADD try/catch - Error
  //Using redux thunk - dispatch/getState. getState is all of redux store state
  return async (dispatch, getState) => {
    const token = getState().auth.token;
    const userId = getState().auth.userId;
    // Run any acync code you want here
    //creates the products folder in the DB
    const response = await fetch(
      `https://rn-shopping-app-595e5.firebaseio.com/products.json?auth=${token}`,
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
          ownerId: userId,
        }),
      }
    ); //.then(Response => {...}) if no async/await;

    const resData = await response.json(); //move below error?
    // console.log("resData: ", resData);

    // Check for errors - throw to parent component
    if (!response.ok) {
      throw new Error("Could not add product to the database!");
    }
    dispatch({
      //action
      type: ADD_PRODUCT,
      productData: {
        id: resData.name,
        title: title, //or like below
        imageUrl,
        description,
        price,
        ownerId: userId,
      },
    });
  };
};

export const updateProduct = (productId, title, imageUrl, description) => {
  //Using redux thunk - dispatch/getState. getState is all of redux store state
  return async (dispatch, getState) => {
    const token = getState().auth.token;
    //try/catch?
    const response = await fetch(
      `https://rn-shopping-app-595e5.firebaseio.com/products/${productId}.json?auth=${token}`,
      {
        method: "PATCH", //PUT overwrites everything
        headers: {
          content: "Application/json",
        },
        body: JSON.stringify({
          //PATCH only theese
          title,
          imageUrl,
          description,
        }),
      }
    );
    // Check for errors - throw to parent component
    if (!response.ok) {
      throw new Error("Could not update the database!");
    }

    dispatch({
      type: UPDATE_PRODUCT,
      pId: productId,
      productData: {
        title: title, //or like below
        imageUrl,
        description,
      },
    });
  };
};
