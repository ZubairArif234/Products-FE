import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "../pages/landingPages/home";

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
