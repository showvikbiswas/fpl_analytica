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
import Points from "./containers/Points";
import Leagues from "./containers/Leagues";
import CreateLeague from "./containers/CreateLeague";
import InviteToLeague from "./containers/InviteToLeague";
import JoinLeague from "./containers/JoinLeague";
import Alerts from "./components/Alerts";
import Standings from "./containers/Standings";
import ManageLeague from "./containers/ManageLeague";
import top from "./top.png";

const App = () => {
  return (
    <Provider store={store}>
      <img src={top} alt="top"></img>
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
            <Route path="/points" element={<Points />} />
            <Route path="/leagues" element={<Leagues />} />
            <Route path="/leagues/create" element={<CreateLeague />} />
            <Route path="/leagues/:lid/invite" element={<InviteToLeague />} />
            <Route path="/leagues/join" element={<JoinLeague />} />
            <Route path="/leagues/:lid/standings" element={<Standings />} />
            <Route path="/leagues/:lid/manage" element={<ManageLeague />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </Provider>
  );
};

export default App;
