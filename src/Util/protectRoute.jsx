import { useSelector } from "react-redux";
import { Outlet } from "react-router";
import ErrorPage from "../Util/ErrorPage";

export default function ProtectedRoute() {
  const { token, loading ,status} = useSelector((s) => s.Auth);
console.log( useSelector((s) => s.Auth));
  if (loading ) return <p>Loading...</p>;
console.log(status);
  if (status != 200) {
    // return <Navigate to="/dashbord" replace />;
    return  <ErrorPage />
    
  }

  return <Outlet/>;}