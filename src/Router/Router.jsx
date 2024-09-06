import PropTypes from "prop-types";
import { Navigate, Route, Routes } from "react-router-dom";
import { CustomUseContext } from "../context/context";
import Home from "../pages/Home";
import Login from "../pages/Login";
import NotFound from "../pages/NotFound";

const ProtectedRoute = ({ children }) => {
  const { loggedInUser } = CustomUseContext();

  if (!loggedInUser) {
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
        <Route path="/notfound" element={<NotFound />} />
        <Route path="/home" element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        } />
      </Routes>
    </div>
  );
};

export default Router;