import { ReactComponent as Logo } from "../img/icon/logo.svg";

const SimpleLoading = () => {
    return (
        <div className="flex flex-col items-center justify-center h-screen 
        relative fixed top-0 bg-transparent w-full -mt-24">
            <Logo className="w-16 h-16 flex" />
            <div className="flex mt-5">
                <span className="animated-load-circle delay-0   w-3 h-3 border border-0 rounded-full bg-main "></span>
                <span className="animated-load-circle delay-100 w-3 h-3 mx-2 border border-0 rounded-full bg-main"></span>
                <span className="animated-load-circle delay-500 w-3 h-3 border border-0 rounded-full bg-main"></span>
            </div>
        </div>
    )
}

export default SimpleLoading;