import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Dashboard } from "./pages/Dashboard";
import { Encoder } from "./pages/Encoder";
import { ClerkProvider } from "@clerk/react";
import { Intermission } from "./pages/Intermission";
import { Stores } from "./pages/Stores";
import { AnomalyReports } from "./pages/AnomalyReports";
import { Settings } from "./pages/Settings";
export default function App(){
  return(
    <BrowserRouter>
    <ClerkProvider publishableKey={import.meta.env.VITE_CLERK_PUBLISHABLE_KEY}>
      <Routes>
        <Route path = "/" element = {<Dashboard/>}/>
        <Route path = "/encoder" element={<Encoder/>}/>
        <Route path = "/intermission" element={<Intermission/>}/>
        <Route path = "/stores" element={<Stores/>}/>
        <Route path = "/anomalyreports" element={<AnomalyReports/>}/>
        <Route path = "/settings" element={<Settings/>}/>
      </Routes>
    </ClerkProvider>
    </BrowserRouter>
  )
}