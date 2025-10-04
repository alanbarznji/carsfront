const initialState = {
  Dist: [], // list of Dists
  Session: null,
  error: null,
  errState: false,
  loading: false,
  current: null, // single Dist (for GetOne)
};

const DistReducer = (state = initialState, action) => {
  console.log("data:",action.payload);
  switch (action.type) {
    case "DistReqStart":
      return { ...state, loading: true, errState: false, error: null };

    case "DistInsert":
    case "DistPut":
    case "DistDelete":
    case "DistGet":
      return {
        ...state,
        loading: false,
        errState: false,
        Dist: action.payload, // should be an array (full list)
      };

    case "DistGetOne":
      return {
        ...state,
        loading: false,
        errState: false,
        Dist: action.payload, // single object
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

export default DistReducer;
