import axios from "axios";

export const SignUpAction = (
name,
password,
role,
) => {

    return async (dispatch) => {
      try {
        const res = await axios.post(
          "http://localhost:8000/api/v1/auth/signup",

          {
            name: name,
            password: password,
            role,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
    
 
        dispatch({
          type: "SignUp",
          payload: res.data,
          status: res.status,
        });
      } catch (error) {
        console.log(error,'meme');
        dispatch({
          type: 'err',
          err: error.response.data,
          status: error.response.data.error.statuscode,
        });
      }
    };
  };
  export const LoginAction = ( name,password ) => {
    return async (dispatch) => {
      try {
 
        
        const res = await axios.post(
          "http://local:8000/api/v1/auth/login",
          {
            name,
            password,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
            
        localStorage.setItem("Token",res.data.Token)
 if(res.status==201){
window.location="/"
}else{
   window.alert("error")

 }
        dispatch({
          type: "LoginAction",
          payload: res.data,
          status: res.status,
        });
      } catch (error) {
        console.log("Error in cart request:", error);
        
        dispatch({
          type: 'err',
          err: error.response?.data || "Unknown error",
          status: error.response?.data?.error?.statuscode || 500,
        });
      }
    };

  };
  export const CheckAction = (   ) => {
    return async (dispatch) => {
      try {
 
        
        const res = await axios.post(
          "http://localhost:8000/api/v1/auth/check",
    {},
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("Token")}`,
            },
          }
        );
 console.log("damera");
 
 
        dispatch({
          type: "CheckAction",
          payload: res.data,
          status: res.status,
        });
      } catch (error) {
        console.log("Error in cart request:", error);
        
        dispatch({
          type: 'err',
          err: error.response?.data || "Unknown error",
          status: error.response?.data?.error?.statuscode || 500,
        });
      }
    };

  };
 