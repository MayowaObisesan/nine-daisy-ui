import React, { useState } from "react";
import { useLoaderData, useParams } from "react-router-dom";
import useFetch from "../hooks/useFetch";
import { Button, LoadingButton, NotifError, NotifSuccess, PageHeaderLink } from "../components/Elements";
// import { useDeviceWidth } from "./useDeviceWidth";
import App from "../App";
import { AppDetailLeftNav } from "./UpdateAppDetail";
import axios from "axios";
import { useDeviceSize } from "../hooks/useDeviceSize";
import { deviceWidthEnum } from "../helpers/utils";

const UpdateAppLogo = () => {
    const { app } = useLoaderData();
    const appData = app?.data;
    const { appNameId } = useParams();
    // const { windowWidth, screenWidth, deviceWidthEnum } = useDeviceWidth();
    const size = useDeviceSize();
    // const [appData] = useFetch(`${process.env.REACT_APP_BASE_URL}/app/${id}/`);
    const [isSubmit, setIsSubmit] = useState(false);
    const [updateAppLogoResponseData, setUpdateAppLogoResponseData] = useState({});
    const [appImage, setAppImage] = useState(appData?.logo);
    const [appImagePreview, setAppImagePreview] = useState(null);


    const handleAppImageChange = (event) => {
        const selectedImage = event.target.files[0];
        setAppImage(selectedImage);
        setAppImagePreview(URL.createObjectURL(selectedImage));
    };

    const showLoadingState = (e) => {
        setIsSubmit(true);
    };

    const updateLogoForm = (event) => {
        event.preventDefault();
        const formData = new FormData();
        if (appImage) {
            formData.append("logo", appImage);
        }

        const updateAppURL = `${process.env.REACT_APP_BASE_URL}/app/${appNameId}/`;
        console.log(updateAppURL);
        const headers = {
            'Accept': '*/*',
            // 'Origin': '*',
            'Authorization': `Bearer ${window.localStorage.getItem('nine_login')}`
        };
        const fetchInit = {
            method: 'PATCH',
            headers: headers,
            mode: 'cors',
            // body: formData,
            data: formData,
            cache: 'default',
        };
        axios(updateAppURL, fetchInit)
            .then(response => {
                if (response.status !== 200) throw response;
                // return response.json()
                return response.data;
            })
            .then(data => {
                setIsSubmit(false);
                setUpdateAppLogoResponseData({
                    message: "App logo update successful",
                    successful: true,
                    error: false
                });
            })
            .catch((error) => {
                let errorMessage = error.response?.data.error || "Unable to process request";
                // if (error.status === 401) {
                //     errorMessage = "Kindly login to update your Profile"
                // } else if (error.status === 400) {
                //     errorMessage = "Unable to perform update. Kindly fix any form errors and re-submit"
                // } else if (error.status === 500) {
                //     errorMessage = "Check your internet connection"
                // } else {
                //     // There is no network connection or the Server is not up.
                //     errorMessage = "Network Error"
                // }
                setUpdateAppLogoResponseData({
                    message: errorMessage,
                    successful: false,
                    error: true
                });
                // reset the isSubmit loader
                setIsSubmit(false);
            });
    };

    return (
        <section className={"flex flex-row flex-nowrap justify-start w-full h-screen pct:w-100 pct:h-100 dark:bg-111314"}>
            {/* {
                size.windowWidth >= deviceWidthEnum.laptop
                    ? <AppDetailLeftNav appName={appData?.name} pageName={"Logo"} />
                    : null
            } */}
            <form method={"PATCH"} onSubmit={updateLogoForm} className={"flex flex-col w-full pct:w-100 l:w-[56%] lg:mx-auto lg:pct:w-56|mg-r-auto|mg-t8"}>
                {
                    size.windowWidth < deviceWidthEnum.laptop
                        ? <PageHeaderLink headerTitle={"Update App Logo"} />
                        : <PageHeaderLink headerTitle={"App Logo"} />
                }
                {
                    updateAppLogoResponseData?.successful
                        // ? <div
                        //     className="relative mx-auto text-center w-[64%] pct:w-64 py-4 rounded radius-sm bg-green-inverse color-green">
                        //     {updateAppLogoResponseData.message}
                        // </div>
                        ? <NotifSuccess>{updateAppLogoResponseData.message}</NotifSuccess>
                        : null
                }
                {
                    updateAppLogoResponseData?.error
                        // ? <div
                        //     className="relative mx-auto text-center pct:w-64 pad-y2 radius-sm bg-red-inverse color-red">
                        //     {updateAppLogoResponseData.message}
                        // </div>
                        ? <NotifError>{updateAppLogoResponseData.message}</NotifError>
                        : null
                }

                <div className={"flex-1 block mx-auto my-16 text-center dark:color-whitesmoke"}>
                    {/*<div className={"block mx-auto square3-12 lh3-12 radius-circle bg-floralwhite shadow:inset--15px--3px-8px-2px-lightgray|inset-3px--4px-14px-12px-E7E7E7"}>*/}
                    <div className={"block mx-auto w-[288px] h-[288px] leading-[288px] rounded-full square3-12 lh3-12 radius-circle bg-base-200 shadow-inner border:2px_dashed_DDD dark:bg-333435|border:2px_dashed_darkgray"}>
                        {
                            // appData?.logo
                            appImagePreview
                                ? <div className={"relative block w-full h-full bg-base-100 rounded-full pct:w-100 pct:h-100 bg-lighter radius-inherit dark:bg-333435 dark:bg-base-100"}>
                                    <img src={appImagePreview} alt={"App uploaded logo"} style={{}}
                                        className={"block max-w-full w-full h-full rounded-full pct:max-w-100 pct:w-100 pct:h-100 object-center object-cover radius-inherit"} />
                                </div>
                                : <img src={appData?.logo} alt={appData?.name}
                                    className={"block max-w-full w-full rounded-full pct:max-w-100 pct:w-100 pct:h-100 object-center object-cover radius-inherit"} />
                        }
                    </div>
                    <label htmlFor="id-image-upload" className={"btn inline-block h-12 leading-[48px] bg-base-200 bg-light rounded-xl radius px-6 my-8 dark:bg-222425|color-whitesmoke dark:bg-base-200"}>Upload new logo</label>
                    <input
                        type="file"
                        id="id-image-upload"
                        name={"logo"}
                        accept=".jpg,.jpeg,.png"
                        onChange={handleAppImageChange}
                        hidden
                    />
                </div>

                <div className={"sticky bottom-0 py-12 w-full pct:w-100 mx-auto bg-white-solid lg:w-[56%] dark:bg-111314"}>
                    {/* <button
                        type={"submit"}
                        className={"block w-[64%] max-w-[480px] pct:w-64 max-w-480 h-7 lh-7 mx-auto pad-x2 border-0 bg-green color-white radius decoration-none disabled:bg-green-inverse"}
                        onClick={showLoadingState}
                        disabled={!appImage}
                    >
                        {isSubmit ? <span className='fa fa-spinner fa-spin'></span> : "Save"}
                    </button> */}
                    <Button
                        type={"submit"}
                        classes={"btn-wide block mx-auto disabled:bg-accent disabled:text-primary disabled:opacity-50"}
                        disabled={!appImage}
                        onClick={showLoadingState}
                    >
                        {isSubmit ? <LoadingButton /> : "Save"}
                    </Button>
                </div>
            </form>
        </section>
    );
}
export default UpdateAppLogo;