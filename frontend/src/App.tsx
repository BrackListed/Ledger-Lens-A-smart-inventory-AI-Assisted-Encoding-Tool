import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Dashboard } from "./pages/Dashboard";
import { Encoder } from "./pages/Encoder";
import { ClerkProvider } from "@clerk/react";
import { Intermission } from "./pages/Intermission";
export default function App(){
  return(
    <BrowserRouter>
    <ClerkProvider publishableKey={import.meta.env.VITE_CLERK_PUBLISHABLE_KEY}>
      <Routes>
        <Route path = "/" element = {<Dashboard/>}/>
        <Route path = "/encoder" element={<Encoder/>}/>
        <Route path = "/intermission" element={<Intermission/>}/>
      </Routes>
    </ClerkProvider>
    </BrowserRouter>
  )
}