import "./index.css";

import { createBrowserRouter, RouterProvider, Outlet, useLocation } from "react-router-dom";
import { LoginPage } from "./login/LoginPage.tsx";
import { ProtectedRoute } from "./components/ProtectedRoute";
import TaskPage from "./TaskPage/TaskPage.tsx";
import HomePage from "./HomePage/HomePage.tsx";
import NavBar from "./components/NavBar/NavBar.tsx";
import { AuthProvider } from "./context/AuthContext";

function Layout() {
    const location = useLocation();
    const hideNav = location.pathname === "/auth";

    return (
        <div className="page">
            { !hideNav && <NavBar /> }
            <Outlet />
        </div>
    );
}

const appRouter = createBrowserRouter([
    {
        element: <Layout />,
        children: [
            {
                path: "/",
                element: (
                    <ProtectedRoute>
                        <HomePage />
                    </ProtectedRoute>
                ),
            },
            {
                path: "/tasks",
                element: (
                    <ProtectedRoute>
                        <TaskPage />
                    </ProtectedRoute>
                ),
            },
            {
                path: "/auth",
                element: <LoginPage />,
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
