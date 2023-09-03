import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from 'react-redux';
import axios from "axios";

import '../App.css';

import { ReactComponent as Previous } from "../img/icon/back.svg";
import { ReactComponent as Heart } from "../img/icon/heart.svg";
import { ReactComponent as HeartActive } from "../img/icon/heart_active.svg";
import { ReactComponent as Location } from "../img/icon/location.svg";

// 찜 목록 추가 시, 안내 메시지를 하단에 띄우는 컴포넌트
function HeartStatus({ setIsibleHeartStatus }) {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
        }, 4000);

        return () => {
            clearTimeout(timer);
        };
    }, []);

    if (!isVisible) {
        setIsibleHeartStatus(false);
        return null;
    }

    return (
        <React.Fragment>
            <div className="bg-white w-2/3 text-center rounded-full mt-3 py-1
                shadow-2xl border border-black-200
                flex items-center justify-center
                sticky fixed bottom-5 m-auto
                animated-fade-full">
                <span className="flex justify-center items-center">
                    <HeartActive className="mr-2 w-5" />
                    찜 목록에 추가되었습니다.
                </span>
            </div>
        </React.Fragment>
    );
}

function HashTag({ hashtagStrings }) {
    let hashtag = useSelector((state) => (state.hashtag.hashtagName));
    console.log(hashtag);
    console.log(hashtag)


    return (
        <React.Fragment>
            <ul className="flex items-center justify-start">
                {
                    hashtagStrings.map((item, index) => {
                        return (
                            <li className={`flex items-center justify-center
                            whitespace-no-wrap text-center overflow-auto mt-3 -mb-3 h-full
                            no-underline inline-block bg-white w-auto text-gray-700 font-normal
                            rounded-full px-2 py-1 mr-1
                            active:brightness-75
                            hover:cursor-pointer hover:scale-105 transition 
                            ${hashtag[hashtagStrings[index]].bg}`}
                                key={ item }>
                                #{ item }
                            </li>
                        )
                    })
                }
            </ul>
        </React.Fragment>

    )
}

const Detail = () => {
    let [heart, setHeart] = useState(false);
    let [isVisibleHeartStatus, setIsibleHeartStatus] = useState(false);

    // 해시태그 배열
    let hashtagStrings = ["잔잔한", "가족", "혼자", "겨울"]

    const navigate = useNavigate();
    const location = useLocation();
    let eventInfo = { ...location.state }

    async function addFavorites() {
        setIsibleHeartStatus(true);

        let favoriteData = {
            favoriteObject: {
                userId: localStorage.getItem('id'),
                event: {
                    title: eventInfo.title,
                    location: eventInfo.location,
                    startDate: eventInfo.startDate,
                    endDate: eventInfo.endDate,
                    time: eventInfo.time,
                    price: eventInfo.price,
                    src: eventInfo.src
                }
            }
        }

        await axios.post('http://localhost:3004/api/user/favorite', favoriteData
        ).then((response) => {
            let res = response.data;
            if (res.status === "success") {
                setIsibleHeartStatus(true);
            }
            else if (res.status === "fail") {
                console.log(res.msg);
            }
            else if (res.status === "error") {
                console.log(res.msg);
            }
        })
    }

    return (
        <React.Fragment>
            <div className="animated-fade h-full bg-white drop-shadow-bg">
                {/* Header (pre, head, heart) */}
                <div className="flex justify-between items-center p-5 
                sticky top-0 bg-white">
                    <Previous className="hover:cursor-pointer hover:scale-110 transition"
                        onClick={() => navigate('/map')}
                    />
                    <span className="text-lg font-medium">
                        상세 정보
                    </span>
                    {
                        heart ?
                            <HeartActive className="animated-heart hover:cursor-pointer hover:scale-105 transition"
                                onClick={() => {
                                    setHeart(!heart);
                                }} /> :
                            <Heart className="hover:cursor-pointer hover:scale-110 transition"
                                onClick={() => {
                                    setHeart(!heart);
                                    addFavorites();
                                }} />
                    }
                </div>

                <hr className="m-2 mb-6" />

                {/* content */}
                <div className="flex flex-col m-auto justify-center w-5/6">
                    {/* poster */}
                    <img alt="img"
                        src={eventInfo.src} />


                    <HashTag hashtagStrings={hashtagStrings} />

                    {/* event title */}
                    <div className="text-2xl my-5 font-bold">
                        <span>
                            {eventInfo.title}
                        </span>
                    </div>

                    {/* event place */}
                    <div className="flex items-start">
                        <Location className="m-1"
                        />
                        <span className="ml-1 font-semibold">
                            {eventInfo.location}
                        </span>
                    </div>

                    {/* event content */}
                    <div className="my-2 mt-4">
                        <div className="mb-1 text-stone-700 font-medium">
                            📌 기간
                        </div>
                        <div className="font-bold">
                            {eventInfo.duration}
                        </div>
                    </div>

                    <div className="my-1">
                        <div className="mb-1 text-stone-700 font-medium">
                            📌 시간
                        </div>
                        <div className="font-bold">
                            {eventInfo.time}
                        </div>
                    </div>

                    <div className="my-1 mb-6">
                        <div className="mb-1 text-stone-700 font-medium">
                            📌 가격
                        </div>
                        <div className="font-bold">
                            {eventInfo.price}
                        </div>
                    </div>
                </div>

                {/* Heart Status */}
                {
                    isVisibleHeartStatus ?
                        <HeartStatus
                            setIsibleHeartStatus={setIsibleHeartStatus} /> :
                        null
                }

            </div>
        </React.Fragment>
    );
};

export default Detail;