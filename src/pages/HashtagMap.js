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
import { ReactComponent as Previous } from "../img/icon/back.svg";

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
    await getEventInfoRequest('http://localhost:3004/api/event' + url, setter);
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
                            duration: data[i].startDate + ' ~ ' + data[i].endDate,
                            time: data[i].time,
                            price: data[i].price,
                            src: data[i].src
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

const HashtagMap = () => {
    const navigate = useNavigate();
    const location = useLocation();
    let hashtagInfo = { ...location.state }

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

    const callPanToMyPosition = () => { panToMyPosition(map) }

    return (
        <React.Fragment>
            {/* category */}
            <div className="flex justify-center items-center">
                <div className="bg-white h-[80px] w-screen border-b flex justify-between items-center p-5 
                sticky top-0 bg-white">
                    <Previous className="hover:cursor-pointer hover:scale-110 transition"
                        onClick={() => navigate('/map')}
                    />
                    <div>
                        <div className="text-lg font-medium">
                            관련 행사
                        </div>
                        <div className={`flex items-center justify-center
                            whitespace-no-wrap text-center overflow-auto h-full 
                            no-underline inline-block w-auto text-gray-700 font-normal
                            rounded-full px-1 py-1 mt-1
                            active:brightness-75
                            hover:cursor-pointer hover:scale-105 transition
                            ${hashtagInfo.hashtagBackgroundColor} ${hashtagInfo.hashtagTextColor}`}>
                            #{ hashtagInfo.hashtagName }
                        </div>
                    </div>
                    <div></div>
                </div>
            </div>

            {/* map */}
            <div id="map" className="max-w-[640px] animated-fade w-screen h-screen drop-shadow-bg"></div>

            {/* my position */}
            <div className="flex justify-end items-center">
                <Position onClick={() => callPanToMyPosition()}
                    className="fixed z-40 bottom-0 m-5 
                w-[50px] h-[50px]
                mb-5
                drop-shadow-position
                hover:cursor-pointer hover:scale-110 transition
                active:brightness-75
                active:scale-110"/>
            </div>
        </React.Fragment>
    );
};

export default HashtagMap;