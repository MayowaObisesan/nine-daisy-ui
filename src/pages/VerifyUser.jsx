import React, { memo, useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, LoadingButton, NotifError, NotifSuccess, TextInput } from "../components/Elements";
import { deleteUserTokens, initiateLogin } from "../helpers/utils";
import axios from 'axios';
import useTokenData from '../hooks/useTokenData';
import { AccountPageContainer } from './Login';
import { FormField, LabelField } from '../components/Forms';


const VerifyUserForm = () => {
    const [email, setEmail] = useState("");
    const [code, setCode] = useState("");
    const [verifyUserResponseData, setVerifyUserResponseData] = useState({});
    const navigate = useNavigate();
    const inputEmailField = useRef(null);
    const inputCodeField = useRef(null);
    const [isSubmit, setIsSubmit] = useState(false);
    const [isResendCodeButtonClicked, setIsResendCodeButtonClicked] = useState(false);
    const { rawToken, isLoggedIn, tokenData } = useTokenData();

    useEffect(() => {
        setEmail(tokenData?.email)
    }, [tokenData])

    const showLoadingState = (e) => {
        setIsSubmit(true);
    };

    const handleVerifyUser = (event) => {
        const verifyUserURL = `${process.env.REACT_APP_BASE_URL}/user/verify/`;
        const headers = {
            'Accept': '*/*',
            // 'Origin': '*',
        };
        const fetchInit = {
            method: 'POST',
            headers: headers,
            mode: 'cors',
            // body: new FormData(event.target),
            data: new FormData(event.target),
            cache: 'default',
        };
        event.preventDefault();

        // fetch(verifyUserURL, fetchInit)
        axios(verifyUserURL, fetchInit)
            .then(response => {
                if (response.status !== 200) {
                    // repsonse contains the entire response information: status, code, errors, and other information.
                    throw response;
                }
                // return response.json();
                return response.data;
            })
            .then((data) => {
                // reset the password reset form
                event.target.reset();
                setEmail('');
                setIsSubmit(false);
                setVerifyUserResponseData({
                    message: "User verification successful",
                    successful: true,
                    error: false
                });
                // logout the currently loggedin user
                // deleteUserTokens();
                // refresh the login
                // initiateLogin();

                // set the returned refresh and access tokens as the user tokens. This logs the user in.
                localStorage.setItem('nine_login', data?.data['access']);
                localStorage.setItem('nine_refresh', data?.data['refresh']);

                // redirect to login, this serves as the refresh operation to delete stale states and data
                setTimeout(() => {
                    navigate('/');
                }, 800);
            })
            .catch((error) => {
                let error_message;
                error_message = error.response?.data?.error || "Unable to complete request";
                // if (error.status === 401) {
                //     error_message = "Invalid login credentials"
                // } else if (error.status === 400) {
                //     error_message = "Email and code are required"
                // } else if (error.status === 500) {
                //     error_message = "Check your internet connection"
                // } else {
                //     // There is no network connection or the Server is not up.
                //     error_message = "Oops. Network Error"
                // }
                setVerifyUserResponseData({
                    message: error_message,
                    successful: false,
                    error: true
                });
                // reset the isSubmit loader
                setIsSubmit(false);
            });
    }

    const resendVerificationCode = (event) => {
        const resendVerificationCodeFormData = new FormData()
        if (email) {
            resendVerificationCodeFormData.append("email", email);
        }
        const resendVerifyUserCodeURL = `${process.env.REACT_APP_BASE_URL}/user/resend-registration-code/`;
        const headers = {
            'Accept': '*/*',
            // 'Origin': '*',
        };
        const fetchInit = {
            method: 'POST',
            headers: headers,
            mode: 'cors',
            body: resendVerificationCodeFormData,
            cache: 'default',
        };
        event.preventDefault();

        fetch(resendVerifyUserCodeURL, fetchInit)
            .then(response => {
                if (!response.ok) {
                    throw response;
                }
                return response.json();
            })
            .then((data) => {
                setIsResendCodeButtonClicked(false);
                setVerifyUserResponseData({
                    message: "A new verification code has been sent to your email",
                    successful: true,
                    error: false
                });
            })
            .catch((error) => {
                let error_message;
                error_message = error.response?.data?.error || "Unable to complete request";
                // if (error.status === 401) {
                //     // error_message = "Kindly login to verify account"
                // } else if (error.status === 400) {
                //     error_message = "Email is required to resend verification code"
                // } else if (error.status === 500) {
                //     error_message = "Check your internet connection"
                // } else {
                //     // There is no network connection or the Server is not up.
                //     error_message = "Oops. Network Error"
                // }
                setVerifyUserResponseData({
                    message: error_message,
                    successful: false,
                    error: true
                });
                // reset the isSubmit loader
                setIsResendCodeButtonClicked(false);
            });
    };

    return (
        <>
            <form id="id-verify-user-form" onSubmit={handleVerifyUser}
                className="card relative flex flex-col gap-5 mx-auto px-1 w-[96%] md:w-[480px] md:shadow-md lg:shadow:0-2px-12px-0-E8E8E8 lg:shadow-none md:px-8 md:py-8">
                {
                    verifyUserResponseData?.successful
                        ? <NotifSuccess message={verifyUserResponseData.message} />
                        : null
                }
                {
                    verifyUserResponseData?.error
                        ? <NotifError message={verifyUserResponseData.message} />
                        : null
                }
                <FormField>
                    <LabelField text={"Email"}>
                        <TextInput
                            type="email"
                            name="email"
                            defaultValue={tokenData?.email}
                            // value={email || ""}
                            placeholder="Your email address"
                            disabled={tokenData?.email}
                            onChange={(e) => setEmail(e.target.value)}
                            ref={inputEmailField}
                        />
                    </LabelField>
                </FormField>
                <FormField>
                    <LabelField text={"Code"}>
                        <TextInput
                            type="text"
                            name="code"
                            value={code || ""}
                            placeholder="Verification code"
                            onChange={(e) => setCode(e.target.value)}
                            ref={inputCodeField}
                        />
                    </LabelField>
                </FormField>
                {/* <label className="">
                    Email
                    <input
                        type="email"
                        name="email"
                        defaultValue={tokenData?.email}
                        // value={email || ""}
                        placeholder="Your email address"
                        onChange={(e) => setEmail(e.target.value)}
                        ref={inputEmailField}
                        disabled={tokenData?.email}
                        className="pct:w-100 h-8 lh-8 pad-x2 mg-y1 outline:1px_solid_transparent border:1px_solid_lightgray outline-offset-2 focus:outline:2px_solid_gray transition:outline_80ms_ease radius-sm font-12 placeholder:font-regular disabled:bg-light|cursor-not-allowed dark:bg-222425|border:1px_solid_000304|color-whitesmoke dark:focus:outline:3px_solid_444445|bg-333435"
                    />
                </label>
                <label className="">
                    Code
                    <input
                        type="text"
                        name="code"
                        value={code || ""}
                        placeholder="Verification code"
                        onChange={(e) => setCode(e.target.value)}
                        ref={inputCodeField}
                        className="pct:w-100 h-8 lh-8 pad-x2 mg-y1 outline:1px_solid_transparent border:1px_solid_lightgray outline-offset-2 focus:outline:2px_solid_gray transition:outline_80ms_ease radius-sm font-12 placeholder:font-regular dark:bg-222425|border:1px_solid_000304|color-whitesmoke dark:focus:outline:3px_solid_444445|bg-333435"
                    />
                </label> */}
                <div className={"form-control"}>
                    {/* <button
                        type="submit"
                        className="d-block pct:w-64 h-7 lh-7 mg-x-auto text-center radius bg-green border-0 color-FFF font-14 font-medium cursor-pointer disabled:bg-green-inverse|cursor-not-allowed"
                        disabled={!(email && code)}
                        onClick={(e) => showLoadingState(e)}
                    >{isSubmit ? <span className='fa fa-spinner fa-spin'></span> : "Submit"}
                    </button> */}
                    <Button
                        type="submit"
                        disabled={!(email && code)}
                        onClick={(e) => showLoadingState(e)}
                    >
                        {isSubmit ? <LoadingButton /> : "Submit"}
                    </Button>
                </div>
            </form>
            {/* <div className={"d-block pct:w-72 mg-x-auto mg-y4 border:0px_solid_BBB em:border-t-0.05 lg:w-320|mg-y8|border-DDD dark:border:0px_solid_444445 dark:em:border-t-0.05"}></div> */}
            <div
                className={"pct:w-96 mg-x-auto text-center lg:w-400"}>
                Didn't get a code?
                <button
                    className={"btn btn-sm btn-ghost rounded-lg disabled:btn-ghost disabled:opacity-80 disabled:hover:cursor-not-allowed dark:hover:bg-base-100 font-bold pad-y2 pad-x1 border-0 bg-transparent color-initial radius decoration-none disabled:color-lightgray hover:bg-light|cursor-pointer dark:color-whitesmoke"}
                    disabled={!email}
                    onClick={resendVerificationCode}
                >
                    {isResendCodeButtonClicked ? <LoadingButton /> : "Request new code"}
                </button>
            </div>
        </>
    )
}


const VerifyUser = () => {
    return (
        <AccountPageContainer header={"Verify your account"}>
            <div className={"relative bg-base-200 p-4 rounded-xl radius text-center lg:w-400"}>
                A code has been sent to your mail.
                <br /> The sent code lasts for 5 minutes
                <br /> Kindly verify your account using that code.
            </div>
            <VerifyUserForm />
        </AccountPageContainer>
        // <div className="relative flex flex-column pct:h-100 pad-y2 lg:justify-center|align-items-center|pad-y4 dark:bg-111314|color-whitesmoke">
        //     <Link to={"/"} className="relative text-left font-28 font-black lh-normal mg-b2 pad-l2 decoration-none color-initial lg:mg-b6|text-center dark:color-whitesmoke">
        //         Nine
        //         {/*<div className={"text-left mg-b4 lh-100 font-14 font-regular"}>All Naija Apps in one place</div>*/}
        //     </Link>
        //     <div className="text-left mg-b4 pad-l2 font-16 font-semibold lh-normal lg:mg-b0|pad-x-auto|font-15|font-medium"></div>
        //     {/*<div className="text-center font-28 font-medium lh-normal">Nine</div>*/}

        // </div>
    );
};

export default memo(VerifyUser);