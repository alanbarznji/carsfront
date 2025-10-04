const initialState = {
  cars: [], // list of carss
  Session: null,
  error: null,
  errState: false,
  loading: false,
  current: null // single cars (for GetOne)
};

const carsReducer = (state = initialState, action) => {
  switch (action.type) {
    case "carsReqStart":
      return { ...state, loading: true, errState: false, error: null };
      
      case "carsInsert":
        case "carsPut":
          case "carsDelete":
            case "carsGet":
              return {
                ...state,
                loading: false,
                errState: false,
                cars: action.payload, // should be an array (full list)
              };
              
              case "carsGetOne":
      console.log("resuce:::::",action);
     
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

export default carsReducer;
