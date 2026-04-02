import {Routes, Route } from "react-router-dom"
import HomePage from "../pages/HomePage"
import ExplorePage from "../pages/ExplorePage"
import OrganizationsPage from "../pages/OrganizationsPage"
import LoginPage from "../pages/Logga in/LoginPage"


export default function AppRoutes() {
  return (
    <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/utforska" element={<ExplorePage />} />
        <Route path="/organisationer" element={<OrganizationsPage />} />
        <Route path="/logga-in" element={<LoginPage />} />
    </Routes>
  )
}
