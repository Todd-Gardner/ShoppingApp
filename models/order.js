import moment from "moment";

class Order {
  constructor(id, items, totalAmount, date) {
    this.id = id;
    this.items = items;
    this.totalAmount = totalAmount;
    this.date = date;
  }

  // Solve the 'Text cannot render a JS Object as a child' error in OrdersScreen
  // Method/Getter acts like a property to convert the date object to readable String
  get readableDate() {
    // BEFORE using moment:
    //toLocaleString - Tue Jun 2 15: 32: 10 2020
    //toLocaleDateString - 06/02/20

    // Display settings: //
    // return this.date.toLocaleString("en-EN", {
    //   year: "numeric",
    //   month: "long",
    //   day: "numeric",
    //   hour: "2-digit",
    //   minute: "2-digit",
    // });
    return moment(this.date).format("MMMM Do YYYY, hh:mm"); //June 2nd 2020, 4:04
  }

  // If date still in xx/xx/xx format on android - npm install --save moment
  //(JS Date lib works iOS and android)
}

export default Order;
