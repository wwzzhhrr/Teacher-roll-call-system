import Login from './Login/index';
import Courses from './CoursesPage/index'
import * as React from "react";
import CourseDetails from './Course/index';
import {
    createBrowserRouter,
    RouterProvider,
} from "react-router-dom";
import CallRoll from "./CallRoll/index";


const App = () => {
    const router = createBrowserRouter([
        {
            path: "",
            element: <div>Hello world！</div>,
        },
        {
            path: "login",
            element: <Login />,
        },
        {
            path: "Courses",
            element: <Courses/>,
        },
        {
            path: "CourseDetails/:courseId",
            element: <CourseDetails />,
        },
        {
            path: "callRoll/:courseId",
            element: <CallRoll/>,
        }]);
    return <RouterProvider router={router} />



}

export default App;
