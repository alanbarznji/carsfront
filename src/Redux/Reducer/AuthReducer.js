const initialState = {
  Place: [],
  Session: null,
  error: null,
  errState: false,
  loading: false,
  token:false,
  status:0
};

const AuthReducer = (state = initialState, action) => {
  console.log(action);
  switch (action.type) {
    case "SignUp":
      return {
        ...state,
        loading: false,
        errState: false,
        Place:  action.payload, // Adjust based on your needs
      };
    case "CheckAction":
      return {
        ...state,
        loading: false,
        errState: false,
        token:true,
        status:200
      };

    case "PlaceDelete":
      return {
        ...state,
        loading: false,
        errState: false,
        Place:  action.payload, // Adjust based on your needs
      };

    case "PlaceGet":
      return {
        ...state,
        loading: false,
        errState: false,
        Place: action.payload,
      };

    case "PlaceGetOne":
      return {
        ...state,
        loading: false,
        errState: false,
        Order: action.payload,
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

export default AuthReducer;
