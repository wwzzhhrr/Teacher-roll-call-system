import Login from './Login/index';
import CallRoll from './CallRoll/index';
import Courses from './CoursesPage/index'
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
            path: "Courses",
            element: <Courses/>,
        },
        {
            path: "/callRoll",
            element: <CallRoll/>,
        }]);
    return <RouterProvider router={router} />



}

export default App;
