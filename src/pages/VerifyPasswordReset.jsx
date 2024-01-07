import React, { memo, useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, LoadingButton, NotifError, NotifSuccess, TextInput } from "../components/Elements";
import axios from 'axios';
import { FormField, LabelField } from '../components/Forms';
import { AccountPageContainer } from './Login';


const VerifyPasswordResetForm = () => {
    const [code, setCode] = useState("");
    const [verifyPasswordResetResponseData, setVerifyPasswordResetResponseData] = useState({});
    const navigate = useNavigate();
    const inputCodeField = useRef(null);
    const [isSubmit, setIsSubmit] = useState(false);

    const showLoadingState = (e) => {
        // e.target.innerHTML = "<span class='fa fa-spinner fa-spin'></span>";
        setIsSubmit(true);
    };

    const handleVerifyPasswordReset = (event) => {
        const verifyPasswordResetURL = `${process.env.REACT_APP_BASE_URL}/user/verify-password/`;
        // const verifyPasswordResetURL = "https://blessedmayowa.pythonanywhere.com/login/";
        const headers = {
            'Accept': '*/*',
            // 'Origin': '*',
        };
        const fetchConfig = {
            method: 'POST',
            headers: headers,
            mode: 'cors',
            // body: new FormData(event.target),
            data: new FormData(event.target),
            cache: 'default',
        };
        event.preventDefault();

        // fetch(verifyPasswordResetURL, fetchConfig)
        axios(verifyPasswordResetURL, fetchConfig)
            .then(response => {
                if (response.status !== 200) {
                    let error_message;
                    if (response.status === 401) {
                        error_message = "Invalid login credentials"
                    } else if (response.status === 400) {
                        error_message = "VerifyPasswordReset credentials are not valid"
                    } else if (response.status === 500) {
                        error_message = "Check your internet connection"
                    } else {
                        // There is no network connection or the Server is not up.
                        error_message = "Oops. Network Error"
                    }
                    setVerifyPasswordResetResponseData({
                        message: error_message,
                        successful: false,
                        error: true
                    });
                    setIsSubmit(false);

                    throw response;
                }
                // return response.json();
                return response.data
            })
            .then((data) => {
                setIsSubmit(false);
                // reset the password reset form
                event.target.reset();
                setCode('');
                setVerifyPasswordResetResponseData({
                    message: "Password reset verification successful",
                    successful: true,
                    error: false
                });
                setTimeout(() => {
                    navigate('/set-password');
                }, 800);
            })
            .catch((error) => {
                setIsSubmit(false);
            });
    }

    return (
        <>
            <form id="id-verify-password-reset-form" onSubmit={handleVerifyPasswordReset}
                className="card relative flex flex-col gap-5 space-y-5 mx-auto px-1 w-[96%] md:w-[480px] md:shadow-md lg:shadow:0-2px-12px-0-E8E8E8 lg:shadow-none md:px-8 md:py-8">
                {
                    verifyPasswordResetResponseData?.successful
                        ? <NotifSuccess message={verifyPasswordResetResponseData.message} />
                        : null
                }
                {
                    verifyPasswordResetResponseData?.error
                        ? <NotifError message={verifyPasswordResetResponseData.message} />
                        : null
                }
                <FormField>
                    <LabelField text={"Reset code"}>
                        <TextInput
                            type="text"
                            name="code"
                            value={code || ""}
                            placeholder="Verification Code"
                            onChange={(e) => setCode(e.target.value)}
                            ref={inputCodeField}
                        />
                    </LabelField>
                </FormField>
                {/* <label className="">
                    Reset Code
                    <input
                        type="text"
                        name="code"
                        value={code || ""}
                        placeholder="Verification Code"
                        onChange={(e) => setCode(e.target.value)}
                        ref={inputCodeField}
                        className="pct:w-100 h-8 lh-8 pad-x2 mg-y1 outline:1px_solid_transparent border:1px_solid_lightgray outline-offset-2 focus:outline:2px_solid_gray transition:outline_80ms_ease radius-sm font-12 placeholder:font-regular dark:bg-222425|border:1px_solid_000304|color-whitesmoke dark:focus:outline:3px_solid_444445|bg-333435"
                    />
                </label> */}
                <div className={"form-control"}>
                    {/* <button
                        type="submit"
                        className="d-block pct:w-64 h-7 lh-7 mg-x-auto text-center radius bg-green border-0 color-FFF font-14 font-medium cursor-pointer disabled:bg-green-inverse|cursor-not-allowed"
                        disabled={!code}
                        onClick={(e) => showLoadingState(e)}
                    >{isSubmit ? <span className='fa fa-spinner fa-spin'></span> : "Submit"}
                    </button> */}
                    <Button
                        type="submit"
                        disabled={!code}
                        onClick={(e) => showLoadingState(e)}
                    >
                        {isSubmit ? <LoadingButton /> : "Submit"}
                    </Button>
                </div>
            </form>
            {/* <div className={"d-block pct:w-72 mg-x-auto mg-y4 border:0px_solid_BBB em:border-t-0.05 lg:w-320|mg-y8|border-DDD dark:border:0px_solid_444445 dark:em:border-t-0.05"}></div> */}
            <div
                className={"pct:w-96 mg-x-auto text-center lg:w-400"}>
                Didn't get the code? <Link to={"/forgot-password"} className={"btn hover:dark:bg-base-100 font-bold pad-y2 pad-x1 color-initial dark:color-whitesmoke"}>Resend password reset code</Link>
            </div>
        </>
    )
}


const VerifyPasswordReset = () => {
    return (
        <AccountPageContainer header={"Verify Password Reset code"}>
            <VerifyPasswordResetForm />
        </AccountPageContainer>
    );
};

export default memo(VerifyPasswordReset);