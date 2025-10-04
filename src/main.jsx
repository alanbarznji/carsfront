import { StrictMode, useEffect } from 'react'
import { store } from './Redux/store.js'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Provider, useDispatch, useSelector } from 'react-redux'
import { CheckAction } from './Redux/Action/AuthAction.js'
function Bootstrapper() {
 
  return <App />;
}
createRoot(document.getElementById('root')).render(
  <Provider store={store}>
  <StrictMode>
    <Bootstrapper />
  </StrictMode>,
  </Provider>
)
