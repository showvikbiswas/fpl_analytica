import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./containers/Home";
import Login from "./containers/Login";
import Activate from "./containers/Activate";
import ResetPassword from "./containers/ResetPassword";
import ResetPasswordConfirm from "./containers/ResetPasswordConfirm";
import Signup from "./containers/Signup";
import Layout from "./hocs/Layout";
import { Provider } from "react-redux";
import store from "./store";
import PickTeam from "./containers/PickTeam";
import CreateProfile from "./containers/CreateProfile";
import PrivateRoute from "./hocs/PrivateRoute";
import Transfers from "./containers/Transfers";
import Alerts from "./components/Alerts";

const App = () => {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Alerts />
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route
              path="/password/reset/confirm/:uid/:token"
              element={<ResetPasswordConfirm />}
            />
            <Route path="/create-profile" element={<CreateProfile />} />
            <Route path="/activate/:uid/:token" element={<Activate />} />
            <Route path="/my-team" element={<PickTeam />} />
            <Route path="/transfers" element={<Transfers />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </Provider>
  );
};

export default App;
