import React from "react";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import Nav from "../component/BottomNav";

import MarkerMusical from "../img/icon/marker_musical_red.svg";
import MarkerPlay from "../img/icon/marker_play_blue.svg";
import MarkerExhibition from "../img/icon/marker_exhibition_green.svg";
import MarkerConcert from "../img/icon/marker_concert_yellow.svg";
import MyPositionMarker from "../img/icon/map_myposition.svg";

import { ReactComponent as Position } from "../img/icon/position.svg";

// 스크립트로 kakao map api를 심어서 가져오면, window 전역 객체에 들어가게 된다.
// 함수형 컴포넌트에서는 바로 인식하지 못하므로, kakao 객체를 인지시키고자 상단에 선언해둔다.
const { kakao } = window; // window 내 kakao 객체를 빼와서 사용

// 카테고리별로 덮어씌울 행사 마커
let markerArray = []

// 행사 목록 요청 API 호출
async function getEventInfoRequest(url, setter) {
    await axios.get(url)
        .then((response) => {
            let res = response.data;
            // 각 행사 데이터를 넣어줌
            if (res.status === "success") {
                let data = res.data;
                console.log(JSON.parse(data));
                setter(JSON.parse(data));
            }
            // console에 서버 오류임을 알림
            else if (res.status === "error") {
                let msg = res.msg;
                console.log(msg);
            }
        })
        .catch(() => {
            console.log("클라이언트 오류 발생");
        });
}

async function getEventInfo(setter, url, setEventStatus) {
    setEventStatus(false);
    await getEventInfoRequest('ec2-44-201-170-157.compute-1.amazonaws.com:3004/api/event' + url, setter);
    setEventStatus(true);
}

function setEventMarker(navigate, map, geocoder, data, markerImage) {
    if (markerArray.length > 0) {
        for (let i = 0; i < markerArray.length; i++) {
            markerArray[i].setMap(null);
        }
    }
    for (let i = 0; i < data.length; i++) {
        geocoder.addressSearch(data[i].location, function (result, status) {
            if (status === kakao.maps.services.Status.OK) {
                let coords = new kakao.maps.LatLng(result[0].y, result[0].x);

                // 검색 결과 좌표를 이용해 마커 그리기
                let marker = new kakao.maps.Marker({
                    map: map,
                    position: coords,
                    image: new kakao.maps.MarkerImage(markerImage, new kakao.maps.Size(55, 55))
                });

                // 지도 중심을 마커로 이동
                // map.setCenter(coords);

                // 마커 클릭이벤트 등록
                kakao.maps.event.addListener(marker, 'click', function () {
                    // 클릭한 마커가 갖고 있는 행사 정보를 함께 보내는 라우팅
                    navigate('/detail', {
                        state: {
                            title: data[i].title,
                            location: data[i].location,
                            startDate: data[i].startDate,
                            endDate: data[i].endDate,
                            time: data[i].time,
                            price: data[i].price,
                            src: data[i].src,
                            theme: data[i].theme
                        }
                    });
                });

                markerArray.push(marker);
            }
        });
    }
}

function panToMyPosition(map) {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            let lat = position.coords.latitude, // 위도
                lng = position.coords.longitude; // 경도

            map.panTo(new kakao.maps.LatLng(lat, lng));
        });
    }
}

