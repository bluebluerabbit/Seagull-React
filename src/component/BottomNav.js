import React, { useEffect, useState } from "react";
import { useNavigate, useLocation  } from "react-router-dom";

import { ReactComponent as Board } from "../img/icon/board.svg";
import { ReactComponent as BoardActive } from "../img/icon/board_active.svg";
import { ReactComponent as Home } from "../img/icon/map.svg";
import { ReactComponent as HomeActive } from "../img/icon/map_active.svg";
import { ReactComponent as MyPage } from "../img/icon/mypage.svg";
import { ReactComponent as MyPageActive } from "../img/icon/mypage_active.svg";

const Nav = () => {
    // hook
    const navigate = useNavigate();
    const location = useLocation();

    // state
    let [buttonColor, setButtonColor] = useState([false, false, false]);

    // variable
    let pageName = ['/post', '/map', '/mypage']

    // function
    const ChangeButtonColor = pageNum => {
        // 배열 변경
        let buttonColorCopy = buttonColor;
        buttonColorCopy.map((item) => item = false);
        buttonColorCopy[pageNum] = true;
        setButtonColor(buttonColorCopy);

        // 페이지 전환
        navigate(pageName[pageNum]);
    }

    useEffect(() => {
        // 아이콘 색상 변경
        pageName.map((item, index) => {
            if(location.pathname === item) {
                ChangeButtonColor(index);
            }
            return 0;
        });
    }, []);

    return (
        <React.Fragment>
            <div className="bg-white h-[60px] w-screen
            z-50 fixed bottom-0 
            sm:left-1/2 sm:-translate-x-1/2 sm:rounded-full sm:mb-7 sm:h-[70px]
            flex items-center justify-between
            max-w-[640px] sm:w-[400px] shadow-nav sm:shadow-nav-sm">

                    <div className="ml-8 sm:ml-12
                    hover:cursor-pointer hover:scale-110 transition"
                        onClick={ () => ChangeButtonColor(0) }>
                        { !buttonColor[0] ? 
                        <Board /> : 
                        <BoardActive className="animated-scale"/> }
                    </div>

                    <div className="m-8
                    hover:cursor-pointer hover:scale-110 transition"
                        onClick={ () => ChangeButtonColor(1) }>
                        { !buttonColor[1] ? 
                        <Home /> : 
                        <HomeActive className="animated-scale"/> }
                    </div>

                    <div className="mr-8 sm:mr-12
                    hover:cursor-pointer hover:scale-110 transition"
                        onClick={ () => ChangeButtonColor(2) }>
                        { !buttonColor[2] ? 
                        <MyPage /> : 
                        <MyPageActive className="animated-scale"/> }
                    </div>

            </div>
        </React.Fragment>
    );
};

export default Nav;