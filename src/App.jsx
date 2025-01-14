import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import CreateInvestorForm from "./pages/CreateInvestorForm";
import PrivateRoute from "./components/PrivateRoute";
import Layout from "./components/Layout"; // Includes Header and Sidebar
import InvestorsTable from "./pages/InvestorsTable";
import EditInvestorPage from "./pages/UpdateInvestorForm"; // Import the EditInvestorPage
import InvestorProfile from "./pages/InvestorProfile";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Route (Login Page) */}
        <Route path="/" element={<LoginPage />} />

        {/* Protected Routes with Layout (Header, Sidebar, Content) */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute
              element={
                <Layout>
                  <DashboardPage />
                </Layout>
              }
            />
          }
        />
        <Route
          path="/create-investor"
          element={
            <PrivateRoute
              element={
                <Layout>
                  <CreateInvestorForm />
                </Layout>
              }
            />
          }
        />
        <Route
          path="/investors"
          element={
            <PrivateRoute
              element={
                <Layout>
                  <InvestorsTable />
                </Layout>
              }
            />
          }
        />
        <Route
          path="/edit-investor/:id" // Dynamic route for editing an investor
          element={
            <PrivateRoute
              element={
                <Layout>
                  <EditInvestorPage />
                </Layout>
              }
            />
          }
        />
        <Route
          path="/investor/:id" // Dynamic route for editing an investor
          element={
            <PrivateRoute
              element={
                <Layout>
                 <InvestorProfile/>
                </Layout>
              }
            />
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
