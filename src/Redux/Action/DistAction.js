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
 

// ===== GET (all) =====
export const GetDistAction = (queryString = "") => {
  // queryString can be "", or something like "page=1&limit=20&keyword=knife"
  return async (dispatch) => {
    dispatch({ type: "DistReqStart" });
    try {
      const url = queryString ? `/Dist?${queryString}` : `/Dist`;
      const res = await API.get(url);
      console.log(res.data.data,length);
      // list endpoint returns { results, paginationResult, data: [...] }
      dispatch({
        type: "DistGet",
        payload: res.data?.data || [],
        status: res.status,
      });
    } catch (error) {
      dispatch({ type: "err", err: getErr(error), status: getStatus(error) });
    }
  };
};
export const GetDistOneAction = () => {
  // queryString can be "", or something like "page=1&limit=20&keyword=knife"
  return async (dispatch) => { 
    try {
      console.log("heos");
      const url =   `Dist/9`  ;
      const res = await API.get(
        url,
     
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
        type: "DistGet",
        payload: res.data.data || [],
        status: res.status,
      });
    } catch (error) {
      dispatch({ type: "err", err: getErr(error), status: getStatus(error) });
    }
  };
};

// ===== GET (search) =====
export const GetDistSearchAction = (search) => {
  // `search` is already a query string built by the caller, e.g. "keyword=steel&Active=true"
  return async (dispatch) => {
    dispatch({ type: "DistReqStart" });
    try {
      const res = await API.get(`/Dist?${search}`);
      dispatch({
        type: "DistGet",
        payload: res.data?.data || [],
        status: res.status,
      });
    } catch (error) {
      dispatch({ type: "err", err: getErr(error), status: getStatus(error) });
    }
  };
};

// ===== GET (one) =====
export const GetOneDistAction = (id) => {
  return async (dispatch) => {
    dispatch({ type: "DistReqStart" });
    try {
      const res = await API.get(`/Dist/${id}`);
      // single endpoint returns { data: {...} }
      dispatch({
        type: "DistGetOne",
        payload: res.data?.data || null,
        status: res.status,
      });
    } catch (error) {
      dispatch({ type: "err", err: getErr(error), status: getStatus(error) });
    }
  };
};

// ===== CREATE =====
export const InsertDistAction = ({
From,
To,
Price,
 
 
}) => {
  return async (dispatch) => {
    dispatch({ type: "DistReqStart" });
    try {
      await API.post(
        `/Dist`,
        {
          From,
          To,
          Price,
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
      const list = await API.get(`/Dist`);
      dispatch({
        type: "DistInsert",
        payload: list.data?.data || [],
        status: list.status,
      });
    } catch (error) {
      dispatch({ type: "err", err: getErr(error), status: getStatus(error) });
    }
  };
};

// ===== UPDATE =====
export const PutDistAction = (id, changes) => {
  // changes: any subset of { Name, Description, price, Active, ExpireDate }
  return async (dispatch) => {
    dispatch({ type: "DistReqStart" });
    console.log("--------");
    try {
      await API.put(`/customer/${id}`, changes, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("Token")}`,
        },
      });

      const list = await API.get(`/Dist/9`);
      dispatch({
        type: "DistPut",
        payload: list.data?.data || [],
        status: list.status,
      });
    } catch (error) {
      dispatch({ type: "err", err: getErr(error), status: getStatus(error) });
    }
  };
};

// ===== DELETE =====
export const DeleteDistAction = (id) => {
  return async (dispatch) => {
    dispatch({ type: "DistReqStart" });
    try {
      await API.delete(`/Dist/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("Token")}`,
        },
      }); // backend sends 204 with no body
      const list = await API.get(`/Dist`);
      dispatch({
        type: "DistDelete",
        payload: list.data?.data || [],
        status: list.status,
      });
    } catch (error) {
      dispatch({ type: "err", err: getErr(error), status: getStatus(error) });
    }
  };
};
