import { useLocation, useOutlet } from "react-router-dom";
//bootstrap css 로딩하기 
import 'bootstrap/dist/css/bootstrap.css'
import BsNavBar from "./components/BsNavBar";
import LoginModal from "./components/LoginModal";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { AnimatePresence, motion } from "framer-motion";
// "/api" 라는 요청경로가 붙어있는 axios 객체이다.
import api from "./api";

function App(){

    const currentOutlet=useOutlet();
    //로그인 모달의 상태값을 redux store 로 부터 얻어낸다.
    const loginModal= useSelector(state=>state.loginModal);
    const dispatch = useDispatch();

    //App component 가 활성화 되는 시점에 token 관련 처리
    useEffect(()=>{
        const token=localStorage.token;
        //만일 토큰이 존재한다면
        if(token){
            api.get("/ping", {
                headers:{Authorization:token}
            })
            .then(()=>{
                //여기가 실행되면 사용가능한 token 이라는 의미이다 
                //토큰을 디코딩해서 userName 을 얻어온다. 
                const decoded=jwtDecode(token.substring(7));
                const exp = decoded.exp * 1000; // 초 → 밀리초
                const now = Date.now();
                //토큰의 남은 유효시간 얻어내기
                const remainingTime = exp - now;
                //자동 로그아웃 예약
                const logoutTimer=setTimeout(()=>{
                    doLogout();
                }, remainingTime);
                
                //로그아웃 타이머를 store 에 등록
                dispatch({
                    type:"LOGOUT_TIMER",
                    payload:logoutTimer
                });
                
                //발행할 action
                const action={type:"USER_INFO", payload:{
                    userName:decoded.sub,
                    role:decoded.role
                }};
                //액션 발행하기
                dispatch(action);
            })
            .catch(()=>{
                delete localStorage.token;
            })
        }
        const doLogout = () => {
            delete localStorage.token;
            dispatch({ type: 'USER_INFO', payload: null });
            alert('토큰이 만료되어 자동 로그아웃 되었습니다.');
        };

        //여기서 리턴한 함수는 이 컴포넌트가 비활성화 되기 직전에 호출된다.(무언가 마무리 작업을 하기 적당함)
        return ()=>{
            //만일 로그아웃 타이머가 있다면 
            if(logoutTimer){
                //타미머를 취소하고 
                clearTimeout(logoutTimer);
                //store 에 저장된 타이머 초기화 하기
                dispatch({
                    type:"LOGOUT_TIMER",
                    payload:null
                })
            }
        };
    }, []);
    //로그아웃 타이머가 있는지 읽어와 본다.
    const logoutTimer = useSelector(state=>state.logoutTimer);
    const location = useLocation();

    return (
        <>
            <BsNavBar/>
            <div className="container" style={{marginTop:"60px"}}>
            <div style={{ position: "relative", overflow: "hidden" }}>
                <AnimatePresence mode="wait">
                    {/* key가 바뀌면 AnimatePresence가 페이지 전환으로 인식 */}
                    <motion.div
                        key={location.pathname} //경로변경감지
                        initial={{ opacity: 0 }}    //초기상태
                        animate={{ opacity: 1 }}    //애니메이셕효과
                        exit={{ opacity: 0 }}   //사라질떄효과과
                        transition={{ duration: 0.2 }} //적용되는시간
                    >
                       <div>{currentOutlet}</div>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* key가 바뀌면 AnimatePresence가 페이지 전환으로 인식 */}
            {/* <div style={{ position: "relative", overflow: "hidden", height: "100vh"  }}>
                <AnimatePresence mode="wait">
                    <motion.div
                        key={location.pathname}
                        initial={{ x: "100%", opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: "-100%", opacity: 0 }}
                        transition={{ duration: 0.4, ease: "easeInOut" }}
                        style={{
                        position: "absolute",
                        width: "100%",
                        height: "100%",
                        }}
                    >
                        <div>{currentOutlet}</div>
                    </motion.div>
                </AnimatePresence>
            </div> */}

            </div>
            <LoginModal show={loginModal.show}/>
        </>
        
    )
}

export default App;