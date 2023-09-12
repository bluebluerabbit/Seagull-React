import React, {useEffect} from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";

const LoginForNaver = () => {

    const navigate = useNavigate()

    const loginCode = new URL(window.location.href).searchParams.get('code')
    const stateCode = new URL(window.location.href).searchParams.get('state')
    
    useEffect(() => {
        if (loginCode){
            do_Login()
        }
    },[])

    const do_Login = () => {
        axios.post("http://localhost:3004/api/login/naver",{
            code : loginCode,
            state : stateCode,
        }).then((req) => {
            console.log(req.data.data.token);
            if (req.data.data.result == "true"){
                localStorage.setItem("naverLoginJWT", req.data.data.token)
                localStorage.setItem("id", req.data.data.naverId)
                localStorage.setItem("userType", "NAVER")
                navigate('/loading')
            }else{
                navigate('/login')
                console.log("로그인 실패")
            }
        }).catch((err) => {
            console.log(err)
        })
    }
}

export default LoginForNaver;