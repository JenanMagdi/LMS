import { Route, Routes } from "react-router-dom";
import Home from "../pages/Home";
import NotFound from "../pages/NotFound";
import { Login, SignUp } from "../pages/Signup";

const Router = () => {
return (
    <div>
    <Routes>
        <Route path="/Home" element={<Home />} />
        <Route path="/*" element={<NotFound />} />
        <Route path="/login" element={<Login />} />        
        <Route path="/" element={<Login />} />        
        <Route path="/signup" element={<SignUp />} />        
    </Routes>
</div>
)
}
export default Router;