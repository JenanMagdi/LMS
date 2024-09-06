import PropTypes from "prop-types";
import { Navigate, Route, Routes } from "react-router-dom";
import { CustomUseContext } from "../context/context";
import Assignments from "../pages/Assignments";
import Classes from "../pages/Classes";
import Home from "../pages/Home";
import Homeworks from "../pages/Homeworks";
import Login from "../pages/Login";
import NotFound from "../pages/NotFound";
import Quizes from "../pages/quizes";

const ProtectedRoute = ({ children }) => {
  // const token = localStorage.getItem('token');
  const { loggedInUser } = CustomUseContext();
  if (!loggedInUser) {
    // if (!token) {
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
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Login />} />
        <Route path="/*" element={<NotFound />} />
        <Route path="/notfound" element={<NotFound />} />    
        <Route path="/home" element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        } />
        <Route path="/homeworks" element={
          <ProtectedRoute>
            <Homeworks />
          </ProtectedRoute>
        } />
        <Route path="/assignments" element={
          <ProtectedRoute>
            <Assignments />
          </ProtectedRoute>
        } />
        <Route path="/quizes" element={
          <ProtectedRoute>
            <Quizes />
          </ProtectedRoute>
        } />
        <Route path="/classes" element={
          <ProtectedRoute>
            <Classes />
          </ProtectedRoute>
        } />
      </Routes>
    </div>
  );
};

export default Router;