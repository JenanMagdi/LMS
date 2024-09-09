import PropTypes from "prop-types";
import { Navigate, Route, Routes } from "react-router-dom";
import { default as ClassDetails } from "../components/ClassDetails";
import EditClass from "../pages/EditClass";
import Home from "../pages/Home";
import Landing from "../pages/Landing";
import Login from "../pages/Login";
import NotFound from "../pages/NotFound";
import Profile from "../pages/Profile";

const ProtectedRoute = ({ children }) => {
  const token = sessionStorage.getItem('token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

const Router = () => {
  return (
    <div>
      <Routes>
      <Route path="/" element={<Landing/>} />
      <Route path="/login" element={<Login />} />
        <Route path="/*" element={<NotFound />} />
        <Route path="/notfound" element={<NotFound />} />
        <Route path="/home" element={
          <ProtectedRoute>
            <Home  />
          </ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } />
        <Route path="/classes" element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        } />
        <Route path="/class/:classId" element={
          <ProtectedRoute>
            <ClassDetails />
          </ProtectedRoute>
        } />
         <Route path="/editclass/:classId" element={
          <ProtectedRoute>
            <EditClass />
          </ProtectedRoute>
        } />         
      </Routes>
    </div>
  );
};
 

export default Router;