const Map = () => {
    const navigate = useNavigate();
    /*
        현재 선택한 카테고리 index
        0 : 뮤지컬
        1 : 연극
        2 : 공연·전시
        3 : 콘서트
    */
    let [selectedCategoryIndex, setselectedCategoryIndex] = useState(0);

    // 행사 목록 불러오기
    let [musicalsData, setMusicalsData] = useState([]);
    let [playsData, setPlaysData] = useState([]);
    let [exhibitionsData, setExhibitionsData] = useState([]);
    let [concertsData, setConcertsData] = useState([]);

    // 행사 목록 불러오기 성공 여부
    let [eventStatus, setEventStatus] = useState(false);

    const categoryArray = ["뮤지컬", "연극", "공연·전시", "콘서트"];
    const categoryURL = ["/musicals", "/plays", "/exhibitions", "/concerts"];
    const categoryColorArray = ["bg-red-500", "bg-blue-600", "bg-green-500", "bg-yellow-400"];
    const categoryFillColorArray = ["fill-red-500", "fill-blue-600", "fill-green-500", "fill-yellow-400"];

    const [map, setMap] = useState(null);
    const [geocoder, setGeocoder] = useState(null);

    // 현재 위치
    let [myLat, setMyLat] = useState(null);
    let [myLng, setMyLng] = useState(null);

    // MAP SETTING Effect
    useEffect(() => {
        // kakao.js가 load됐을 때 메서드 호출
        kakao.maps.load(() => {
            const container = document.getElementById("map");

            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition((position) => {
                    let lat = position.coords.latitude, // 위도
                        lng = position.coords.longitude; // 경도

                    setMyLat(lat);
                    setMyLng(lng);
                });
            }

            const options = {
                center: new kakao.maps.LatLng(myLat, myLng, 16),
                level: 6,
            };

            const map = new kakao.maps.Map(container, options);

                        
            let nowPositionMarker = new kakao.maps.Marker({
                map: map,
                position: new kakao.maps.LatLng(myLat, myLng),
                image: new kakao.maps.MarkerImage(MyPositionMarker, new kakao.maps.Size(55, 55))
            });

            // 주소-좌표 변환 객체 생성
            const geocoder = new kakao.maps.services.Geocoder();

            setMap(map);
            setGeocoder(geocoder);
        });

    }, [myLat, myLng]);

    // 선택한 카테고리 index가 바뀔 때마다 호출되는 Effect
    useEffect(() => {
        let eventAPI = null;
        if (selectedCategoryIndex == 0) {
            eventAPI = async () => {
                await getEventInfo(setMusicalsData,
                    categoryURL[selectedCategoryIndex],
                    setEventStatus);
            }

            eventAPI();
        }

        if (selectedCategoryIndex == 1) {
            eventAPI = async () => {
                await getEventInfo(setPlaysData,
                    categoryURL[selectedCategoryIndex],
                    setEventStatus);
            }

            eventAPI();
        }

        if (selectedCategoryIndex == 2) {
            eventAPI = async () => {
                await getEventInfo(setExhibitionsData,
                    categoryURL[selectedCategoryIndex],
                    setEventStatus);
            }

            eventAPI();
        }

        if (selectedCategoryIndex == 3) {
            eventAPI = async () => {
                await getEventInfo(setConcertsData,
                    categoryURL[selectedCategoryIndex],
                    setEventStatus);
            }

            eventAPI();
        }

    }, [selectedCategoryIndex]);

    // 각 행사 데이터가 바뀔 때마다 호출되는 Effect
    useEffect(() => {
        if (musicalsData.length > 0 &&
            selectedCategoryIndex == 0) {
            setEventMarker(navigate, map, geocoder, musicalsData, MarkerMusical);
        }
        if (playsData.length > 0 &&
            selectedCategoryIndex == 1) {
            setEventMarker(navigate, map, geocoder, playsData, MarkerPlay);
        }
        if (exhibitionsData.length > 0 &&
            selectedCategoryIndex == 2) {
            setEventMarker(navigate, map, geocoder, exhibitionsData, MarkerExhibition);
        }
        if (concertsData.length > 0 &&
            selectedCategoryIndex == 3) {
            setEventMarker(navigate, map, geocoder, concertsData, MarkerConcert);
        }
    }, [musicalsData, playsData, exhibitionsData, concertsData]);


    const category = (categoryName, colorIndex) => {
        return (
            <li onClick={() => {
                setselectedCategoryIndex(colorIndex);
                console.log(selectedCategoryIndex);
            }}
                key={categoryName}
                className={
                    `flex items-center justify-center
                whitespace-no-wrap text-center overflow-auto mt-2 h-full
                border-2
                no-underline inline-block bg-white w-auto text-gray-700 font-normal
                rounded-full px-2 py-1
                active:brightness-75
                hover:cursor-pointer hover:scale-105 transition` + ((colorIndex != 3) ? " mr-2" : "")}>
                {/* category color circle */}
                <div className={categoryColorArray[colorIndex] + ' w-2 h-2 m-1 rounded-full'}></div>

                {/* category name */}
                <div className="pb-[1.5px]">
                    {categoryName}
                </div>
            </li>
        )
    }

    const callPanToMyPosition = () => { panToMyPosition(map) }

    return (
        <React.Fragment>
            {/* category */}
            <div className="flex justify-center items-center">
                <div className="flex flex-col items-center justify-center fixed z-40 top-0">
                    <ul className="flex justify-center items-center">
                        {
                            categoryArray.map((item, index) => {
                                return category(item, index)
                            })
                        }
                    </ul>

                    {
                        eventStatus ?
                            <React.Fragment>
                                <div className="bg-white w-11/12 text-center rounded-full mt-3 py-1
                                drop-shadow-position
                                flex items-center justify-center">
                                    {/* check */}
                                    <span>
                                        ✅ {categoryArray[selectedCategoryIndex]} 목록 불러오기 성공!
                                    </span>
                                </div>
                            </React.Fragment>
                            :
                            <React.Fragment>
                                <div className="bg-white w-11/12 text-center rounded-full mt-3 py-1
                                drop-shadow-position
                                flex items-center justify-center">
                                    {/* check */}
                                    <span role="status">
                                        <svg aria-hidden="true"
                                            class={`inline w-4 h-4 mr-2 text-gray-200 animate-spin dark:text-gray-600 ${categoryFillColorArray[selectedCategoryIndex]}`
                                            }
                                            viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                                            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                                        </svg>
                                        <span class="sr-only">Loading...</span>
                                    </span>

                                    {/* now loading category */}
                                    <span>
                                        {categoryArray[selectedCategoryIndex]} 목록을 불러오는 중입니다...
                                    </span>
                                </div>
                            </React.Fragment>
                    }

                </div>
            </div>

            {/* map */}
            <div id="map" className="max-w-[640px] animated-fade w-screen h-screen drop-shadow-bg"></div>

            {/* my position */}
            <div className="flex justify-end items-center">
                <Position onClick={() => callPanToMyPosition()}
                    className="fixed z-40 bottom-0 m-5 
                w-[50px] h-[50px]
                mb-20 sm:mb-32
                drop-shadow-position
                hover:cursor-pointer hover:scale-110 transition
                active:brightness-75
                active:scale-110"/>
            </div>

            {/* bottom nav bar */}
            <Nav />
        </React.Fragment>
    );
};

export default Map;