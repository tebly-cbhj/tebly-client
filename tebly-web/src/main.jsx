import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
//import App from './App.jsx'
import Testpage from './Testpage.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Testpage />
  </StrictMode>,
)
