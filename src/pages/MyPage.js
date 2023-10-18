import React, { useEffect, useState } from "react";
import { ReactComponent as Heart } from "../img/icon/heart_active.svg"
import axios from "axios";
import Nav from "../component/BottomNav";

const MyPage = () => {

    var userId = localStorage.getItem('id');
    var nickName = localStorage.getItem('id');

    // const keep = ["바보의 세계", "검은고양이", "청부살인 협동조합"]
    // const keep = []
    //const keep = ['test', 'test', 'test', 'test', 'test', 'test', 'test', 'test',]
    const [keep, setLists] = useState([]);
    const [isCallLists, setIsCallLists] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            await axios.post('http://localhost:3004/api/user/favorites/list', { userId })
                .then((res) => {
                    try {
                        if (res.data.data.result === "true") {
                            console.log(res.data.data.msg)
                            setLists(res.data.data.msg);
                            setIsCallLists(true);
                        }
                    } catch {
                        return
                    }
                })
        }

        fetchData();
        if(isCallLists){
            console.log(keep.length)
        }
    }, []);

    //console.log("w-full m-auto animated-fade bg-white " + (keep.length > 0) ? "h-full" : "h-screen")

    let keepLength = (keep.length > 0) ? "h-full" : "h-screen";

    return (
        <React.Fragment>
            <div className={"w-full m-auto animated-fade bg-white drop-shadow-bg sm:h-screen max-sm:" + keepLength}>

                <div className="sticky top-0 bg-white">
                    <div className="flex justify-center items-center p-5">
                        <span className="text-lg font-medium">
                            내정보
                        </span>
                    </div>
                    <hr className="mx-2" />
                </div>

                <div className="m-5 my-7 font-bold">
                    <div className="text-xl">
                        안녕하세요,
                    </div>
                    <div className="text-3xl ">
                        {nickName}님!
                    </div>
                </div>

                <hr className="mx-2" />

                <div className="text-lg font-medium m-3 text-center">찜목록</div>
                {
                    keep&&keep.length == 0
                        ?
                        <div>
                            <div className="justify-center items-center rounded-xl w-11/12 bg-slate-100 m-auto mt-4 text-l font-bold py-6">
                                <Heart className="w-6 m-auto mb-3" />
                                <div className="flex justify-center m-auto">
                                    찜한 행사가 없어요.
                                </div>

                                <div className="flex justify-center m-auto">
                                    가고 싶은 행사를 찜목록에 추가해 보세요.
                                </div>
                            </div>
                        </div>
                        :
                        keep.map((item, index) => {
                            return (
                                <div key={index}>
                                    <div className="flex justify-between rounded-xl w-11/12 bg-slate-100 items-center m-auto mt-4">
                                        <div className="text-xl font-bold px-6 my-4">
                                            {item.TITLE}
                                        </div>
                                        <Heart className=" w-6 mr-5" />
                                    </div>
                                </div>
                            )
                        })
                }
                <div className="h-[85px] sm:h-[120px] bg-white"></div>
            </div>
            <Nav />
        </React.Fragment>
    );
};

export default MyPage;