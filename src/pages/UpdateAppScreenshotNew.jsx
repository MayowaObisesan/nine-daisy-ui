import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import useFetch from "../hooks/useFetch";
import { Button, LoadingButton, NotifError, NotifSuccess, PageHeaderLink } from "../components/Elements";
import axios from "axios";
import { useDeviceSize } from "../hooks/useDeviceSize";
import { deviceWidthEnum } from "../helpers/utils";

const UpdateAppScreenshotNew = (props) => {
    const { appNameId } = useParams();
    // const { windowWidth, screenWidth, deviceWidthEnum } = useDeviceWidth();
    const size = useDeviceSize();
    const [appData] = useFetch(`${process.env.REACT_APP_BASE_URL}/app/${appNameId}/`);
    const [isSubmit, setIsSubmit] = useState(false);
    const [appScreenshotNew, setAppScreenshotNew] = useState([]);
    const [appScreenshotNewPreview, setAppScreenshotNewPreview] = useState([]);
    const [updateAppScreenshotNewResponseData, setUpdateAppScreenshotNewResponseData] = useState({});

    useEffect(() => {
        if (appScreenshotNewPreview.length < 4) {
            setAppScreenshotNewPreview(
                appScreenshotNew?.map((file) => URL.createObjectURL(file))
            );
        }
    }, [appScreenshotNew]);

    const handleAppScreenshotNewSelect = (event) => {
        const files = Array.from(event.target.files);
        setAppScreenshotNew(files);
        // setAppScreenshotNewPreview(
        //     files.map((file) => URL.createObjectURL(file))
        // );
    };

    const showLoadingState = (e) => {
        setIsSubmit(true);
    };

    const handleScreenshotSave = (event) => {
        event.preventDefault();
        const formData = new FormData();
        appScreenshotNew.forEach((file, index) => {
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
                if (response.status !== 200) throw response;
                // return response.json()
                return response.data
            })
            .then(data => {
                setIsSubmit(false);
                setUpdateAppScreenshotNewResponseData({
                    message: "Screenshot upload successful",
                    successful: true,
                    error: false
                });
                setTimeout(() => window.history.back(), 800);
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
                //     error_message = "We couldn't upload your screenshot. Kindly retry"
                // }
                const errorMessage = error.response?.data.error || "Unable to process request";
                setUpdateAppScreenshotNewResponseData({
                    message: errorMessage,
                    successful: false,
                    error: true
                });
                // reset the isSubmit loader
                setIsSubmit(false);
            });

    };
    return (
        <section className={"flex flex-row flex-nowrap justify-start w-full h-screen dark:bg-111314"}>
            {/* {
                size.windowWidth >= deviceWidthEnum.laptop
                    ? <section className={"w-[20%] h-screen pct:w-20 vh:h-100 bg-lighter dark:bg-000304 dark:every:color-whitesmoke"}>
                        <div
                            className={"flex flex-col justify-center items-start text-2xl font-18 lh-normal w-full h-[160px] pct:w-100 h-160 pad-x4 lg:font-24"}>
                            <div className={"font-size-inherit"}>Update</div>
                            <div className={"font-size-inherit font-bold color-gray"}>{appData?.name}</div>
                        </div>
                        <section className={"block every:d-block|pad-4|radius|decoration-none|color-initial hover:every:bg-light dark:every:color-whitesmoke dark:hover:every:bg-222425"}>
                            <button className={"pct:w-100 text-left border-0 bg-initial cursor-pointer"} onClick={() => {window.history.back()}}>View Screenshots</button>
                            <Link
                                to={`${window.location.pathname.split("/").slice(0, window.location.pathname.split("/").length - 1).join("/")}/`}
                                className={"block p-8 rounded-xl decoration-0 hover:bg-base-200 dark:hover:bg-base-100"}
                            >
                                View Screenshots
                            </Link>
                        </section>
                    </section>
                    : null
            } */}
            <form encType={"multipart/form-data"} onSubmit={handleScreenshotSave} className={"flex flex-col w-full l:w-[56%] lg:mr-auto pct:w-100 lg:pct:w-56|mg-r-auto|mg-t8"}>
                <PageHeaderLink />
                <section className={"flex-1 flex flex-col lg:w-full"}>
                    {/*<header className={"pad-x2 font-semibold h-5 lh-5"}>*/}
                    {/*    /!*Upload ScreenshotNews of your app*!/*/}
                    {/*    /!*<span className={"d-block font-italic"}>You could upload this later</span>*!/*/}
                    {/*</header>*/}
                    {
                        updateAppScreenshotNewResponseData?.successful
                            // ? <div
                            //     className="relative mx-auto text-center w-[64%] px-4 py-4 rounded-md pct:w-64 pad-x2 pad-y2 radius-sm bg-green-inverse color-green">
                            //     {updateAppScreenshotNewResponseData.message}
                            // </div>
                            ? <NotifSuccess message={updateAppScreenshotNewResponseData.message} />
                            : null
                    }
                    {
                        updateAppScreenshotNewResponseData?.error
                            // ? <div
                            //     className="relative mg-x-auto text-center pct:w-64 pad-x2 pad-y2 radius-sm bg-red-inverse color-red">
                            //     {updateAppScreenshotNewResponseData.message}
                            // </div>
                            ? <NotifError message={updateAppScreenshotNewResponseData.message} />
                            : null
                    }
                    <section className={"flex-1 pt-8 pb-4 bg-white-solid dark:bg-111314"}>
                        {
                            appScreenshotNewPreview?.length < 1
                                ? <label
                                    htmlFor={"id-app-screenshot-upload"}
                                    className={"flex flex-col justify-center items-center w-[80%] max-w-[80%] h-[480px] rounded-xl pct:w-80 pct:max-w-80 h-480 mx-auto text-center border:2px_dashed_DDD radius color-999 hover:cursor-pointer dark:bg-base-200 dark:bg-222425 dark:border:0px_solid_darkgray dark:hover:bg-base-100 dark:hover:bg-333435"}>
                                    <span className="fa fa-plus text-3xl lg:text-4xl font-28 py-4"></span>
                                    <input
                                        id={"id-app-screenshot-upload"}
                                        type="file"
                                        name={"screenshot"}
                                        hidden
                                        accept={"image/*"}
                                        multiple
                                        onChange={handleAppScreenshotNewSelect}
                                    />
                                </label>
                                : <>
                                    <img src={appScreenshotNewPreview[0]}
                                        alt={"new Screenshot"}
                                        height={"480"}
                                        // width={"80%"}
                                        className={"block h-[480px] max-w-[80%] mx-auto rounded-xl pct:w-80 pct:max-w-80 mg-x-auto radius object-cover object-center"}
                                    />
                                    <label
                                        htmlFor={"id-app-screenshot-upload"}
                                        className={"flex flex-row justify-center items-center max-w-[80%] btn btn-wide dark:bg-base-100 dark:hover:bg-base-200 pct:w-80 pct:max-w-80 mx-auto my-8 rounded-xl text-center border:1px_dashed_BBB radius color-999 dark:border:0px_solid_darkgray"}>
                                        <span className="fa fa-plus p-2"></span>
                                        <div>{"Select another image"}</div>
                                        <input
                                            id={"id-app-screenshot-upload"}
                                            type="file"
                                            name={"screenshot"}
                                            hidden
                                            accept={"image/*"}
                                            multiple
                                            onChange={handleAppScreenshotNewSelect}
                                        />
                                    </label>
                                </>
                        }
                        <div
                            className={"flex flex-row flex-nowrap justify-center items-center gap-x-4 w-[80%] pct:w-80 mx-auto my-4 px-2 bg-white-solid every:pct:w-25|h-96|mg-y2|pad-x1|bg-lighter|radius-sm dark:bg-111314 dark:every:bg-222425"}>
                            {/* <div>Existing Screenshots</div> */}
                            {
                                appData?.screenshot?.length > 0
                                    ? appData?.screenshot.map((screenshot_obj, index) => (
                                        <>
                                            <Link
                                                key={index}
                                                to={`../${screenshot_obj?.id}`}
                                                // to={`${window.location.pathname.split("/").slice(0, window.location.pathname.split("/").length - 1).join("/")}/${screenshot_obj?.id}`}
                                                className={"h-[96px] my-4 bg-base-100 rounded radius-inherit dark:bg-base-100"}>
                                                <img src={screenshot_obj?.image}
                                                    alt={`screenshot preview ${index}`}
                                                    height={""}
                                                    className={"max-w-full w-full h-full rounded-md pct:max-w-100 pct:w-100 object-cover object-center radius-inherit"} />
                                            </Link>
                                            {/*<div className={"abs bottom-0 pct:w-100 bg-transparent"}></div>*/}
                                        </>
                                    ))
                                    : null
                            }
                        </div>
                    </section>
                    <div className={"sticky bottom-0 flex flex-col flex-nowrap justify-center items-center w-full mx-auto mt-2 py-12 pct:w-100 border:0px_solid_lightgray border-t-0 bg-white-solid every:h-7|lh-7|mg-x1|mg-y1|radius|text-center lg:pct:w-56|border-0 dark:bg-inherit"}>
                        {/* <button
                            type={"submit"}
                            className={"pct:w-60 border-0 bg-green color-white disabled:bg-green-inverse"}
                            onClick={showLoadingState}
                            disabled={appScreenshotNew.length < 1}
                        >
                            {isSubmit ? <span className='fa fa-spinner fa-spin'></span> : "Save"}
                        </button> */}
                        <Button
                            type={"submit"}
                            classes={"btn-wide block mx-auto"}
                            disabled={appScreenshotNew.length < 1}
                            onClick={showLoadingState}
                        >
                            {isSubmit ? <LoadingButton /> : "Save"}
                        </Button>
                    </div>
                </section>
            </form>
        </section>
    )
}

export default UpdateAppScreenshotNew;