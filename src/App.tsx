import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Login from './pages/Login'
import Signup from './pages/Signup'

function App() {
  return <BrowserRouter><Routes><Route path="/" element={<Login />} /><Route path="/cadastro" element={<Signup />} /><Route path="*" element={<Navigate to="/" replace />} /></Routes></BrowserRouter>
}

export default App
