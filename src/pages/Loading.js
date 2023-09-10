import axios from "axios";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { ReactComponent as Logo } from "../img/icon/logo.svg";

const Loading = () => {
    const navigate = useNavigate();

    function delay(){
        const timeout = setTimeout(() => {
            navigate('/map');
        }, 4800);
    }

    function nickname(){
        const timeout = setTimeout(() => {
            navigate('/signup/nickname');
        }, 4800);
    }

    useEffect(() => {

        var userType = localStorage.getItem("userType");
        var userId = localStorage.getItem("id");

        axios.post("http://localhost:3004/api/signup/nickname/status", {
            userType : userType,
            userId : userId
        }).then((req) => {
            if(req.data.data.exist == "true"){
                localStorage.setItem("nickname", req.data.data.nickname)
                delay();
            }else{
                nickname();
            }
        }).catch((err) => {
            // console.log(err)
        })

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
                    <div className="flex flex-col w-2/3 animated-fade">
                        <Logo className="m-auto h-full -mb-1 load_seagull
                        w-1/4 sm:w-1/6" />

                        {/* loading bar */}
                        <div className="relative w-full
                        sm:w-9/12 m-auto h-5
                        border-0 rounded-full bg-white overflow-hidden" aria-hidden="true">
                            {/* loading gauge */}
                            <div className="absolute top-0 left-0 w-1/4 sm:w-1/6 h-5
                            border-x-2 border-slate-500 rounded-full bg-[#1F83EB]
                            animated-load-bar">
                                <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
                                    <defs>
                                        <pattern id="pattern_qJUOn" patternUnits="userSpaceOnUse" width="29" height="29" patternTransform="rotate(39)">
                                            <line x1="0" y="0" x2="0" y2="29" stroke="#FFFFFF" stroke-width="30" />
                                        </pattern>
                                    </defs>
                                    <rect width="100%" height="100%" fill="url(#pattern_qJUOn)" />
                                </svg>
                            </div>
                        </div>
                        <div className="text-center max-md:my-2 md:my-5 mb-6 
                        text-white max-md:text-sm
                        font-light">
                            잠시만 기다려주세요 · · ·
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
};

export default Loading;