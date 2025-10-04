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
export const GetLogAction = (queryString = "") => {
  // queryString can be "", or something like "page=1&limit=20&keyword=knife"
  return async (dispatch) => {
    dispatch({ type: "LogReqStart" });
    try {
      const url = queryString ? `/log?${queryString}` : `/log`;
      const res = await API.get(url);
      
      // list endpoint returns { results, paginationResult, data: [...] }
      dispatch({
        type: "LogGet",
        payload: res.data?.data || [],
        status: res.status,
      });
    } catch (error) {
      dispatch({ type: "err", err: getErr(error), status: getStatus(error) });
    }
  };
};
export const GetLogOneAction = (From,To) => {
  // queryString can be "", or something like "page=1&limit=20&keyword=knife"
  return async (dispatch) => { 
    try {
      console.log("heos");
      const url =   `/log/log`  ;
      const res = await API.post(
        url,
        { From, To },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("Token")}`,
          },
        }
      );
      // list endpoint returns { results, paginationResult, data: [...] }
      console.log(res.data);
      dispatch({
        type: "LogGet",
        payload: res.data || [],
        status: res.status,
      });
    } catch (error) {
      dispatch({ type: "err", err: getErr(error), status: getStatus(error) });
    }
  };
};

// ===== GET (search) =====
export const GetLogSearchAction = (search) => {
  // `search` is already a query string built by the caller, e.g. "keyword=steel&Active=true"
  return async (dispatch) => {
    dispatch({ type: "LogReqStart" });
    try {
      const res = await API.get(`/log?${search}`);
      dispatch({
        type: "LogGet",
        payload: res.data?.data || [],
        status: res.status,
      });
    } catch (error) {
      dispatch({ type: "err", err: getErr(error), status: getStatus(error) });
    }
  };
};

// ===== GET (one) =====
export const GetOneLogAction = (id) => {
  return async (dispatch) => {
    dispatch({ type: "LogReqStart" });
    try {
      const res = await API.get(`/log/${id}`);
      // single endpoint returns { data: {...} }
      dispatch({
        type: "LogGetOne",
        payload: res.data?.data || null,
        status: res.status,
      });
    } catch (error) {
      dispatch({ type: "err", err: getErr(error), status: getStatus(error) });
    }
  };
};

// ===== CREATE =====
export const InsertLogAction = (Data, CustomerId ) => {
  return async (dispatch) => {
    try { 
      await API.post(
        `/log`,
        {
          Data,
 
          CustomerId,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("Token")}`,
          },
        }
      );
      console.log("monooooooo");
      // your reducer expects list in payload, and delete returns 204 with no body,
      // so we standardize by refreshing the list after mutations:
      const list = await API.get(`/log`);
      dispatch({
        type: "LogInsert",
        payload: list.data?.data || [],
        status: list.status,
      });
    } catch (error) {
      console.log(error);
      dispatch({ type: "err", err: getErr(error), status: getStatus(error) });
    }
  };
};

// ===== UPDATE =====
export const PutLogAction = (id, changes) => {
  // changes: any subset of { Name, Description, price, Active, ExpireDate }
  return async (dispatch) => {
    dispatch({ type: "LogReqStart" });
    try {
      await API.put(`/log/${id}`, {status:changes}, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("Token")}`,
        },
      });
      const list = await API.get(`/log`);
      dispatch({
        type: "LogPut",
        payload: list.data?.data || [],
        status: list.status,
      });
    } catch (error) {
      dispatch({ type: "err", err: getErr(error), status: getStatus(error) });
    }
  };
};

// ===== DELETE =====
export const DeleteLogAction = (id) => {
  return async (dispatch) => {
    dispatch({ type: "LogReqStart" });
    try {
      await API.delete(`/log/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("Token")}`,
        },
      }); // backend sends 204 with no body
      const list = await API.get(`/log`);
      dispatch({
        type: "LogDelete",
        payload: list.data?.data || [],
        status: list.status,
      });
    } catch (error) {
      dispatch({ type: "err", err: getErr(error), status: getStatus(error) });
    }
  };
};
