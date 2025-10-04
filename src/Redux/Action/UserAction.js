import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8000/api/v1",
  headers: { "Content-Type": "application/json" },
});

// helpers
const getErr = (e) =>
  e?.response?.data || { message: e?.message || "Unknown error" };
const getStatus = (e) =>
  e?.response?.data?.error?.statuscode || e?.response?.status || 500;

/**
 * Shape reminder (from your schema):
 * {
 *   Name: string,
 *   Description: string,
 *   price: number,
 *   Active?: boolean,
 *   ExpireDate?: string
 * }
 */

// ===== GET (all) =====
export const GetUserAction = (queryString = "") => {
  // queryString can be "", or something like "page=1&limit=20&keyword=knife"
  return async (dispatch) => {
    dispatch({ type: "UserReqStart" });
    try {
      const url = queryString ? `/user?${queryString}` : `/user`;
      const res = await API.get(url);
      // list endpoint returns { results, paginationResult, data: [...] }
      dispatch({
        type: "UserGet",
        payload: res.data?.data || [],
        status: res.status,
      });
    } catch (error) {
      dispatch({ type: "err", err: getErr(error), status: getStatus(error) });
    }
  };
};

// ===== GET (search) =====
export const GetUserSearchAction = (search) => {
  // `search` is already a query string built by the caller, e.g. "keyword=steel&Active=true"
  return async (dispatch) => {
    dispatch({ type: "UserReqStart" });
    try {
      const res = await API.get(`/user?${search}`);
      dispatch({
        type: "UserGet",
        payload: res.data?.data || [],
        status: res.status,
      });
    } catch (error) {
      dispatch({ type: "err", err: getErr(error), status: getStatus(error) });
    }
  };
};

// ===== GET (one) =====
export const GetOneUserAction = (id) => {
  return async (dispatch) => {
    dispatch({ type: "UserReqStart" });
    try {
      const res = await API.get(`/user/${id}`);
      // single endpoint returns { data: {...} }
      dispatch({
        type: "UserGetOne",
        payload: res.data?.data || null,
        status: res.status,
      });
    } catch (error) {
      dispatch({ type: "err", err: getErr(error), status: getStatus(error) });
    }
  };
};

// ===== CREATE =====
export const InsertUserAction = ({
  name,
  email,
  password,
 
}) => {
  return async (dispatch) => {
    dispatch({ type: "UserReqStart" });
    try {
      await API.post(`/user`, {
        name,
        email,
        password,
      });
      // your reducer expects list in payload, and delete returns 204 with no body,
      // so we standardize by refreshing the list after mutations:
      const list = await API.get(`/user`);
      dispatch({
        type: "UserInsert",
        payload: list.data?.data || [],
        status: list.status,
      });
    } catch (error) {
      dispatch({ type: "err", err: getErr(error), status: getStatus(error) });
    }
  };
};

// ===== UPDATE =====
export const PutUserAction = (id, changes) => {
  // changes: any subset of { Name, Description, price, Active, ExpireDate }
  return async (dispatch) => {
    dispatch({ type: "UserReqStart" });
    try {
      await API.put(`/user/${id}`, changes);
      const list = await API.get(`/user`);
      dispatch({
        type: "UserPut",
        payload: list.data?.data || [],
        status: list.status,
      });
    } catch (error) {
      dispatch({ type: "err", err: getErr(error), status: getStatus(error) });
    }
  };
};

// ===== DELETE =====
export const DeleteUserAction = (id) => {
  return async (dispatch) => {
    dispatch({ type: "UserReqStart" });
    try {
      await API.delete(`/user/${id}`); // backend sends 204 with no body
      const list = await API.get(`/user`);
      dispatch({
        type: "UserDelete",
        payload: list.data?.data || [],
        status: list.status,
      });
    } catch (error) {
      dispatch({ type: "err", err: getErr(error), status: getStatus(error) });
    }
  };
};
