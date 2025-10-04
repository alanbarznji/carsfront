const initialState = {
  Log: [], // list of Logs
  Session: null,
  error: null,
  errState: false,
  loading: false,
  current: null, // single Log (for GetOne)
};

const LogReducer = (state = initialState, action) => {
  console.log("data:",action.payload);
  switch (action.type) {
    case "LogReqStart":
      return { ...state, loading: true, errState: false, error: null };

    case "LogInsert":
    case "LogPut":
    case "LogDelete":
    case "LogGet":
      return {
        ...state,
        loading: false,
        errState: false,
        Log: action.payload, // should be an array (full list)
      };

    case "LogGetOne":
      return {
        ...state,
        loading: false,
        errState: false,
        Log: action.payload, // single object
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

export default LogReducer;
