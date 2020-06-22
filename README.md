# A RN-Expo created Shop App
A LOT of comments in the code!
A complete shop app using Firebase as the backend for user sign up/login authentification and for saving individual user products and past orders to a realtime database.
Users can add/edit/delete their own products.
Comments are also left in to help show what to do for testing.

There is NO payment processing, but might add Stripe (or other) in the future.

# For android users
You will get a yellow-box warning about the setTimeout() being too long. I left this here as a reminder. The below is also in the comments at the top of the store/actions/auth.js file (where the setTimeout is located).

Setting a timer for a long period of time, i.e. multiple minutes, is a performance and correctness issue on Android 
as it keeps the timer module awake, and timers can only be called when the app is in the foreground. See https://github.com/facebook/react-native/issues/12981 for more info.

Partially from a Udemy course.
