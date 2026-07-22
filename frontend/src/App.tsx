import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Dashboard } from "./pages/Dashboard";
import { Encoder } from "./pages/Encoder";
export default function App(){
  return(
    <BrowserRouter>
      <Routes>
        <Route path = "/" element = {<Dashboard/>}/>
        <Route path = "/encoder" element={<Encoder/>}/>
      </Routes>
    </BrowserRouter>
  )
}