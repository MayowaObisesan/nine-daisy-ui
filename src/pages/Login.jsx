import { memo, useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Footer from "./Footer";
import { StyleProcessor } from "../helpers/StyleProcessor";
import { useDeviceSize } from '../hooks/useDeviceSize';
import { deviceWidthEnum } from '../helpers/utils';
import { NotifError, NotifSuccess, TextInput } from '../components/Elements';
import { FormField, LabelField } from '../components/Forms';



const LoginForm = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loginResponseData, setLoginResponseData] = useState({});
    const navigate = useNavigate();
    const inputEmailField = useRef(null);
    const inputPasswordField = useRef(null);
    const [isSubmit, setIsSubmit] = useState(false);
    let [isInputEmailFocused, setInputEmailFocused] = useState(false);
    let [isInputPasswordFocused, setInputPasswordFocused] = useState(false);

    useEffect(
        () => {
        }, []
    );

    const toggleShowPassword = (e) => {
        inputPasswordField.current.getAttribute("type") === "password"
            ? inputPasswordField.current.setAttribute("type", "text")
            : inputPasswordField.current.setAttribute("type", "password")
        new StyleProcessor(e.target).toggleClass('fa-eye').toggleClass('fa-eye-slash')
    }

    const showLoadingState = (e) => {
        setIsSubmit(true);
    };

    const handleLogin = (event) => {
        const loginURL = `${process.env.REACT_APP_BASE_URL}/token/`;
        // const loginURL = "https://blessedmayowa.pythonanywhere.com/login/";
        const headers = {
            'Accept': '*/*',
            // 'Origin': '*',
        };
        const fetchInit = {
            method: 'POST',
            headers: headers,
            mode: 'cors',
            body: new FormData(event.target),
            cache: 'default',
        };
        event.preventDefault();

        fetch(loginURL, fetchInit)
            .then(response => {
                if (response.status !== 200) {
                    throw response;
                }
                return response.json();
            })
            .then((data) => {
                console.log(data);
                // Store the token from the login response
                localStorage.setItem('nine_login', data['access']);
                localStorage.setItem('nine_refresh', data['refresh']);

                // reset the login form
                event.target.reset();
                setEmail('');
                setPassword('');
                setLoginResponseData({
                    message: "Login successful",
                    successful: true,
                    error: false
                });
                setTimeout(() => {
                    navigate('/');
                }, 800);
            })
            .catch((error) => {
                let error_message;
                if (error.status === 401) {
                    error_message = "Invalid login credentials"
                } else if (error.status === 400) {
                    error_message = "Login credentials are not valid"
                } else if (error.status === 500) {
                    error_message = "Check your internet connection"
                } else {
                    // There is no network connection or the Server is not up.
                    error_message = "Oops. Network Error"
                }
                setLoginResponseData({
                    message: error_message,
                    successful: false,
                    error: true
                });
                // reset the isSubmit loader
                setIsSubmit(false);
            });
    }

    return (
        <>
            <form
                id="id-login-form"
                onSubmit={handleLogin}
                className="card relative flex flex-col gap-5 space-y-5 mx-auto px-1 w-[96%] md:w-[480px] md:shadow-md lg:shadow:0-2px-12px-0-E8E8E8 lg:shadow-none md:px-8 md:py-8"
            >
                {
                    loginResponseData?.successful
                        ? <NotifSuccess>{loginResponseData.message}</NotifSuccess>
                        : null
                }
                {
                    loginResponseData?.error
                        ? <NotifError message={loginResponseData.message} />
                        : null
                }
                <div className={"flex flex-col"}>
                    <FormField classes={"font-semibold"}>
                        <LabelField classes={"flex flex-col items-start"}>
                            Email
                            <TextInput
                                type="email"
                                name="email"
                                value={email || ""}
                                placeholder="Your email address"
                                onChange={(e) => setEmail(e.target.value)}
                                onFocus={(e) => setInputEmailFocused(true)}
                                onBlur={(e) => setInputEmailFocused(false)}
                            // ref={inputEmailField}
                            />
                        </LabelField>
                    </FormField>
                    <FormField classes={"font-semibold"}>
                        <LabelField classes={"flex flex-col items-start"}>
                            Password
                            <TextInput
                                type="password"
                                name="password"
                                value={password || ""}
                                placeholder="Your password"
                                onChange={(e) => setPassword(e.target.value)}
                                onFocus={(e) => setInputPasswordFocused(true)}
                                onBlur={(e) => setInputPasswordFocused(false)}
                            // ref={inputPasswordField}
                            />
                        </LabelField>
                        <div>
                            <Link to={"/forgot-password"} className={"px-1 text-error text-sm"}>Forgot password?</Link>
                        </div>
                    </FormField>
                    {/* <div className={""}>
                        <label className="flex flex-col gap-2 my-1 py-2 font-semibold lg:w-400 lg:px-4 lg:py-4">
                            Email
                            <input
                                type="email"
                                name="email"
                                value={email || ""}
                                placeholder="Your email address"
                                onChange={(e) => setEmail(e.target.value)}
                                onFocus={(e) => setInputEmailFocused(true)}
                                onBlur={(e) => setInputEmailFocused(false)}
                                ref={inputEmailField}
                                className="input input-bordered w-full h-16 focus:input-primary focus:outline-0 focus:border-1"
                            />
                        </label>
                    </div>
                    <div className={""}>
                        <label className="flex flex-col gap-2 my-1 py-2 font-semibold lg:w-400 lg:px-4 lg:py-4">
                            Password
                            <div className={"relative flex flex-row align-items-center"}>
                                <input
                                    type="password"
                                    name="password"
                                    value={password || ""}
                                    placeholder="Your password"
                                    onChange={(e) => setPassword(e.target.value)}
                                    onFocus={(e) => setInputPasswordFocused(true)}
                                    onBlur={(e) => setInputPasswordFocused(false)}
                                    ref={inputPasswordField}
                                    className="input input-bordered w-full h-16 focus:input-primary focus:outline-0 focus:border-1"
                                />
                                {password.length > 0 ? <span className={"fa fa-eye abs px:right-4 square-7 lh-7 radius text-center cursor-pointer dark:bg-base-200/80"} onClick={toggleShowPassword}></span> : null}
                            </div>
                            <Link to={"/forgot-password"} className={"px-1 text-error text-sm"}>Forgot password?</Link>
                        </label>
                    </div> */}
                </div>
                <div className={"form-control"}>
                    <button
                        type="submit"
                        className="font-medium btn btn-primary disabled:bg-base-100 disabled:cursor-not-allowed"
                        disabled={!(email && password.length >= 8)}
                        onClick={e => showLoadingState(e)}
                    >
                        {isSubmit ? <span className='fa fa-spinner fa-spin'></span> : "Submit"}
                    </button>
                </div>
            </form>
            <div className={"md:hidden divider w-11/12 mx-auto"}></div>
            <div
                className={"pct:w-96 mg-x-auto text-center lg:w-400"}>
                Don't have an account? <Link to={"/signup"} className={"font-bold pad-y2 pad-x1 color-initial dark:color-whitesmoke"}>Signup</Link>
            </div>
        </>
    )
}


const Login = () => {
    return (
        <section className={"h-screen bg-base-300"}>
            <div className="bg-base-300 relative flex flex-col gap-4 h-full mx-auto py-8 md:justify-center md:items-center dark:bg-111314 md:w-[560px] lg:w-[480px]">
                <div className={"self-start md:self-center mb-8 md:mb-4"}>
                    <Link to={"/"} className="block text-left md:text-center lg:text-center text-xl md:text-2xl font-medium md:font-medium px-4">Nine</Link>
                    <div className="relative text-3xl md:text-4xl font-black pl-4 md:p-0 decoration-none color-initial md:text-center lg:text-center">Login</div>
                </div>
                {/*<div className="text-center font-28 font-medium lh-normal">Nine</div>*/}
                <LoginForm />
                {/* <Footer miniDetails={true} /> */}
            </div>
        </section>
    );
};

export default memo(Login);