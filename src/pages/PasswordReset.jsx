import React, { memo, useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { NotifError, NotifSuccess } from "../components/Elements";


const PasswordResetForm = () => {
    const [email, setEmail] = useState("");
    const [passwordResetResponseData, setPasswordResetResponseData] = useState({});
    const navigate = useNavigate();
    const inputEmailField = useRef(null);
    const [isSubmit, setIsSubmit] = useState(false);

    const showLoadingState = (e) => {
        setIsSubmit(true);
    };

    const handlePasswordReset = (event) => {
        const passwordResetURL = `${process.env.REACT_APP_BASE_URL}/user/forgot-password/`;
        // const passwordResetURL = "https://blessedmayowa.pythonanywhere.com/login/";
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

        fetch(passwordResetURL, fetchInit)
            .then(response => {
                if (response.status !== 200) {
                    throw response;
                }
                return response.json();
            })
            .then((data) => {
                // reset the password reset form
                event.target.reset();
                setEmail('');
                setIsSubmit(false);
                setPasswordResetResponseData({
                    message: "PasswordReset successful",
                    successful: true,
                    error: false
                });
                setTimeout(() => {
                    navigate('/verify-password-reset');
                }, 800);
            })
            .catch((error) => {
                let error_message;
                if (error.status === 401) {
                    error_message = "Invalid login credentials"
                } else if (error.status === 400) {
                    error_message = "PasswordReset credentials are not valid"
                } else if (error.status === 500) {
                    error_message = "Check your internet connection"
                } else {
                    // There is no network connection or the Server is not up.
                    error_message = "Oops. Network Error"
                }
                setPasswordResetResponseData({
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
            <form id="id-login-form" onSubmit={handlePasswordReset}
                className="relative flex flex-column mg-x-auto pad-x1 pad-t2 pct:w-96 radius every:flex|flex-column|mg-y1|pad-y2|font-semibold lg:w-400|shadow:0-2px-12px-0-E8E8E8|pad-x4|pad-t4|pad-b4">
                {
                    passwordResetResponseData?.successful
                        ? <NotifSuccess message={passwordResetResponseData.message} />
                        : null
                }
                {
                    passwordResetResponseData?.error
                        ? <NotifError message={passwordResetResponseData.message} />
                        : null
                }
                <label className="">
                    Email
                    <input
                        type="email"
                        name="email"
                        value={email || ""}
                        placeholder="Your email address"
                        onChange={(e) => setEmail(e.target.value)}
                        ref={inputEmailField}
                        className="pct:w-100 h-8 lh-8 pad-x2 mg-y1 outline:1px_solid_transparent border:1px_solid_lightgray outline-offset-2 focus:outline:2px_solid_gray transition:outline_80ms_ease radius-sm font-12 placeholder:font-regular dark:bg-222425|border:1px_solid_000304|color-whitesmoke dark:focus:outline:3px_solid_444445|bg-333435"
                    />
                </label>
                <div>
                    <button
                        type="submit"
                        className="d-block pct:w-64 h-7 lh-7 mg-x-auto text-center radius bg-green border-0 color-FFF font-14 font-medium cursor-pointer disabled:bg-green-inverse|cursor-not-allowed"
                        disabled={!email}
                        onClick={(e) => showLoadingState(e)}
                    >{isSubmit ? <span className='fa fa-spinner fa-spin'></span> : "Submit"}
                    </button>
                </div>
            </form>
            <div className={"d-block pct:w-72 mg-x-auto mg-y4 border:0px_solid_BBB em:border-t-0.05 lg:w-320|mg-y8|border-DDD dark:border:0px_solid_444445 dark:em:border-t-0.05"}></div>
            <div
                className={"pct:w-96 mg-x-auto text-center lg:w-400"}>
                Don't have an account? <Link to={"/signup"} className={"font-bold pad-y2 pad-x1 color-initial dark:color-whitesmoke"}>Signup</Link>
            </div>
        </>
    )
}


const PasswordReset = () => {
    return (
        <div className="relative flex flex-column pct:h-100 pad-y2 lg:justify-center|align-items-center|pad-y4 dark:bg-111314|color-whitesmoke">
            <Link to={"/"} className="relative text-left font-28 font-black lh-normal mg-b2 pad-l2 decoration-none color-initial lg:mg-b6|text-center dark:color-whitesmoke">
                Nine
                {/*<div className={"text-left mg-b4 lh-100 font-14 font-regular"}>All Naija Apps in one place</div>*/}
            </Link>
            <div className="text-left mg-b4 pad-l2 font-16 font-semibold lh-normal lg:mg-b0|pad-x-auto|font-15|font-medium">Reset your password</div>
            {/*<div className="text-center font-28 font-medium lh-normal">Nine</div>*/}
            <PasswordResetForm />
        </div>
    );
};

export default memo(PasswordReset);