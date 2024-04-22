import Login from './login';
import * as React from "react";

import {
    createBrowserRouter,
    RouterProvider,
} from "react-router-dom";


const App = () => {
    const router = createBrowserRouter([
        {
            path: "/",
            element: <div>Hello world！</div>,
        },
        {
            path: "/login",
            element: <Login />,
        },
        {
            path: "/callRoll",
            element: <div>点名</div>,
        }]);
    return <RouterProvider router={router} />



}

export default App;
