import { Navigate, Route, Routes } from "react-router-dom";
import HomePage from "../pages/HomePage";
import ExplorePage from "../pages/ExplorePage";
import OrganizationsPage from "../pages/OrganizationsPage";
import LoginPage from "../pages/Logga in/LoginPage";
import RegisterPage from "../pages/Logga in/RegisterPage";
import ApplyPage from "../pages/ApplyPage";
import AnimalDetailPage from "../pages/AnimalDetailPage";
import TestAnimalFetch from "../pages/TestAnimalFetch";
import OrganizationDashboardPage from "../pages/OrganizationDashboardPage";
import MyApplicationsPage from "../pages/MyApplicationsPage";
import { useUser } from "../context/UserContext";


export default function AppRoutes() {
  const { user } = useUser();

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/utforska" element={<ExplorePage />} />
      <Route path="/organisationer" element={<OrganizationsPage />} />
      <Route path="/logga-in" element={<LoginPage />} />
      <Route path="/registrera" element={<RegisterPage />} />
      <Route path="/ansok" element={<ApplyPage />} />
      <Route path="/mina-ansokningar" element={<MyApplicationsPage />} />
      <Route path="/djur/:id" element={<AnimalDetailPage />} />
      <Route path="/test-animal-fetch" element={<TestAnimalFetch />} />
      

      <Route
        path="/organisation-dashboard"
        element={
          user?.role === "organization" ? (
            <OrganizationDashboardPage />
          ) : (
            <Navigate to="/logga-in" replace />
          )
        }
      />
    </Routes>
  );
}
