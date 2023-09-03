import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./index.css";

import Intro from "./pages/Intro";
import Loading from "./pages/Loading";
import Login from "./pages/users/Login";
import SignUp from "./pages/users/SignUp";
import Map from "./pages/Map";
import MyPage from "./pages/MyPage";
import Detail from "./pages/Detail";
import Nickname from "./pages/users/Nickname";

import Post from "./pages/post/List";
import PostWrite from "./pages/post/Write";

import KakaoLogin from "./pages/users/socials/LoginForKakao";
import NaverLogin from "./pages/users/socials/LoginForNaver";

const App = () => {
  return (
    <React.Fragment>
      <div className="max-w-[640px] w-full m-auto transition-all">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Intro />} />
            <Route path="/loading" element={<Loading />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/signup/nickname" element={<Nickname />} />

            <Route path="/login/kakao" element={<KakaoLogin />} />
            <Route path="/login/naver" element={<NaverLogin />} />

            <Route path="/post" element={<Post />} />
            <Route path="/post/write" element={<PostWrite />} />

            <Route path="/map" element={<Map />} />
            <Route path="/mypage" element={<MyPage />} />
            <Route path="/detail" element={<Detail />} />
          </Routes>
        </BrowserRouter>
      </div>
    </React.Fragment>
  );
};

export default App;