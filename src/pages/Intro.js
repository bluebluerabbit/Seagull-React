import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { ReactComponent as Logo } from "../img/icon/logo.svg";

const Intro = () => {
    const navigate = useNavigate();

    useEffect(() => {

        for (var i=0; i<localStorage.length; i++){
            const key = window.localStorage.key(i)
            if (key == "userToken" || key == "kakaoLoginJWT" || key == "naverLoginJWT"){
                const value = window.localStorage.getItem(key)
                // console.log(value)
                axios.post("http://localhost:3004/api/auth/status", {
                    userToken : value,
                }).then((req) => {
                    const response = req.data.msg
                    if (response == "invalid"){
                        // console.log(key)
                        localStorage.removeItem(key)
                    }
                })
            }
        }

        const timeout = setTimeout(() => {
            navigate('/login');
        }, 3500);

        // return () => {
        //     clearTimeout(timeout)
        // }
    })

    return (
        <React.Fragment>
            <div className="relative h-screen flex items-center justify-center drop-shadow-bg">
                {/* wave (배경) */}
                <div className="bg-wave w-full h-full bg-cover flex justify-center items-center">
                    {/* logo (갈매기) */}
                    <div className="w-1/2 animated-fade">
                        <Logo className="m-auto w-2/4
                        sm:w-1/3 h-full mb-2" />
                        <div className="logo-font text-center text-2xl
                        tracking-[.5em] -mr-3
                        color-[#3F4A67]">
                            갈매기
                        </div>
                        <div className="bg-white px-1
                        border-0 rounded-full
                        logo-font text-center font-bold
                        my-2">
                            부산광역시 문화·예술 지도
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
};

export default Intro;