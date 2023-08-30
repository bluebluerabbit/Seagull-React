import axios from "axios";
import React, { useEffect, useState } from "react";
import crypto from 'crypto-js'
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";

import { ReactComponent as Visibility } from "../../img/icon/visibility.svg";
import { ReactComponent as Visibility_off } from "../../img/icon/visibility_off.svg";
import { ReactComponent as Logo } from "../../img/icon/logo.svg";
import { useNavigate } from "react-router-dom";

const SignIn = () => {

  const navigate = useNavigate()

  const [id, setId] = useState('')
  const [pw, setPw] = useState('')

  const [pwType, setpwType] = useState({
    type: "password",
    visible: false,
  });

  const userToken = localStorage.getItem("userToken")
  const kakaoAccessToken = localStorage.getItem('kakaoLoginJWT')
  const naverAccessToken = localStorage.getItem('naverLoginJWT')
  const client_id = '432961785509-qqi0ut13397irei6m61up42os7bc59t3.apps.googleusercontent.com'

  useEffect(() => {
    //console.log(validToken)
    if (userToken != null) {
      axios.post('http://localhost:3004/api/login/status', {
        userToken
      }).then((res) => {
        console.log(res.data)
        if(res.data.data.result == "true"){
          if (localStorage.getItem("id") == res.data.data.id) {
            console.log("일치합니다.")
            navigate('/loading')
          }
        }
      }).catch((err) => {
        console.log(err)
      })
    }
    if (kakaoAccessToken != null) {
      axios.post('http://localhost:3004/api/login/kakao/status', {
        kakaoAccessToken
      }).then((res) => {
        console.log(res.data)
        if (localStorage.getItem("id") == res.data.data.id) {
          console.log("일치합니다.")
          navigate('/loading')
        }
      }).catch((err) => {
        console.log(err)
      })
    }
    if (naverAccessToken != null) {
      axios.post("http://localhost:3004/api/login/naver/status", {
        naverAccessToken
      }).then((res) => {
        console.log(res.data)
        if (localStorage.getItem("id") == res.data.data.id) {
          console.log("일치합니다.")
          navigate('/loading')
        }
      }).catch((err) => {
        console.log(err)
      })
    }
  }, [])

  function handlePasswordType(e) {
    setpwType(() => {
      // 만약 현재 pwType.visible이 false 라면
      if (!pwType.visible) {
        return { type: "text", visible: true };

        //현재 pwType.visible이 true 라면
      } else {
        return { type: "password", visible: false };
      }
    });
  };

  function saveUserId(event) {
    setId(event.target.value);
  }

  function saveUserPw(event) {
    setPw(event.target.value);
  }

  function loginForApp() {
    const ciphertext = crypto.AES.encrypt(pw, 'culture').toString();
    var _id = id.replace(/(\s*)/g,'')
    console.log(_id.length)
    axios.post("http://localhost:3004/api/login/", {
      userId: _id,
      userPw: ciphertext,
    }).then((req) => {
      if (req.data.data.result != "false") {
        console.log(req.data)
        navigate('/loading')
        localStorage.setItem("userType", "USER")
        localStorage.setItem("userToken", req.data.data.token)
        localStorage.setItem("id", id)
      }else{
        console.log(req.data.data.msg)
      }
    }).catch((err) => {
      console.log(err)
    })
  }

  const Rest_api_key = 'e6c2fe139670b147caaf750b558a4750'
  const redirect_uri = 'http://localhost:3000/login/kakao'
  const kakaoURL = `https://kauth.kakao.com/oauth/authorize?client_id=${Rest_api_key}&redirect_uri=${redirect_uri}&response_type=code`
  function loginForKakao() {
    window.location.href = kakaoURL
  }


  const naver_client_id = 'o9JmjRrP1GmmANohGaH1'
  const callback_uri = 'http://localhost:3000/login/naver'
  const naverURL = 'https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=' + naver_client_id + '&redirect_uri=' + encodeURI(callback_uri) + '&state=' + Math.random().toString(36).substr(3, 14);

  function loginForNaver() {
    window.location.href = naverURL
  }

  return (
    <React.Fragment>
      {/* wave (배경) */}
      <div className="bg-wave w-full h-full bg-cover flex justify-center items-center">
        <div className="flex justify-center items-center text-center h-screen animated-fade">
          <div>
            {/* Title */}
            <div className="w-3/5 md:w-1/2 m-auto">
              <Logo className="m-auto w-1/2 mb-2 h-full relative" />

              <div className="logo-font text-center text-2xl
                        tracking-[.5em] -mr-3
                        color-[#3F4A67]">
                갈매기
              </div>

              <div className="bg-white px-1
                        border-0 rounded-full
                        logo-font text-center font-bold
                        my-2 mb-5">
                부산광역시 문화·예술 지도
              </div>
            </div>

            <div className="mt-10">
              {/* ID input */}
              <div className="mx-10 my-5">
                <input type="text" name="id" className="mt-1 px-6 py-4 bg-white border shadow-sm border-slate-300 placeholder-slate-400 
                focus:outline-none focus:border-sky-500 focus:ring-sky-500 block w-full rounded-2xl 
                sm:text-sm focus:ring-1 placeholder:text-slate-400 placeholder:text-sm placeholder:font-bold" 
                placeholder="아이디" onChange={saveUserId} />
              </div>

              {/* PW input */}
              <div className="relative mx-10 my-5">
                <input type={pwType.type} name="password" className="mt-1 px-6 py-4 bg-white border shadow-sm border-slate-300 placeholder-slate-400 
                focus:outline-none focus:border-sky-500 focus:ring-sky-500 block w-full rounded-2xl 
                sm:text-sm focus:ring-1 placeholder:text-slate-400 placeholder:text-sm placeholder:font-bold" 
                placeholder="비밀번호" onChange={saveUserPw} />

                <span className="absolute inset-y-0 right-0 my-4 mx-3 flex items-center hover:cursor-pointer" onClick={handlePasswordType}>
                  {pwType.visible ? <Visibility /> : <Visibility_off />}
                </span>
              </div>
              <div className="relative mx-10 my-5">
                  <button className="rounded-2xl border-solid border-0 bg-[#1F83EB] w-full px-5 py-4
                  hover:brightness-90"
                  onClick={loginForApp}>
                  <p className="font-bold text-white text-xl">
                    로그인
                  </p>
                </button>
              </div>

              {/* text */}
              <div className="font-light text-black text-sm">
                <span className="text-slate-800">
                  계정이 없으신가요?&nbsp;&nbsp;
                </span>
                <a href="./signup" className="underline text-[#1F83EB] font-bold underline-offset-2">
                 회원가입
                </a>
              </div>

              {/* social login img */}
              <div className="flex justify-center items-center mt-6">
                <img onClick={loginForKakao} 
                className="w-1/3 mr-4 max-w-xs hover:brightness-90 hover:cursor-pointer" 
                src="images/social_login/kakao_login.png"></img>

                <img onClick={loginForNaver} 
                className="w-1/3 max-w-xs hover:brightness-90 hover:cursor-pointer" 
                src="images/social_login/naver_login.png"></img>
              </div>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default SignIn;