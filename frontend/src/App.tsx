import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { useUserStore } from "./stores/useUserStore.ts";
import LoginPage from "./pages/LoginPage.tsx";
import HomePage from "./pages/HomePage.tsx";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

const App = () => {
  const { user } = useUserStore() as { user: User };

  return (
    <>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route
          path="/home"
          element={user ? <HomePage /> : <Navigate to={"/"} replace />}
        />
      </Routes>
    </>
  );
};

export default App;
