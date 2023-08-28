import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import SelectLocation from "../../component/SelectLocation";
import CompleteButton from "../../component/CompleteButton";
import { ReactComponent as Position } from "../../img/icon/position.svg";
import { ReactComponent as Previous } from "../../img/icon/back.svg";


const Write = () => {
  // 선택된 위치 주소 문자열
  const [location, setLocation] = useState("");
  // 위치 선택 컴포넌트 toggle
  const [selectLocationToggle, setSelectLocationToggle] = useState(false);

  const navigate = useNavigate();

  const [userId, setId] = useState();

  const [tag, setTag] = useState();
  const [date, setDate] = useState();

  const [title, setTitle] = useState();
  const [content, setContent] = useState();

  function getTitle(event) {
    setTitle(event.target.value)
  }

  function getContent(event) {
    setContent(event.target.value)
    getDate()
  }

  function getDate() {
    let now = new Date()
    let year = now.getFullYear()
    let month = now.getMonth()
    let date = now.getDate()
    let hours = now.getHours()
    let minuites = now.getMinutes()
    setDate(year + "-" + month + "-" + date + " " + hours + ":" + minuites)
  }

  async function postWrite() {

    const Writedata = {
      userId: "tmp",
      title: title,
      date: date,
      location: location,
      tag: tag,
      content: content
    }

    await axios.post("http://localhost:3004/api/post/write", {
      Writedata
    })
      .then((response) => {
        console.log("success");
      })
      .catch(() => {
        console.log("fail");
      });

    await navigate(-1)
  }

  const tagColorArray = ["bg-[#000AFF]", "bg-[#00C2FF]", "bg-[#E37A39]", "bg-[#FF0000]"];
  //지금당장 , 어제갔다왔음, 오늘하더라, 내일도한다
  const tagTextArray = ["지금당장", "어제 갔다왔음", "오늘 하더라", "내일도 한대"]

  return (
    <React.Fragment>
      <div className="animated-fade bg-white h-screen drop-shadow-bg">
        {
          selectLocationToggle
            ? <SelectLocation className="fixed left-0 top-0 right-0"
              setLocation={setLocation}
              setSelectLocationToggle={setSelectLocationToggle} />
            : null
        }

        <div className="sticky top-0 bg-white">
          <div className="flex justify-center items-center p-5">
            <Previous className="absolute left-0 ml-5" onClick={() => navigate(-1)} />
            <span className="text-lg font-medium">
              정보 작성
            </span>
          </div>
          <hr className="mx-2" />
        </div>


        <div className="w-11/12 m-auto">

          <div className="my-6">
            <div className="text-l mb-2 font-light">행사제목</div>
            <input className=" bg-white border border-slate-300 rounded-2xl focus:outline-none w-full h-[46px] p-2"
              value={title} onChange={getTitle} />
          </div>

          <div className="my-6">
            <div className="text-l mb-2 font-light">위치</div>
            <div className="flex">
              <div className="bg-white border border-slate-300 rounded-2xl w-full py-2 h-[46px]">
                {location}
              </div>
              <Position className="drop-shadow-position w-12 ml-2 mt-0.5"
                onClick={() => setSelectLocationToggle(!selectLocationToggle)} />
            </div>
          </div>

          <div className="flex flex-wrap -mt-4">
            {
              tagTextArray.map((tag, idx) => {
                return (
                  <button className="flex justify-start rounded-full font-light border w-auto m-2 p-0.5 focus:bg-slate-200"
                    onClick={() => setTag(idx)}>
                    <div className={tagColorArray[idx] + " w-2.5 h-2.5 my-auto mr-1 ml-2 rounded-full"} />
                    <span className="text-sm mr-2">
                      {tag}
                    </span>
                  </button>
                )
              })
            }
          </div>

          <div className="my-3">
            <div className="text-l mb-2 font-light">내용</div>
            <textarea className=" bg-white border border-slate-300 h-32 w-full rounded-2xl focus:outline-none"
              onChange={getContent} />
          </div>

          <CompleteButton content="작성 완료" _event={postWrite} />

        </div>
      </div>
    </React.Fragment>
  );
};

export default Write;