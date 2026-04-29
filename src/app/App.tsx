import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import Mazzotta from "../imports/Mazzotta2";
import Login from "./Login";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Mazzotta />} />
        <Route path="/eyeball/:location" element={<Mazzotta />} />
        <Route path="/all-contracts" element={<Mazzotta />} />
        <Route path="/all-reservations-contracts" element={<Mazzotta />} />
        <Route path="/res-contracts-1-day" element={<Mazzotta />} />
        <Route path="/res-contracts-2-days" element={<Mazzotta />} />
        <Route path="/res-contracts-3-days" element={<Mazzotta />} />
        <Route path="/res-contracts-4-days" element={<Mazzotta />} />
        <Route path="/res-contracts-5-days" element={<Mazzotta />} />
        <Route path="/location-report/:location/:reportType" element={<Mazzotta />} />
        <Route path="/equipment-qty-report" element={<Mazzotta />} />
        <Route path="/equipment-qty-report/:location" element={<Mazzotta />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
