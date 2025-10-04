const initialState = {
  User: [], // list of Users
  Session: null,
  error: null,
  errState: false,
  loading: false,
  current: null, // single User (for GetOne)
};

const UserReducer = (state = initialState, action) => {
  switch (action.type) {
    case "UserReqStart":
      return { ...state, loading: true, errState: false, error: null };

    case "UserInsert":
    case "UserPut":
    case "UserDelete":
    case "UserGet":
      return {
        ...state,
        loading: false,
        errState: false,
        User: action.payload, // should be an array (full list)
      };

    case "UserGetOne":
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

export default UserReducer;
