import { BrowserRouter, Route, Routes } from 'react-router-dom'
 
import { Outlet } from 'react-router-dom'
import './App.css' 
import Home from './page/Home'
 
import ErrorPage from './Util/ErrorPage'
import CarDashboard from './Page/dashbord'
 
const MainLayout = () => (
  <div className="flex flex-col min-h-screen">
    <NavBar />
    <div className="flex-grow">
      <Outlet /> 
    </div>
    <Footer />
  </div>
)

const AdminLayout = () => (
  
  <div className="flex flex-col min-h-screen">
    <NavBar />
    <div className="flex-grow">
      <Outlet />
    </div>
 
  </div>
)

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Main Website Layout */}
       
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<CarDashboard />} />
 
          <Route path="*" element={<ErrorPage />} />  
 
 
 
      </Routes>
    </BrowserRouter>
  )
}

export default App
