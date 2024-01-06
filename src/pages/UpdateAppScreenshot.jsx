import React, { useEffect, useState } from "react";
import { Link, Outlet, useLoaderData, useParams } from "react-router-dom";
import useFetch from "../hooks/useFetch";
import { Button, LoadingButton, NotifError, NotifSuccess, PageHeaderLink } from "../components/Elements";
import { AppDetailLeftNav } from "./UpdateAppDetail";
import axios from "axios";
import { useDeviceSize } from "../hooks/useDeviceSize";
import { deviceWidthEnum } from "../helpers/utils";

export const UpdateAppScreenshotIndex = (props) => {
    const { appNameId } = useParams();
    const { app } = useLoaderData();
    const appData = app?.data;
    // const { windowWidth, screenWidth, deviceWidthEnum } = useDeviceWidth();
    const size = useDeviceSize();
    // const [appData] = useFetch(`${process.env.REACT_APP_BASE_URL}/app/${id}/`);
    const [isSubmit, setIsSubmit] = useState(false);
    const [appScreenshots, setAppScreenshots] = useState([]);
    const [appScreenshotsPreview, setAppScreenshotsPreview] = useState([]);
    const [updateAppScreenshotResponseData, setUpdateAppScreenshotResponseData] = useState({});

    useEffect(() => {
        if (appScreenshotsPreview.length < 4) {
            setAppScreenshotsPreview(
                appScreenshots?.map((file) => URL.createObjectURL(file))
            );
        }
    }, [appScreenshots]);

    const handleAppScreenshotSelect = (event) => {
        // Reset the response Data object
        setUpdateAppScreenshotResponseData({});
        const files = Array.from(event.target.files);
        if (appScreenshots.length + files.length > 4) {
            setUpdateAppScreenshotResponseData({
                message: "Only 4 images can be uploaded",
                successful: false,
                error: true
            });
            return;
        }
        setAppScreenshots([...appScreenshots, ...files]);
        // setAppScreenshotsPreview(
        //     files.map((file) => URL.createObjectURL(file))
        // );
    };


    const showLoadingState = (e) => {
        setIsSubmit(true);
    };


    const updateScreenshotForm = (event) => {
        event.preventDefault();
        const formData = new FormData();
        // if (appImage) {
        //     formData.append("logo", appImage);
        // }
        appScreenshots.forEach((file, index) => {
            // formData.append(`images[${index}]`, file)
            formData.append(`screenshots`, file)
        });
        const updateAppURL = `${process.env.REACT_APP_BASE_URL}/app/${appNameId}/`;
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
                if (response.status !== 200) {
                    // let error_message;
                    // if (response.status === 401) {
                    //     error_message = "Kindly login to register your app"
                    // } else if (response.status === 400) {
                    //     error_message = "Unable to perform update. Kindly fix any form errors and re-submit"
                    // } else if (response.status === 500) {
                    //     error_message = "Something went wrong from our end. We are resolving this right now. Please try again in 3 minutes"
                    // } else {
                    //     // There is no network connection or the Server is not up.
                    //     error_message = "Network Error"
                    // }
                    // setUpdateAppScreenshotResponseData({
                    //     message: error_message,
                    //     successful: false,
                    //     error: true
                    // });
                    throw response;
                }
                // return response.json()
                return response.data;
            })
            .then(data => {
                setIsSubmit(false);
                setUpdateAppScreenshotResponseData({
                    message: "Screenshot upload successful",
                    successful: true,
                    error: false
                });
                // setTimeout(() => window.history.back(), 800);
            })
            .catch((error) => {
                const errorMessage = error.response?.data?.error || "Unable to process request";
                setUpdateAppScreenshotResponseData({
                    message: errorMessage,
                    successful: false,
                    error: true
                });
                // reset the isSubmit loader
                setIsSubmit(false);
            });
    };

    return (
        <section className={"flex flex-row flex-nowrap justify-start w-full h-screen overflow-y-auto pct:w-100 dark:bg-111314"}>
            {/* {
                size.windowWidth >= deviceWidthEnum.laptop
                    ? <AppDetailLeftNav appName={appData?.name} pageName={"Screenshots"} />
                    : null
            } */}
            <form onSubmit={appScreenshots.length > 0 ? updateScreenshotForm : null} className={"flex flex-col w-full pct:w-100 l:w-[56%] lg:mr-auto lg:pct:w-56|mg-r-auto|mg-t8"}>
                {
                    size.windowWidth < deviceWidthEnum.laptop
                        ? <PageHeaderLink headerTitle={"Update Screenshots"} />
                        : <PageHeaderLink headerTitle={"Screenshots"} />
                }
                <section className={"flex-1 py-8"}>
                    {/*<header className={"pad-x2 font-semibold h-5 lh-5"}>*/}
                    {/*    Upload Screenshots of your app*/}
                    {/*    /!*<span className={"d-block font-italic"}>You could upload this later</span>*!/*/}
                    {/*</header>*/}
                    {/*<section*/}
                    {/*    className={"flex flex-row flex-nowrap justify-start pad-x1 every:pct:w-25|h-120|mg-y2|pad-x1|bg-lighter|radius-sm"}>*/}
                    {/*    {*/}
                    {/*        appData?.screenshot?.length > 0*/}
                    {/*            ? appData?.screenshot.map((image, index) => (*/}
                    {/*                <>*/}
                    {/*                    <div key={index} className={"pad-x-2 bg-lighter radius-inherit"}>*/}
                    {/*                        <img src={image.image}*/}
                    {/*                             alt={`screenshot preview ${index}`} height={"100%"}*/}
                    {/*                             className={"pct:max-w-100 object-cover object-center radius-inherit"}/>*/}
                    {/*                    </div>*/}
                    {/*                    /!*<div className={"abs bottom-0 pct:w-100 bg-transparent"}></div>*!/*/}
                    {/*                </>*/}
                    {/*            ))*/}
                    {/*            : <div*/}
                    {/*                className={"align-self-center d-block pct:w-100 lh-normal bg-lighter gradient:to_bottom-whitesmoke-lightgray color-lightgray font-64 font-bold text-center"}>{appData?.name}</div>*/}
                    {/*    }*/}
                    {/*</section>*/}
                    {
                        updateAppScreenshotResponseData?.successful
                            ? <NotifSuccess message={updateAppScreenshotResponseData.message} />
                            : null
                    }
                    {
                        updateAppScreenshotResponseData?.error
                            ? <NotifError message={updateAppScreenshotResponseData.message} />
                            : null
                    }

                    {
                        appData?.screenshot?.length < 1
                            ? (
                                <>
                                    {
                                        appScreenshotsPreview.length < 1
                                            ? <label
                                                htmlFor={"id-app-screenshot-upload"}
                                                className={"flex flex-col justify-center items-center w-[96%] h-[160px] pct:w-96 h-160 border:2px_dashed_DDD mx-auto mb-4 rounded-xl bg-base-200 radius color-BBB dark:border:2px_dashed_darkgray"}>
                                                <span className="fa fa-plus text-4xl font-24 py-4"></span>
                                                <div>Select images to upload</div>
                                                <input
                                                    id={"id-app-screenshot-upload"}
                                                    type="file"
                                                    name={"screenshot"}
                                                    hidden
                                                    accept={"image/*"}
                                                    multiple
                                                    onChange={handleAppScreenshotSelect}
                                                />
                                            </label>
                                            : <section
                                                className={"flex flex-row flex-wrap justify-center gap-4 px-4 every:pct:w-48|h-320|mg-b2|bg-lighter|radius-sm dark:every:bg-222425"}>
                                                {
                                                    appScreenshotsPreview?.map((screenshot_obj, index) => (
                                                        <div key={index}
                                                            className={"h-[320px] rounded-xl bg-base-200 lg:hover:bg-base-100 transition-colors radius-inherit"}>
                                                            <img src={screenshot_obj}
                                                                alt={`screenshot preview ${index}`}
                                                                height={""}
                                                                className={"max-w-full h-full object-cover object-center rounded-xl radius-inherit"} />
                                                        </div>
                                                    ))
                                                }
                                                {
                                                    appScreenshotsPreview?.length > 0
                                                        ? new Array(4 - appScreenshotsPreview?.length).fill("").map((_, index) => (
                                                            <label key={index}
                                                                htmlFor={"id-app-screenshot-upload"}
                                                                className={"flex flex-col justify-center items-center flex-1 min-w-[240px] h-[320px] bg-base-200 lg:hover:bg-base-100 transition-colors text-center border:2px_dashed_DDD mx-auto rounded-xl radius color-999 decoration-none dark:border:2px_dashed_darkgray"}>
                                                                <span className="fa fa-plus text-4xl font-24 py-4"></span>
                                                                <input
                                                                    id={"id-app-screenshot-upload"}
                                                                    type="file"
                                                                    name={"screenshot"}
                                                                    hidden
                                                                    accept={"image/*"}
                                                                    multiple
                                                                    onChange={handleAppScreenshotSelect}
                                                                />
                                                            </label>
                                                        ))
                                                        : null
                                                }
                                            </section>
                                    }
                                </>
                            )
                            : <section
                                className={"flex flex-row flex-wrap justify-center gap-4 mx-auto px-4 md:grid md:grid-cols-3 lg:grid-cols-4 lg:grid-flow-row-dense lg:grid-rows-2 lg:gap-6 every:pct:w-48|h-320|mg-b2|bg-lighter|radius-sm dark:every:bg-222425"}>
                                {
                                    appData?.screenshot.map((screenshot_obj, index) => (
                                        <Link to={`${screenshot_obj?.id}`} key={index}
                                            className={"rounded-xl h-[320px] bg-base-200 lg:w-[320px] lg:h-[480px] lg:hover:bg-base-100 radius-inherit transition-colors"}>
                                            <img src={screenshot_obj?.image}
                                                alt={`screenshot preview ${index}`}
                                                height={""}
                                                className={"w-full max-w-full h-full object-cover object-center rounded-xl radius-inherit"} />
                                        </Link>
                                    ))
                                }
                                {
                                    appData?.screenshot.length > 0
                                        ? new Array(4 - appData?.screenshot.length).fill("").map((_, index) => (
                                            <Link
                                                key={index}
                                                to={"new"}
                                                className={"flex flex-col justify-center items-center flex-1 min-w-[240px] h-[320px] bg-base-200 lg:w-[320px] lg:h-[480px] lg:hover:bg-base-100 text-center border:2px_dashed_DDD mx-auto rounded-xl radius color-999 decoration-none dark:border:2px_dashed_darkgray"}>
                                                <span className="fa fa-plus text-4xl font-24 py-4"></span>
                                            </Link>
                                        ))
                                        : null
                                }
                            </section>
                    }

                </section>
                {
                    appData?.screenshot.length > 0 && appData?.screenshot.length < 4
                        ? <div
                            className={"sticky bottom-0 flex flex-col flex-nowrap justify-center items-center w-full mx-auto py-12 bg-white-solid dark:bg-base-300 every:h-7|lh-7|mg-x1|mg-y1|radius|text-center lg:pct:w-56 dark:bg-111314"}>
                            <Link
                                to={"new"}
                                className={"btn btn-wide block h-14 leading-[56px] bg-base-100 hover:bg-base-200 pct:min-w-40 lh-7 mx-auto px-6 bg-green color-white text-center radius decoration-none"}>
                                {"Add new Screenshots"}
                            </Link>
                        </div>
                        : null
                }
                {
                    appScreenshots.length > 0 && appScreenshots.length <= 4
                        ? <div
                            className={"sticky bottom-0 flex flex-col flex-nowrap justify-center items-center w-full mx-auto py-12 bg-white-solid every:h-7|lh-7|mg-x1|mg-y1|radius|text-center lg:pct:w-56 dark:bg-111314"}>
                            {/* <button
                                    type={"submit"}
                                    className={"block w-[40%] h-14 leading-[56px] pct:w-40 lh-7 mx-auto px-6 border-0 bg-green color-white text-center radius decoration-none"}
                                    onClick={showLoadingState}>
                                    {isSubmit ? <span className='fa fa-spinner fa-spin'></span> : "Save"}
                                </button> */}
                            <Button
                                type={"submit"}
                                classes={"btn-wide block mx-auto"}
                                onClick={showLoadingState}
                            >
                                {isSubmit ? <LoadingButton /> : "Save"}
                            </Button>
                        </div>
                        : null
                }
            </form>
        </section>
    )
}

const UpdateAppScreenshot = () => {
    return (
        <Outlet />
    )
}

export default UpdateAppScreenshot;