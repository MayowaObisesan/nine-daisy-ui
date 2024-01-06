import React, { useEffect, useState } from "react";
import { Link, useLoaderData, useParams } from "react-router-dom";
import useFetch from "../hooks/useFetch";
import { Button, LoadingButton, NotifError, NotifSuccess, PageHeaderLink } from "../components/Elements";
import axios from "axios";
import { deviceWidthEnum } from "../helpers/utils";
import { useDeviceSize } from "../hooks/useDeviceSize";

const UpdateAppScreenshotReplace = (props) => {
    const size = useDeviceSize();
    const { appNameId, screenshotId } = useParams();
    const { app } = useLoaderData();
    const appData = app?.data;
    // const { windowWidth, screenWidth, deviceWidthEnum } = useDeviceWidth();
    // const [appData] = useFetch(`${process.env.REACT_APP_BASE_URL}/app/${id}/`);
    const [appScreenshotData] = useFetch(`${process.env.REACT_APP_BASE_URL}/app/screenshot/${screenshotId}/`);
    const [isDeleteSubmit, setIsDeleteSubmit] = useState(false);
    const [isReplaceSubmit, setIsReplaceSubmit] = useState(false);
    const [appScreenshotReplace, setAppScreenshotReplace] = useState([]);
    const [appScreenshotReplacePreview, setAppScreenshotReplacePreview] = useState([]);
    const [updateAppScreenshotReplaceResponseData, setUpdateAppScreenshotReplaceResponseData] = useState({});

    useEffect(() => {
        if (appScreenshotReplacePreview.length < 4) {
            setAppScreenshotReplacePreview(
                appScreenshotReplace?.map((file) => URL.createObjectURL(file))
            );
        }
    }, [appScreenshotReplace]);

    const handleAppScreenshotReplaceSelect = (event) => {
        const files = Array.from(event.target.files);
        setAppScreenshotReplace(files);
        // setAppScreenshotReplacePreview(
        //     files.map((file) => URL.createObjectURL(file))
        // );
    };


    const showDeleteLoadingState = (e) => {
        setIsDeleteSubmit(true);
    };

    const showReplaceLoadingState = (e) => {
        setIsReplaceSubmit(true);
    };


    const updateScreenshotReplaceForm = (event) => {
        event.preventDefault();
        const formData = new FormData();
        // if (appImage) {
        //     formData.append("logo", appImage);
        // }
        appScreenshotReplace.forEach((file, index) => {
            // formData.append(`images[${index}]`, file)
            formData.append(`screenshots`, file)
        });
        const updateAppURL = `${process.env.REACT_APP_BASE_URL}/app/screenshot/${screenshotId}/delete/`;
        const headers = {
            'Accept': '*/*',
            // 'Origin': '*',
            'Authorization': `Bearer ${window.localStorage.getItem('nine_login')}`
        };
        const fetchConfig = {
            method: 'PATCH',
            headers: headers,
            mode: 'cors',
            // body: formData,
            data: formData,
            cache: 'default',
        };
        // fetch(updateAppURL, fetchConfig)
        axios(updateAppURL, fetchConfig)
            .then(response => {
                if (response.status !== 200) throw response;
                // return response.json()
                return response.data
            })
            .then(data => {
                setIsReplaceSubmit(false);
                setUpdateAppScreenshotReplaceResponseData({
                    message: "App logo update successful",
                    successful: true,
                    error: false
                });
            })
            .catch((error) => {
                // let error_message;
                // if (error.status === 401) {
                //     error_message = "Kindly login to update your Profile"
                // } else if (error.status === 400) {
                //     error_message = "Unable to perform update. Kindly fix any form errors and re-submit"
                // } else if (error.status === 500) {
                //     error_message = "Check your internet connection"
                // } else {
                //     // There is no network connection or the Server is not up.
                //     error_message = "Network Error"
                // }
                const errorMessage = error.response?.data.error || "Unable to process request";
                setUpdateAppScreenshotReplaceResponseData({
                    message: errorMessage,
                    successful: false,
                    error: true
                });
                // reset the isSubmit loader
                setIsReplaceSubmit(false);
            });
    };

    const handleScreenshotReplace = (event) => {
        event.preventDefault();
        let screenshotDeleteSuccessful = true;
        // First delete the Image and if successful, replace the screenshot
        const deleteAppURL = `${process.env.REACT_APP_BASE_URL}/app/screenshot/${screenshotId}/delete/`;
        const deleteHeaders = {
            'Accept': '*/*',
            // 'Origin': '*',
            'Authorization': `Bearer ${window.localStorage.getItem('nine_login')}`
        };
        const deleteFetchInit = {
            method: 'DELETE',
            headers: deleteHeaders,
            mode: 'cors',
            cache: 'default',
        };
        // fetch(deleteAppURL, deleteFetchInit)
        //     .then(response => {
        //         if (response.status !== 200) throw Error(response.error);
        //         response.json()
        //     })
        //     .then(data => {
        //         screenshotDeleteSuccessful = true;
        //     })
        //     .catch((error) => {
        //         screenshotDeleteSuccessful = false;
        //     });

        if (screenshotDeleteSuccessful) {
            const formData = new FormData();
            // if (appImage) {
            //     formData.append("logo", appImage);
            // }
            appScreenshotReplace.forEach((file, index) => {
                // formData.append(`images[${index}]`, file)
                formData.append(`screenshots`, file)
            });
            const updateAppURL = `${process.env.REACT_APP_BASE_URL}/app/screenshot/${screenshotId}/update/`;
            const headers = {
                'Accept': '*/*',
                // 'Origin': '*',
                'Authorization': `Bearer ${window.localStorage.getItem('nine_login')}`
            };
            const fetchConfig = {
                method: 'PATCH',
                headers: headers,
                mode: 'cors',
                // body: formData,
                data: formData,
                cache: 'default',
            };
            // fetch(updateAppURL, fetchConfig)
            axios(updateAppURL, fetchConfig)
                .then(response => {
                    if (response.status !== 200) throw response;
                    // return response.json()
                    return response.data
                })
                .then(data => {
                    setIsReplaceSubmit(false);
                    setUpdateAppScreenshotReplaceResponseData({
                        message: "App screenshot update successful",
                        successful: true,
                        error: false
                    });
                })
                .catch((error) => {
                    // let error_message;
                    // if (error.status === 401) {
                    //     error_message = "Kindly login to update your Profile"
                    // } else if (error.status === 400) {
                    //     error_message = "Unable to perform update. Kindly fix any form errors and re-submit"
                    // } else if (error.status === 500) {
                    //     error_message = "Check your internet connection"
                    // } else {
                    //     // There is no network connection or the Server is not up.
                    //     error_message = "Unable to update screenshot. Kindly retry"
                    // }
                    const errorMessage = error.response?.data.error || "Unable to process request";
                    setUpdateAppScreenshotReplaceResponseData({
                        message: errorMessage,
                        successful: false,
                        error: true
                    });
                    // reset the isSubmit loader
                    setIsReplaceSubmit(false);
                });
        }
    };
    const handleResetScreenshotPreview = () => {
        setAppScreenshotReplace([]);
    };
    return (
        <section className={"flex flex-row flex-nowrap justify-start w-full h-screen dark:bg-111314"}>
            {/* {
                size.windowWidth >= deviceWidthEnum.laptop
                    ? <section className={"w-[20%] h-screen pct:w-20 vh:h-100 bg-lighter dark:bg-000304 dark:every:color-whitesmoke"}>
                        <div
                            className={"flex flex-col justify-center items-start text-2xl w-full h-[160px] font-18 lh-normal pct:w-100 h-160 px-8 lg:font-24 lg:text-4xl"}>
                            <div className={"font-size-inherit"}>Update</div>
                            <div className={"font-size-inherit font-bold color-gray"}>{appData?.name}</div>
                        </div>
                        <section className={"block every:d-block|pad-4|radius|decoration-none|color-initial hover:every:bg-light dark:every:color-whitesmoke dark:hover:every:bg-222425"}>
                            <button className={"block w-full p-8 rounded-xl decoration-0 hover:bg-base-200 dark:hover:bg-base-100 pct:w-100 text-left border-0 bg-initial cursor-pointer"} onClick={() => { window.history.back() }}>Screenshots</button>
                        </section>
                    </section>
                    : null
            } */}
            <form onSubmit={updateScreenshotReplaceForm} className={"flex flex-col w-full l:w-[56%] lg:mr-auto pct:w-100 lg:pct:w-56|mg-r-auto|mg-t8"}>
                <PageHeaderLink />
                <section className={"flex-1 flex flex-col lg:w-full"}>
                    {/*<header className={"pad-x2 font-semibold h-5 lh-5"}>*/}
                    {/*    /!*Upload ScreenshotReplace of your app*!/*/}
                    {/*    /!*<span className={"d-block font-italic"}>You could upload this later</span>*!/*/}
                    {/*</header>*/}
                    {
                        updateAppScreenshotReplaceResponseData?.successful
                            ? <NotifSuccess message={updateAppScreenshotReplaceResponseData.message} />
                            : null
                    }
                    {
                        updateAppScreenshotReplaceResponseData?.error
                            ? <NotifError message={updateAppScreenshotReplaceResponseData.message} />
                            : null
                    }
                    <section className={"flex-1 pt-8 pb-4 bg-white-solid dark:bg-111314"}>
                        {
                            appScreenshotReplacePreview?.length < 1
                                ? (
                                    appScreenshotData?.image
                                        ? <img src={appScreenshotData?.image}
                                            alt={`${appData?.name} Screenshot`}
                                            height={"480"}
                                            // width={"80%"}
                                            className={"block max-w-[80%] h-[480px] lg:h-[480px] rounded-xl pct:w-80 pct:max-w-80 mx-auto radius object-cover object-center"}
                                        />
                                        : <div
                                            className={"flex flex-col justify-center items-center w-[80%] max-w-[80%] h-[480px] rounded-xl pct:w-80 pct:max-w-80 h-480 mx-auto text-center border:2px_dashed_DDD radius color-999 hover:cursor-pointer transition:all_200ms_ease dark:bg-222425 dark:border:0px_solid_darkgray dark:hover:bg-333435 dark:bg-base-200 dark:hover:bg-base-100 transition-colors"}>
                                            <span className="fa fa-plus text-3xl lg:text-4xl font-28 py-4"></span>
                                        </div>
                                )
                                : <>
                                    <img src={appScreenshotReplacePreview[0]}
                                        alt={"replaced Screenshot"}
                                        height={"480"}
                                        // width={"80%"}
                                        className={"block max-w-[80%] h-[480px] rounded pct:w-80 pct:max-w-80 mx-auto radius object-cover object-center"}
                                    />
                                </>
                        }
                        <div
                            className={"flex flex-row justify-center items-center w-[80%] max-w-[80%] pct:w-80 pct:max-w-80 mx-auto"}>
                            <label
                                htmlFor={"id-app-screenshot-upload"}
                                className={"flex flex-row justify-center items-center w-full h-12 leading-12 pct:w-100 lh-6 my-8 rounded-box text-center border:2px_solid_BBB radius color-999 hover:cursor-pointer hover:bg-222425 transition:all_200ms_ease dark:bg-222425 dark:border:0px_solid_darkgray dark:hover:bg-333435"}>
                                {/*<span className="fa fa-plus pad-2"></span>*/}
                                <div className={"btn btn-wide dark:bg-base-100 dark:hover:bg-base-200"}>{"Change"}</div>
                                <input
                                    id={"id-app-screenshot-upload"}
                                    type="file"
                                    name={"screenshot"}
                                    hidden
                                    accept={"image/*"}
                                    onChange={handleAppScreenshotReplaceSelect}
                                />
                            </label>
                            {
                                appScreenshotReplacePreview?.length > 0
                                    // ? <button
                                    //     type={"button"}
                                    //     className={"h-12 leading-12 lh-6 ml-2 my-2 px-4 rounded mg-l1 mg-y1 pad-x2 radius text-center border:0px_solid_lightgray bg-red color-white"}
                                    //     onClick={handleResetScreenshotPreview}>
                                    //     <span className={"fa fa-times font-16"}></span>
                                    // </button>
                                    ? <Button
                                        type={"button"}
                                        classes={"btn-error"}
                                        onClick={handleResetScreenshotPreview}
                                    >
                                        <span className={"fa fa-times font-16"}></span>
                                    </Button>
                                    : null
                            }
                        </div>

                    </section>
                    {/*<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className={"pct:w-100"}>*/}
                    {/*    <path d="M 0 78.5 C 0 14.130000000000004, 14.130000000000004 0 78.5 0 S 157 14.130000000000004, 157 78.5, 142.87 157, 78.5 157, 0 142.87, 0 78.5" fill="#FADB5F" transform="rotate(0,100,100) translate(21.521.5)" width="100%"></path>*/}
                    {/*</svg>*/}
                    <div className={"sticky bottom-0 flex flex-row flex-nowrap justify-center items-center w-full mx-auto mt-2 py-8 l:w-[56%] pct:w-100 mg-x-auto mg-t-2 pad-y2 border:0px_solid_lightgray border-t-9 bg-white-solid every:h-6|lh-6|mg-x1|mg-y1|radius|text-center lg:pct:w-56|border-0 dark:bg-inherit"}>
                        {/*{
                            appScreenshotReplacePreview?.length < 1
                                ? <label
                                    htmlFor={"id-app-screenshot-upload"}
                                    className={"pct:w-60 border:2px_solid_lightgray bg-transparent"}>
                                    {"Replace screenshot"}
                                    <input
                                        id={"id-app-screenshot-upload"}
                                        type="file"
                                        name={"screenshot"}
                                        hidden
                                        accept={"image/*"}
                                        multiple
                                        onChange={handleAppScreenshotReplaceSelect}
                                    />
                                </label>
                                : null
                        }*/}
                        {/*<button type={"button"} className={"pct:w-60 border:2px_solid_lightgray bg-transparent"} onClick={handleScreenshotReplace}>
                            {isReplaceSubmit ? <span className='fa fa-spinner fa-spin'></span> : "Replace screenshot"}
                        </button>*/}

                        {/* <button
                            type={"button"}
                            className={"pct:w-30 border-0 bg-green color-white disabled:bg-green-inverse"}
                            onClick={handleScreenshotReplace}
                            disabled={appScreenshotReplacePreview?.length < 1}>
                            {isReplaceSubmit ? <span className='fa fa-spinner fa-spin'></span> : "Save"}
                        </button> */}
                        <Button
                            type={"button"}
                            classes={"btn-wide"}
                            onClick={handleScreenshotReplace}
                            disabled={appScreenshotReplacePreview?.length < 1}
                        >
                            {isReplaceSubmit ? <LoadingButton /> : "Save"}
                        </Button>
                    </div>
                </section>
            </form>
        </section>
    )
}

export default UpdateAppScreenshotReplace;