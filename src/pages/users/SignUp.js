import axios from "axios";
import React, {useCallback, useEffect, useState} from "react";
import crypto from 'crypto-js';

import CompleteButton from "../../component/CompleteButton";
import { useNavigate } from "react-router-dom";

const Login = () => {

    const navigate = useNavigate()

    const [id, setId] = useState('')
    const [saveId, setSaveId] = useState('')
    const [password, setPassword] = useState('')
    const [passwordConfirm, setPasswordConfirm] = useState('')
    const [idValidCheck, setIdValidCheck] = useState(false)
    const [passwordMatch, setPasswordMatch] = useState(false)
    const [idButtonHandler, setIdButtonHandler] = useState('')

    const [finish, setFinish] = useState('false')

    const blankCheck = passwordConfirm == ''

    // const finish = idValidCheck == passwordMatch;

    useEffect(() => {
        
        setFinish(false)

        if (password == passwordConfirm){
            setPasswordMatch(true);
            console.log(password)
            console.log(passwordConfirm)
            console.log(passwordMatch)
        }else{
            setPasswordMatch(false);
            console.log(password)
            console.log(passwordConfirm)
            console.log(passwordMatch)
            setFinish(false)
        }

        if (id == ''){
            setIdButtonHandler('아이디 중복 확인을 눌러주세요')
        }
        if(password == '' && idValidCheck == false){
            setFinish(false)
        }else if(idValidCheck == true && passwordMatch == true && password != ''){
            setFinish(true)
        }else if(password == '' && idValidCheck == true || passwordConfirm == ''){
            setFinish(false)
        }
    })

    function saveUserId(event){
        setId(event.target.value)
        if(saveId != event.target.value){
            setIdValidCheck(false)
            setIdButtonHandler('아이디 중복 확인을 눌러주세요')
            console.log(idValidCheck)
        }
    }

    function saveUserPw(event){
        setPassword(event.target.value)
    }

    function saveUserConfirmPw(event){
        setPasswordConfirm(event.target.value)
    }

    function checkValidId(){
        console.log(id)
        console.log(saveId)
        axios.post('ec2-44-201-170-157.compute-1.amazonaws.com:3004/api/signup/check/id/valid',{
            userId : id,
        }).then((req) => {
            if (req.data.status == 'success'){
                setIdValidCheck(true)
                if (id != ''){
                    setIdButtonHandler('사용할 수 있는 아이디 입니다.')
                    setSaveId(id)
                }else{
                    setIdButtonHandler('아이디 중복 확인을 눌러주세요')
                }
            }else{
                setIdValidCheck(false)
                if (id != ''){
                    setIdButtonHandler('사용할 수 없는 아이디 입니다.')
                }else{
                    setIdButtonHandler('아이디 중복 확인을 눌러주세요')
                }
            }
        }).catch((err) => {
            console.log(err)
        })
    }

    function complete(){
        if(passwordMatch){
            const ciphertextPw = crypto.AES.encrypt(password, 'culture').toString();
            axios.post("ec2-44-201-170-157.compute-1.amazonaws.com:3004/api/signup",{
                userId : id,
                userPw : ciphertextPw,
            }).then((req) => {
                if(req.data.status == "success"){
                    navigate('/login')
                }else{
                    //msg를 다루는 부분
                }
            }).catch((err) => {
                console.log(err)
            })
        }
    }

    return (
        <div className="px-6 py-24 bg-white h-screen">
            <div className="flex flex-col">
                <div className="font-bold text-4xl">회원가입</div>
                <div className="mt-5">
                    <label className="block">
                        <span className="block text-m font-medium text-slate-700 mb-2">
                            아이디
                        </span>
                        <div className="flex flex-row">
                            <input type="text" name="id" className="basis-3/4 px-3 py-3 bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block w-full rounded-2xl sm:text-sm focus:ring-1" 
                                onChange={saveUserId}
                            />
                            <div className="basis-1/4 ml-5">
                                <button className=" rounded-2xl h-full border-0 bg-main w-full"
                                    onClick={checkValidId}
                                >
                                    <p className="text-white text-sm font-bold">
                                        확인
                                    </p>
                                </button>
                            </div>
                        </div>
                    </label>
                </div>
                <div className="mt-1">
                    <p className="font-light text-sm font-bold text-green-600">{idButtonHandler}</p>
                </div>
                <div className="my-4">
                    <label className="block">
                        <span className="block text-m font-medium text-slate-700 mb-2">
                            비밀번호
                        </span>
                        <input type="password" name="password" className="mt-1 px-3 py-3 bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block w-full rounded-2xl sm:text-sm focus:ring-1" 
                            onChange={saveUserPw}
                        />
                    </label>
                </div>
                <div className="col-span-4">
                    <label className="block">
                        <span className="block text-m font-medium text-slate-700 mb-2">
                            비밀번호 확인
                        </span>
                        <input type="password" name="password" className="mt-1 px-3 py-3 pr-1 bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block w-full rounded-2xl sm:text-sm focus:ring-1" 
                            onChange={saveUserConfirmPw}
                        />
                    </label>
                </div>
                {
                    blankCheck 
                    ? 
                    <div className="mt-1" />
                    : 
                    <div className="mt-1">
                        {passwordMatch ? <p className="font-light text-sm font-bold text-green-600">
                            비밀번호가 일치합니다.
                        </p> : 
                        <p className="font-light text-sm font-bold text-rose-600">
                            비밀번호를 다시 확인해 주세요.
                        </p>}
                    </div>
                }
                <div className="mt-10">
                    {
                        finish
                            ?
                            <CompleteButton content="가입 완료"
                                _event={complete} />
                            :
                            <CompleteButton content="가입 완료"
                                _class="brightness-75" />
                    }
                </div>
            </div>
        </div>
    );
};

export default Login;