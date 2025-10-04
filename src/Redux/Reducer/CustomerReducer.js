const initialState = {
  Customer: [], // list of Customers
  Session: null,
  error: null,
  errState: false,
  loading: false,
  current: null, // single Customer (for GetOne)
};

const CustomerReducer = (state = initialState, action) => {
  console.log("ddddd",action.payload);
  switch (action.type) {
  
    case "CustomerInsert":
    case "CustomerPut":
    case "CustomerDelete":
    case "CustomerGet":
      return {
        ...state,
        loading: false,
        errState: false,
        Customer: action.payload, // should be an array (full list)
      };

    case "CustomerGetOne":
      return {
        ...state,
        loading: false,
        errState: false,
        current: action.payload, // single object
      };

    case "err":
      return {
        ...state,
        loading: false,
        errState: true,
        error: action.err,
      };

    default:
      return state;
  }
};

export default CustomerReducer;
