import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { ToastProvider } from "./contexts/ToastContext";
import HomePage from "./components/HomePage";
import LoadingScreen from "./components/LoadingScreen";

const AppRouter = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingScreen />;
  }

  return isAuthenticated ? <App /> : <HomePage />;
};

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <ToastProvider>
      <AuthProvider>
        <AppRouter />
      </AuthProvider>
    </ToastProvider>
  </React.StrictMode>
);
