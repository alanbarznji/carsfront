import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api/v1",
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
export const GetcarsAction = (queryString = "") => {
  // queryString can be "", or something like "page=1&limit=20&keyword=knife"
  return async (dispatch) => {
    dispatch({ type: "carsReqStart" });
    try {
      const url = queryString ? `/cars?${queryString}` : `/cars`;
      const res = await API.get(url);
      // list endpoint returns { results, paginationResult, data: [...] }
      console.log(res);
      dispatch({
        type: "carsGet",
        payload: res.data?.data || [],
        status: res.status,
      });
    } catch (error) {
      dispatch({ type: "err", err: getErr(error), status: getStatus(error) });
    }
  };
};

// ===== GET (search) =====
export const GetcarsSearchAction = (search) => {
  // `search` is already a query string built by the caller, e.g. "keyword=steel&Active=true"
  return async (dispatch) => {
    dispatch({ type: "carsReqStart" });
    try {
      const res = await API.get(`/cars?${search}`);
      dispatch({
        type: "carsGet",
        payload: res.data?.data || [],
        status: res.status,
      });
    } catch (error) {
      dispatch({ type: "err", err: getErr(error), status: getStatus(error) });
    }
  };
};

// ===== GET (one) =====
export const GetOnecarsAction = (id) => {
  return async (dispatch) => {
 
    try {
      
      const res = await API.post(`/cars/${id}`);
      // single endpoint returns { data: {...} }
      

      console.log(res.data,">>>>>>>")
      dispatch({
        type: "carsGetOne",
        payload: res.data ,
        status: res.status,
      });
       return res.data;
    } catch (error) {
      dispatch({ type: "err", err: getErr(error), status: getStatus(error) });
    }
  };
};

// ===== CREATE =====
export const InsertcarsAction = (
form

) => {
  return async (dispatch) => {
 
    try {
      console.log("ssss");
      await API.post(
        `/cars`,
     form,
        {
          headers: {
            "Content-Type": "multipart/form-data",
 
          },
        }
      );
      // your reducer expects list in payload, and delete returns 204 with no body,
      // so we standardize by refreshing the list after mutations:
      const list = await API.get(`/cars`);
      console.log(list);
      dispatch({
        type: "carsInsert",
        payload: list.data?.data || [],
        status: list.status,
      });
    } catch (error) {
      dispatch({ type: "err", err: getErr(error), status: getStatus(error) });
    }
  };
};

// ===== UPDATE =====
export const PutcarsAction = (id, changes) => {
  // changes: any subset of { Name, Description, price, Active, ExpireDate }
  return async (dispatch) => {
    dispatch({ type: "carsReqStart" });
    try {
      await API.put(`/cars/${id}`, changes, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("Token")}`,
        },
      });
      const list = await API.get(`/cars`);
      dispatch({
        type: "carsPut",
        payload: list.data?.data || [],
        status: list.status,
      });
    } catch (error) {
      dispatch({ type: "err", err: getErr(error), status: getStatus(error) });
    }
  };
};

// ===== DELETE =====
export const DeletecarsAction = (id) => {
  return async (dispatch) => {
    dispatch({ type: "carsReqStart" });
    try {
      await API.delete(`/cars/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("Token")}`,
        },
      }); // backend sends 204 with no body
      const list = await API.get(`/cars`);
      dispatch({
        type: "carsDelete",
        payload: list.data?.data || [],
        status: list.status,
      });
    } catch (error) {
      dispatch({ type: "err", err: getErr(error), status: getStatus(error) });
    }
  };
};
