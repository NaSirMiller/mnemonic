import "./index.css";

<<<<<<< HEAD
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
=======
import { createBrowserRouter, RouterProvider } from "react-router-dom";
>>>>>>> 7ca0032843adc16fd489f3bcda3050ce8694ba9e
// import { HomePage } from "./pages/HomePage";
import { LoginPage } from "./pages/LoginPage";
import { ProtectedRoute } from "./components/ProtectedRoute";
import TaskPage from "./TaskPage/TaskPage.tsx";
import HomePage from "./HomePage/HomePage.tsx";
<<<<<<< HEAD
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
=======

const appRouter = createBrowserRouter([
    {
        path: "/",
        element: (
            // <ProtectedRoute>
                <HomePage />
            // </ProtectedRoute>
        ),
    },
    {
        path: "/auth",
        element: <LoginPage />,
    },
    {
        path: "/tasks",
        element: <TaskPage />,
>>>>>>> 7ca0032843adc16fd489f3bcda3050ce8694ba9e
    },
]);

function App() {
    return <RouterProvider router={appRouter} />;
    // return <FrontEndHomePage />;
    // return <TaskPage />;
}

export default App;
