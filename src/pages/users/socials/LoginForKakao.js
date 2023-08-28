import React, { useEffect } from "react";
import axios from 'axios'
import { useNavigate } from "react-router-dom";

const LoginForKakao = () => {
    
    const navigate = useNavigate()

    const loginCode = new URL(window.location.href).searchParams.get('code')
    
    useEffect(() => {
        if (loginCode){
            do_Login()
        }
    }, [])

    const do_Login = () => {
        axios.post('http://localhost:3004/api/login/kakao',{
            code : loginCode
        })
        .then((req) => {
            console.log(req.data.token);
            if (req.data.data == "로그인 성공!!"){
                console.log("여기 들어왔어?");
                localStorage.setItem("kakaoLoginJWT", req.data.token)
                localStorage.setItem("id", req.data.kakaoNickname)
                localStorage.setItem("userType", "KAKAO")
                navigate('/loading')
            }else{
                navigate('/signin')
                console.log("로그인 실패")
            }
        })
        .catch(err => console.log(err))
    }
};

export default LoginForKakao;