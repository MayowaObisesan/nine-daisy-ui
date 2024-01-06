import React, { memo, useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { NotifError, NotifSuccess } from "../components/Elements";


const ChangePasswordForm = ({ id }) => {
    // const {id} = useParams();
    const [email, setEmail] = useState("");
    const [code, setCode] = useState("");
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [changePasswordResponseData, setChangePasswordResponseData] = useState({});
    const navigate = useNavigate();
    const inputEmailField = useRef(null);
    const inputCodeField = useRef(null);
    const inputCurrentPasswordField = useRef(null);
    const inputNewPasswordField = useRef(null);
    const [isSubmit, setIsSubmit] = useState(false);
    const [formValid, setFormValid] = useState(false);

    const showLoadingState = (e) => {
        setIsSubmit(true);
    };

    const handleCurrentPassword = (value) => {
        // Handle password validation here.
        if (value) {
            setCurrentPassword(value);
        }
    }

    const handleNewPassword = (value) => {
        // Handle current and new password check here.
        if (value !== currentPassword) {
            setChangePasswordResponseData({
                message: "Passwords do not match",
                successful: false,
                error: true
            });
        } else if (value.length < 8) {
            setChangePasswordResponseData({
                message: "Passwords must contain 8 or more characters",
                successful: false,
                error: true
            });
        } else {
            setChangePasswordResponseData({})
            setNewPassword(value);
            setFormValid(true);
        }
    }

    const handleChangePassword = (event) => {
        const verifyUserURL = `${process.env.REACT_APP_BASE_URL}/user/${id}/change-password/`;
        const headers = {
            'Accept': '*/*',
            // 'Origin': '*',
            'Authorization': `Bearer ${window.localStorage.getItem('nine-login')}`
        };
        const fetchInit = {
            method: 'POST',
            headers: headers,
            mode: 'cors',
            body: new FormData(event.target),
            cache: 'default',
        };
        event.preventDefault();

        fetch(verifyUserURL, fetchInit)
            .then(response => {
                if (response.status !== 200) {
                    throw response;
                }
                return response.json();
            })
            .then((data) => {
                // reset the password reset form
                event.target.reset();
                setCurrentPassword('');
                setNewPassword('');
                setIsSubmit(false);
                setChangePasswordResponseData({
                    message: "We have completed your request. Your Password has been successfully changed",
                    successful: true,
                    error: false
                });
                setTimeout(() => {
                    navigate('/change-password-successful');
                }, 800);
            })
            .catch((error) => {
                let error_message;
                if (error.status === 401) {
                    error_message = "Invalid login credentials"
                } else if (error.status === 400) {
                    error_message = "ChangePassword credentials are not valid"
                } else if (error.status === 500) {
                    error_message = "Check your internet connection"
                } else {
                    // There is no network connection or the Server is not up.
                    error_message = "Oops. Network Error"
                }
                setChangePasswordResponseData({
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
            <form id="id-login-form" onSubmit={handleChangePassword}
                className="relative flex flex-column mg-x-auto pad-x1 pad-t2 pct:w-96 radius every:flex|flex-column|mg-y1|pad-y2|font-semibold lg:w-400|shadow:0-2px-12px-0-E8E8E8|pad-x4|pad-t4|pad-b4">
                {
                    changePasswordResponseData?.successful
                        ? <NotifSuccess message={changePasswordResponseData.message} />
                        : null
                }
                {
                    changePasswordResponseData?.error
                        ? <NotifError message={changePasswordResponseData.message} />
                        : null
                }
                <label className="">
                    Current Password
                    <input
                        type="password"
                        name="current_password"
                        // value={currentPassword || ""}
                        placeholder="Your current password"
                        onChange={(e) => handleCurrentPassword(e.target.value)}
                        ref={inputCurrentPasswordField}
                        className="pct:w-100 h-8 lh-8 pad-x2 mg-y1 outline:1px_solid_transparent border:1px_solid_lightgray outline-offset-2 focus:outline:2px_solid_gray transition:outline_80ms_ease radius-sm font-12 placeholder:font-regular"
                    />
                </label>
                <label className="">
                    New Password
                    <input
                        type="password"
                        name="new_password"
                        // value={newPassword || ""}
                        placeholder="New password"
                        onChange={(e) => handleNewPassword(e.target.value)}
                        ref={inputNewPasswordField}
                        className="pct:w-100 h-8 lh-8 pad-x2 mg-y1 outline:1px_solid_transparent border:1px_solid_lightgray outline-offset-2 focus:outline:2px_solid_gray transition:outline_80ms_ease radius-sm font-12 placeholder:font-regular"
                    />
                    <button type={"button"} className={"pad-x1 border-0 bg-transparent color-green-dark text-left"} onClick={() => { }}><span className={"fa fa-info-circle"}></span> Generate strong password?</button>
                </label>
                <div>
                    <button
                        type="submit"
                        className="d-block pct:w-64 h-7 lh-7 mg-x-auto text-center radius bg-green border-0 color-FFF font-14 font-medium cursor-pointer disabled:bg-green-inverse|cursor-not-allowed"
                        disabled={!formValid}
                        onClick={(e) => showLoadingState(e)}
                    >{isSubmit ? <span className='fa fa-spinner fa-spin'></span> : "Submit"}
                    </button>
                </div>
            </form>
            <div className={"d-block pct:w-72 mg-x-auto mg-y4 border:0px_solid_BBB em:border-t-0.05 lg:w-320|mg-y8|border-DDD"}></div>
            <div
                className={"pct:w-96 mg-x-auto text-center lg:w-400"}>
                Click here if you <Link to={"/forgot-password"} className={"font-semibold pad-y2 pad-x-1 color-red"}>Forgot current password?</Link>
            </div>
        </>
    )
}


const ChangePassword = () => {
    return (
        <div className="relative flex flex-column pct:h-100 pad-y2 lg:justify-center|align-items-center|pad-y4">
            <Link to={"/"} className="relative text-left font-28 font-black lh-normal mg-b2 pad-l2 decoration-none color-initial lg:mg-b6|text-center">
                Nine
                {/*<div className={"text-left mg-b4 lh-100 font-14 font-regular"}>All Naija Apps in one place</div>*/}
            </Link>
            <div className="text-left mg-b4 pad-l2 font-16 font-semibold lh-normal lg:mg-b0|pad-x-auto|font-15|font-medium">Change your Password</div>
            {/*<div className="text-center font-28 font-medium lh-normal">Nine</div>*/}
            <ChangePasswordForm />
        </div>
    );
};

export default memo(ChangePassword);