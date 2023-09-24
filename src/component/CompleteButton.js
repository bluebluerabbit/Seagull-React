import React from "react";

// 하단 버튼 컴포넌트
// content : 버튼에 들어갈 문자열
// _class : 추가할 class 요소 (ex: absolute, w-full, ...)
const CompleteButton = ({_event, content, _class}) => {
    return (
        <React.Fragment>
            <div className={"max-w-[600px] flex justify-center align-center m-auto rounded-2xl border-0 py-4 bg-main hover:cursor-pointer transition hover:brightness-75" + _class}
                onClick={_event}>
                <p className="font-bold text-xl text-white">{content}</p>
            </div>
        </React.Fragment>
    );
};

export default CompleteButton;