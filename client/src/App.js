import "./App.scss";
import { Container } from "react-bootstrap";
import Register from "./pages/Register.js";
import Login from "./pages/Login.js";
import Home from "./pages/Home.js";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import ApolloProvider from "./pages/ApolloProvider.js";
import { AuthProvider } from "./context/auth";
import DynamicRoute from "./util/DynamicRoute";

function App() {
  return (
    <ApolloProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route
              path="/"
              element={
                <DynamicRoute>
                  <Home authenticated />
                </DynamicRoute>
              }
            />
            <Route
              path="/register"
              element={
                <DynamicRoute>
                  <Register guest />
                </DynamicRoute>
              }
            />
            <Route
              path="/login"
              element={
                <DynamicRoute>
                  <Login guest />
                </DynamicRoute>
              }
            />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ApolloProvider>
  );
}

export default App;
