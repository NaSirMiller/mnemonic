import "./index.css";

import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
// import { HomePage } from "./pages/HomePage";
import { LoginPage } from "./pages/LoginPage";
import { ProtectedRoute } from "./components/ProtectedRoute";
import TaskPage from "./TaskPage/TaskPage.tsx";
import HomePage from "./HomePage/HomePage.tsx";
import NavBar from "./components/NavBar/NavBar.tsx";

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
    return <RouterProvider router={appRouter} />;
    // return <FrontEndHomePage />;
    // return <TaskPage />;
}

export default App;
