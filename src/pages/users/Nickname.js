import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { ReactComponent as Logo } from "../../img/icon/logo.svg";
import CompleteButton from "../../component/CompleteButton";

const RegisterNickname = () => {

    const navigate = useNavigate();

    const [nickname, setNickname] = useState('')
    const [inputCount, setInputCount] = useState(0)

    function changeNicknameHandler(event) {
        setNickname(event.target.value)
        setInputCount(event.target.value.length)
    }

    function registerNicknameButton() {
        if(inputCount >= 2 && inputCount <= 8){
            var userType = localStorage.getItem("userType")
            var userId = localStorage.getItem("id")

            console.log(userId)

            axios.post(`${process.env.REACT_APP_BACK_API_URL}/api/signup/nickname/`, {
                userType: userType,
                userId: userId,
                nickname: nickname
            }).then((req) => {
                localStorage.setItem("nickname", req.data.data)
                navigate('/loading')
            }).catch((err) => {
                // console.log(err)
            })
        }
    }

    return (
        <React.Fragment>
            <div className="flex flex-col justify-center items-center
             px-4
            bg-white h-screen">
                <Logo className="mt-[30vh] w-20 h-20" />
                <div className="text-center color-[#4B4B4B] font-light text-lg my-3">
                    사용할 닉네임을 <br />
                    입력해주세요.
                </div>
                <input className="border border-[#D9D9D9] rounded-2xl
                p-3 px-5"
                    onChange={changeNicknameHandler} minLength="2" maxLength="8"></input>
                <div className="text-center color-[#4B4B4B] font-light text-sm my-3">
                    (최소 2자, 최대 8자)
                </div>
                    
                <CompleteButton content="완료"
                    _class="absolute bottom-0 mb-3 w-11/12"
                    _event={registerNicknameButton} />
            </div>
        </React.Fragment>
    )
}

export default RegisterNickname;