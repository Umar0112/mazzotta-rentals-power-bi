import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import Mazzotta from "../imports/Mazzotta2";
import Login from "./Login";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Mazzotta />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}