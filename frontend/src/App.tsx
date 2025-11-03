import "./index.css";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import { LoginPage } from "./login/LoginPage.tsx";
import TaskPage from "./TaskPage/TaskPage.tsx";
import HomePage from "./HomePage/HomePage.tsx";
import NavBar from "./components/NavBar/NavBar.tsx";
import { AuthProvider } from "./context/AuthContext"; 

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
                path: "/",
                element: <HomePage />,
            },
            {
                path: "/tasks",
                element: <TaskPage />,
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