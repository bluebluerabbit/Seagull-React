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
        axios.post('ec2-44-201-170-157.compute-1.amazonaws.com:3004/api/login/kakao',{
            code : loginCode
        })
        .then((req) => {
            console.log(req.data.data.token);
            if (req.data.data.result == "true"){
                console.log("여기 들어왔어?");
                localStorage.setItem("kakaoLoginJWT", req.data.data.token)
                localStorage.setItem("id", req.data.data.kakaoId)
                localStorage.setItem("userType", "KAKAO")
                navigate('/loading')
            }else{
                navigate('/login')
                console.log("로그인 실패")
            }
        })
        .catch(err => console.log(err))
    }
};

export default LoginForKakao;