const initialState = {
  Review: [], // list of Reviews
  Session: null,
  error: null,
  errState: false,
  loading: false,
  current: null, // single Review (for GetOne)
};

const ReviewReducer = (state = initialState, action) => {
  console.log("data:",action.payload);
  switch (action.type) {
    case "ReviewReqStart":
      return { ...state, loading: true, errState: false, error: null };

    case "ReviewInsert":
    case "ReviewPut":
    case "ReviewDelete":
    case "ReviewGet":
      return {
        ...state,
        loading: false,
        errState: false,
        Review: action.payload, // should be an array (full list)
      };

    case "ReviewGetOne":
      return {
        ...state,
        loading: false,
        errState: false,
        Review: action.payload, // single object
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

export default ReviewReducer;
