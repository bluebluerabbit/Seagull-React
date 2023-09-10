import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';

import { ReactComponent as Write } from "../../img/icon/write.svg";
import { ReactComponent as Position } from "../../img/icon/position.svg";
import { ReactComponent as Location } from "../../img/icon/location.svg";

import LocationMarker from "../../img/icon/location_select.svg";

import Nav from "../../component/BottomNav";
import SimpleLoading from "../../component/SimpleLoading";

// 스크립트로 kakao map api를 심어서 가져오면, window 전역 객체에 들어가게 된다.
// 함수형 컴포넌트에서는 바로 인식하지 못하므로, kakao 객체를 인지시키고자 상단에 선언해둔다.
const { kakao } = window; // window 내 kakao 객체를 빼와서 사용

/*
  PostMap : id, 주소를 받아 지도 객체를 반환함
  - postId : 해당 post tag의 id (문자열)
  - postLocation : 해당 post의 주소 문자열 (DB에서 추출)
*/
const PostMap = ({ postId, postLocation }) => {
  // 요소가 준비되어 있는지 체크하기 위해 사용되는 useRef hook
  // 함수가 아닌 함수 컴포넌트이므로 hook 사용 가능
  const mapContainer = useRef(null);

  // 요소가 생성된 후에 kakao map api를 사용하도록 함
  useEffect(() => {
    // 요소가 준비되지 않았으면, 아무것도 하지 않음
    if (!mapContainer.current) return;

    kakao.maps.load(async () => {
      const mapOption = {
        center: new kakao.maps.LatLng(33.450701, 126.570667),
        level: 3
      };

      // mapContainer 변수를 지도 컨테이너 엘리먼트에 연결
      const map = new kakao.maps.Map(mapContainer.current, mapOption);
      const geocoder = new kakao.maps.services.Geocoder();

      geocoder.addressSearch(postLocation, function (result, status) {
        if (status === kakao.maps.services.Status.OK) {
          let coords = new kakao.maps.LatLng(result[0].y, result[0].x);

          const markerImage = new kakao.maps.MarkerImage(
            LocationMarker,
            new kakao.maps.Size(40, 40)
          );

          let marker = new kakao.maps.Marker({
            map: map,
            position: coords,
            image: markerImage
          });

          marker.setMap(map);
          map.setCenter(coords);
        }
      });
    });
  }, [postLocation]);

  return (
    <div ref={mapContainer} id={postId} className="w-full h-full relative -z-10"></div>
  );
}

const Post = () => {

  const [lists, setLists] = useState([]);
  const [len, setListLength] = useState();
  const [isCallLists, setIsCallLists] = useState(false);
  const [splitNowPositionString, setSplitNowPositionString] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      await axios.get('http://localhost:3004/api/post/lists')
        .then((res) => {
          try {
            if (res.data.status == "success") {
              let data = JSON.parse(res.data.data)
              for(let i=0;i<data.length;i++){
                if(data[i].location.split(' ')[1]==splitNowPositionString){
                  setLists(data);
                }
              }
              setListLength(res.data.data.length - 1);
              setIsCallLists(true);
            }
          } catch {
            return
          }
        })
    }

    console.log(len);
    fetchData();
    
    splitNowPosition();
  }, []);

  const navigate = useNavigate();

  function write() {
    navigate("./write")
  }

  // 현재 위치를 좌표 값으로 받아와 주소로 변환한 후, '구' 단위를 추출함
  // 저장된 '구' 단위 문자열 : splitNowPositionString
  function splitNowPosition() {
    kakao.maps.load(() => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          let lat = position.coords.latitude, // 위도
            lng = position.coords.longitude; // 경도


          // 주소-좌표 변환 객체 생성
          const geocoder = new kakao.maps.services.Geocoder();

          function searchDetailAddrFromCoords(geocoder, coords, callback) {
            let setCoords = new kakao.maps.LatLng(coords[0], coords[1]);
            geocoder.coord2Address(setCoords.getLng(), setCoords.getLat(), callback);
          }

          searchDetailAddrFromCoords(geocoder, [lat, lng], function (result, status) {
            if (status === kakao.maps.services.Status.OK) {
              // 도로명주소 or 지번주소 반환
              var detailAddr = !!result[0].road_address ?
                result[0].road_address.address_name :
                result[0].address.address_name;

              // ex) 부산광역시 XXX구 XXX로 XX번길 XX -> 공백 단위로 split하여 두번째 요소를 가져옴
              setSplitNowPositionString(detailAddr.split(' ')[1]);
            }
          });
        });
      }
    })
  }

  const tagColorArray = ["bg-[#000AFF]", "bg-[#00C2FF]", "bg-[#E37A39]", "bg-[#FF0000]"];
  const tagTextArray = ["지금당장", "어제갔다왔음", "오늘도하더라", "내일도한다"]

  return (
    <React.Fragment>
      <div className="animated-fade h-full bg-white
      flex flex-col drop-shadow-bg">
        <div className="sticky top-0 bg-white relative z-9999">
          <div className="flex justify-between items-center">
            <span className="text-lg font-medium m-4">
              {splitNowPositionString}
            </span>
            <Position className="drop-shadow-position w-12 m-4" />
          </div>
          <hr className="mx-2" />

          {
            isCallLists ?
              null :
              <SimpleLoading />
          }

        </div>


        {
          lists.map((item, index) => {
            return (
              <div>
                <div key={index} className="flex flex-col w-11/12 m-auto">
                  <div className="flex justify-between my-2">
                    <div>
                      {/* title */}
                      <div className="text-l font-bold mb-1">
                        {item.title}
                      </div>

                      {/* location */}
                      <div className="flex text-xs items-center">
                        <Location className="w-3" />
                        <span className="ml-1">{item.location}</span>
                      </div>

                      {/* date */}
                      <div className="text-xs mt-1" >
                        {item.date}
                      </div>
                    </div>
                    <div className="rounded-full border w-auto text-xs font-light flex justify-start items-center h-6 mt-2 pl-1 pr-3">
                      <div className={tagColorArray[item.tag] + ' w-2.5 h-2.5 m-1 rounded-full'} />
                      {tagTextArray[item.tag]}
                    </div>
                  </div>

                  <div className="flex justify-center items-center w-full h-48 place-center">
                    <PostMap postId={item.title} postLocation={item.location} />
                  </div>

                  <div className="text-sm mt-2">
                    {item.content}
                  </div>
                  <br />
                </div>

                <div className={len == index ? null : 'w-full border-b-2 border-d9d9d9'} />

              </div>
            )
          })
        }

        <div className="h-[60px] sm:h-[120px]"></div>
      </div>

      <div className="flex justify-end items-center">

        <Write className="fixed bottom-0 z-40
          mb-12 sm:mb-20 -mr-3 self-end
          w-[120px] h-[120px]
          sm:w-[150px] sm:h-[150px]
          hover:cursor-pointer hover:scale-110 transition
          active:brightness-75
          active:scale-110"
          onClick={write} />

      </div>

      <Nav />

    </React.Fragment>
  );
};

export default Post;