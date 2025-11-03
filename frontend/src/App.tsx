import "./index.css";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import { LoginPage } from "./login/LoginPage.tsx";
import TaskPage from "./TaskPage/TaskPage.tsx";
import HomePage from "./HomePage/HomePage.tsx";
import NavBar from "./components/NavBar/NavBar.tsx";
import { AuthProvider } from "./context/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute"; // ✅ fixed path

function Layout() {
  return (
    <div className="page">
      <NavBar />
      <Outlet />
    </div>
  );
}

const appRouter = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/auth", // 👈 public route
        element: <LoginPage />,
      },
      {
        path: "/", // 👇 protected route
        element: (
          <ProtectedRoute>
            <HomePage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/tasks", // 👇 protected route
        element: (
          <ProtectedRoute>
            <TaskPage />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={appRouter} />
    </AuthProvider>
  );
}

export default App;
