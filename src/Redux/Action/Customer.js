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
export const GetCustomerAction = (queryString = "") => {
  // queryString can be "", or something like "page=1&limit=20&keyword=knife"
  return async (dispatch) => {
 ;
    try {
      const url = queryString ? `/customer?${queryString}` : `/customer`;
      const res = await API.get(url );
      // list endpoint returns { results, paginationResult, data: [...] }
      console.log(
        "faaaaaa",res.data.data
      );
      dispatch({
        type: "CustomerGet",
        payload: res.data?.data || [],
        status: res.status,
      });
    } catch (error) {
      dispatch({ type: "err", err: getErr(error), status: getStatus(error) });
    }
  };
};
export const GetcustomreFieldsAction = (queryString = "") => {
  // queryString can be "", or something like "page=1&limit=20&keyword=knife"
  return async (dispatch) => {
    dispatch({ type: "CustomerReqStart" });
    try {
      const url = queryString ? `/customer?${queryString}` : `/customer`;
      const res = await API.get(url );
      // list endpoint returns { results, paginationResult, data: [...] }
      dispatch({
        type: "CustomerGet",
        payload: res.data?.data || [],
        status: res.status,
      });
    } catch (error) {
      dispatch({ type: "err", err: getErr(error), status: getStatus(error) });
    }
  };
};

// ===== GET (search) =====
export const GetcustomreSearchAction = (search) => {
  // `search` is already a query string built by the caller, e.g. "keyword=steel&Active=true"
  return async (dispatch) => {
    dispatch({ type: "CustomerReqStart" });
    try {
      const res = await API.get(`/customer?${search}`);
      dispatch({
        type: "CustomerGet",
        payload: res.data?.data || [],
        status: res.status,
      });
    } catch (error) {
      dispatch({ type: "err", err: getErr(error), status: getStatus(error) });
    }
  };
};

// ===== GET (one) =====
export const GetOneCustomerAction = (id) => {
  return async (dispatch) => {
    dispatch({ type: "CustomerReqStart" });
    try {
      const res = await API.get(`/customer/${id}`);
      // single endpoint returns { data: {...} }
      dispatch({
        type: "CustomerGetOne",
        payload: res.data?.data || null,
        status: res.status,
      });
    } catch (error) {
      dispatch({ type: "err", err: getErr(error), status: getStatus(error) });
    }
  };
};

// ===== CREATE =====
export const InsertCustomerAction = ({
  Name,
  Description,
  price,
  Active = false,
  ExpireDate = "",
}) => {
  return async (dispatch) => {
    dispatch({ type: "CustomerReqStart" });
    try {
      await API.post(
        `/customer`,
        {
          Name,
          Description,
          price,
          Active,
          ExpireDate,
        },

        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("Token")}`,
          },
        }
      );
      // your reducer expects list in payload, and delete returns 204 with no body,
      // so we standardize by refreshing the list after mutations:
      const list = await API.get(`/customer`);
      dispatch({
        type: "CustomerInsert",
        payload: list.data?.data || [],
        status: list.status,
      });
    } catch (error) {
      dispatch({ type: "err", err: getErr(error), status: getStatus(error) });
    }
  };
};

// ===== UPDATE =====
export const PutCustomerAction = (id, changes) => {
  // changes: any subset of { Name, Description, price, Active, ExpireDate }
  return async (dispatch) => {
    dispatch({ type: "CustomerReqStart" });
    try {
      await API.put(`/customer/${id}`, changes, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("Token")}`,
        },
      });
      const list = await API.get(`/customer`);
      dispatch({
        type: "CustomerPut",
        payload: list.data?.data || [],
        status: list.status,
      });
    } catch (error) {
      dispatch({ type: "err", err: getErr(error), status: getStatus(error) });
    }
  };
};

// ===== DELETE =====
export const DeleteCustomerAction = (id) => {
  return async (dispatch) => {
    dispatch({ type: "CustomerReqStart" });
    try {
      await API.delete(`/customer/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("Token")}`,
        },
      }); // backend sends 204 with no body
      const list = await API.get(`/customer`);
      dispatch({
        type: "CustomerDelete",
        payload: list.data?.data || [],
        status: list.status,
      });
    } catch (error) {
      dispatch({ type: "err", err: getErr(error), status: getStatus(error) });
    }
  };
};
