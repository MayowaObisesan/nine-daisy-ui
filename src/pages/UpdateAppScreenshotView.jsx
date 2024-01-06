import React, { useEffect, useRef, useState } from "react";
import { Link, useLoaderData, useParams } from "react-router-dom";
import useFetch from "../hooks/useFetch";
import { Button, LoadingButton, NotifError, NotifSuccess, PageHeaderLink } from "../components/Elements";
import axios from "axios";
import { deviceWidthEnum } from "../helpers/utils";
import { useDeviceSize } from "../hooks/useDeviceSize";
import { CloseIcon } from "../assets";

const UpdateAppScreenshotView = (props) => {
    const size = useDeviceSize();
    const { appNameId, screenshotId } = useParams();
    const { app } = useLoaderData()
    const appData = app?.data;
    // const [appData] = useFetch(`${process.env.REACT_APP_BASE_URL}/app/${appId}/`);
    const [appScreenshotData] = useFetch(`${process.env.REACT_APP_BASE_URL}/app/screenshot/${screenshotId}/`);
    const [isDeleteSubmit, setIsDeleteSubmit] = useState(false);
    const [isReplaceSubmit, setIsReplaceSubmit] = useState(false);
    const [appScreenshotViews, setAppScreenshotViews] = useState([]);
    const [appScreenshotViewsPreview, setAppScreenshotViewsPreview] = useState([]);
    const [updateAppScreenshotViewResponseData, setUpdateAppScreenshotViewResponseData] = useState({});
    // const { windowWidth, screenWidth, deviceWidthEnum } = useDeviceWidth();
    const deleteScreenshotModal = useRef(null);

    useEffect(() => {
        console.log(appData?.screenshot)
        // setAppScreenshotViews(appData?.screenshot);
    }, [appData]);

    useEffect(() => {
        if (appScreenshotViewsPreview.length < 4) {
            setAppScreenshotViewsPreview(
                appScreenshotViews?.map((file) => URL.createObjectURL(file))
            );
        }
    }, [appScreenshotViews]);

    const handleAppScreenshotViewSelect = (event) => {
        const files = Array.from(event.target.files);
        setAppScreenshotViews([...appScreenshotViews, ...files]);
        // setAppScreenshotViewsPreview(
        //     files.map((file) => URL.createObjectURL(file))
        // );
    };


    const showDeleteLoadingState = (e) => {
        setIsDeleteSubmit(true);
    };

    const showReplaceLoadingState = (e) => {
        setIsReplaceSubmit(true);
    };


    const updateScreenshotViewForm = (event) => {
        event.preventDefault();
        const formData = new FormData();
        // if (appImage) {
        //     formData.append("logo", appImage);
        // }
        appScreenshotViews.forEach((file, index) => {
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
                setUpdateAppScreenshotViewResponseData({
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
                setUpdateAppScreenshotViewResponseData({
                    message: errorMessage,
                    successful: false,
                    error: true
                });
                // reset the isSubmit loader
                setIsReplaceSubmit(false);
            });
    };

    const handleScreenshotDelete = (event) => {
        event.preventDefault();
        const formData = new FormData();
        // if (appImage) {
        //     formData.append("logo", appImage);
        // }
        // appScreenshotViews.forEach((file, index) => {
        //     // formData.append(`images[${index}]`, file)
        //     formData.append(`screenshots`, file)
        // });
        const updateAppURL = `${process.env.REACT_APP_BASE_URL}/app/screenshot/${screenshotId}/delete/`;
        const headers = {
            'Accept': '*/*',
            // 'Origin': '*',
            'Authorization': `Bearer ${window.localStorage.getItem('nine_login')}`
        };
        const fetchConfig = {
            method: 'DELETE',
            headers: headers,
            mode: 'cors',
            // body: formData,
            cache: 'default',
        };
        // fetch(updateAppURL, fetchConfig)
        axios(updateAppURL, fetchConfig)
            .then(response => {
                if (response.status !== 200) throw response;
                // return response.json()
                return response.json()
            })
            .then(data => {
                setIsDeleteSubmit(false);
                setUpdateAppScreenshotViewResponseData({
                    message: "App screenshot delete successful",
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
                //     error_message = "Unable to delete your screenshot"
                // }
                const errorMessage = error.response?.data.error || "Unable to process request";
                setUpdateAppScreenshotViewResponseData({
                    message: errorMessage,
                    successful: false,
                    error: true
                });
                // reset the isSubmit loader
                setIsDeleteSubmit(false);
            });
    };

    return (
        <section className={"flex flex-row flex-nowrap justify-start w-full h-screen dark:bg-111314"}>
            {/* {
                size.windowWidth >= deviceWidthEnum.laptop
                    ? <section className={"w-[20%] h-screen bg-base-100 pct:w-20 vh:h-100 bg-lighter dark:bg-base-300 dark:bg-000304 dark:every:color-whitesmoke"}>
                        <div
                            className={"flex flex-col justify-center items-start text-xl font-18 lh-normal w-full h-[160px] pct:w-100 h-160 px-8 lg:text-2xl lg:font-24"}>
                            <div className={"font-size-inherit"}>Update</div>
                            <div className={"font-size-inherit font-bold color-gray"}>{appData?.name}</div>
                        </div>
                        <section className={"block every:d-block|pad-4|radius|decoration-none|color-initial hover:every:bg-light dark:every:color-whitesmoke dark:hover:every:bg-222425"}>
                            <button className={"block w-full p-8 rounded-xl decoration-0 hover:bg-base-200 dark:hover:bg-base-300 pct:w-100 text-left border-0 bg-initial cursor-pointer"} onClick={() => { window.history.back() }}>View Screenshots</button>
                            <Link to={`${window.location.pathname.split("/").slice(0, window.location.pathname.split("/").length-1).join("/")}/`}>Screenshots</Link>
                        </section>
                    </section>
                    : null
            } */}
            <form onSubmit={updateScreenshotViewForm} className={"flex flex-col w-full l:w-[56%] lg:mr-auto pct:w-100 lg:pct:w-56|mg-r-auto|mg-t8"}>
                <PageHeaderLink />
                <section className={"flex-1 flex flex-col lg:w-full lg:pct:w-100"}>
                    {/*<header className={"pad-x2 font-semibold h-5 lh-5"}>*/}
                    {/*    /!*Upload ScreenshotViews of your app*!/*/}
                    {/*    /!*<span className={"d-block font-italic"}>You could upload this later</span>*!/*/}
                    {/*</header>*/}
                    {
                        updateAppScreenshotViewResponseData?.successful
                            // ? <div
                            //     className="relative mx-auto text-center w-[64%] py-4 rounded pct:w-64 pad-y2 radius-sm bg-green-inverse color-green">
                            //     {updateAppScreenshotViewResponseData.message}
                            // </div>
                            ? <NotifSuccess message={updateAppScreenshotViewResponseData.message} />
                            : null
                    }
                    {
                        updateAppScreenshotViewResponseData?.error
                            // ? <div
                            //     className="relative mg-x-auto text-center pct:w-64 pad-y2 radius-sm bg-red-inverse color-red">
                            //     {updateAppScreenshotViewResponseData.message}
                            // </div>
                            ? <NotifError message={updateAppScreenshotViewResponseData.message} />
                            : null
                    }
                    <section className={"flex-1 pt-8 pb-4 bg-white-solid dark:bg-111314"}>
                        {
                            appScreenshotData?.image
                                ? <img src={appScreenshotData?.image}
                                    alt={`${appData?.name} Screenshot`}
                                    height={"480"}
                                    // width={"80%"}
                                    className={"block max-w-[80%] h-[480px] lg:h-[480px] pct:w-80 pct:max-w-80 mx-auto rounded-xl radius object-cover object-center"}
                                />
                                : <div
                                    className={"flex flex-col justify-center items-center w-[80%] max-w-[80%] h-[480px] pct:w-80 pct:max-w-80 h-480 mx-auto text-center rounded-xl border:2px_dashed_DDD radius color-999 hover:cursor-pointer transition:all_200ms_ease dark:bg-222425 dark:border:0px_solid_darkgray dark:hover:bg-333435 dark:bg-base-200 dark:hover:bg-base-100 transition-colors"}>
                                    <span className="fa fa-plus text-3xl lg:text-4xl font-28 pad-y2"></span>
                                </div>
                        }
                        <div
                            className={"flex flex-row flex-nowrap justify-center w-[80%] pct:w-80 mx-auto my-4 px-2 bg-white-solid every:pct:w-25|h-96|mg-y2|pad-x1|bg-lighter|radius-sm dark:bg-111314 dark:every:bg-222425 dark:bg-base-300"}>
                            {
                                appScreenshotData?.image && appData?.screenshot?.length > 0
                                    ? appData?.screenshot.filter(item => item.id !== appScreenshotData?.id).map((screenshot_obj, index) => (
                                        <>
                                            <Link
                                                key={index}
                                                to={screenshot_obj?.id}
                                                // to={`${window.location.pathname.split("/").slice(0, window.location.pathname.split("/").length - 1).join("/")}/${screenshot_obj?.id}`}
                                                className={"h-[96px] rounded-xl radius-inherit"}>
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
                    <div className={"sticky bottom-0 flex flex-row flex-nowrap justify-center items-center gap-x-8 w-full pct:w-100 mx-auto mt-4 px-20 py-8 border:0px_solid_lightgray border-t-0 bg-white-solid every:h-6|lh-6|mg-x1|mg-y1|radius|text-center lg:pct:w-56|border-0 dark:bg-inherit lg:w-[56%]"}>
                        <Link to={"replace"} type={"button"} className={"flex-1 btn bg-base-100 hover:bg-base-200 transition-colors w-[60%] pct:w-60 border:2px_solid_lightgray decoration-none color-initial transition:all_200ms_ease dark:bg-222425|color-whitesmoke dark:border:0px_solid_darkgray dark:hover:bg-333435"}>
                            {"Replace"}
                        </Link>
                        {/* <button type={"button"} className={"pct:w-30 border-0 bg-red color-white hover:cursor-pointer disabled:bg-red-inverse"} onClick={handleScreenshotDelete}>
                            {isDeleteSubmit ? <span className='fa fa-spinner fa-spin'></span> : "Delete"}
                        </button> */}
                        <Button
                            classes={"w-28 btn-error font-bold lg:w-32"}
                            onClick={() => deleteScreenshotModal.current.showModal()}
                        >
                            {"Delete"}
                        </Button>
                        {/* Open the modal using document.getElementById('ID').showModal() method */}
                        <dialog id="delete-screenshot-modal" className="modal" ref={deleteScreenshotModal}>
                            <div className="modal-box text-center space-y-6">
                                <h3 className="font-bold text-2xl">Delete Screenshot</h3>
                                <p className="py-4 bg-base-100 rounded-xl text-lg">
                                    Your Screenshot will be permanently deleted.
                                    <p className="">Do you want to Proceed?</p>
                                </p>
                                <Button
                                    classes={"btn-error font-bold text-lg my-4"}
                                    onClick={handleScreenshotDelete}
                                >
                                    {isDeleteSubmit ? <LoadingButton>Deleting...</LoadingButton> : "Yes. I want to Delete this screenshot"}
                                </Button>
                                <div className="modal-action justify-center absolut -top-4 right-2">
                                    <form method="dialog">
                                        {/* if there is a button in form, it will close the modal */}
                                        <button className="btn text-lg">
                                            {/* <CloseIcon width={"20"} height={"20"} /> */}
                                            No, don't delete
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </dialog>
                    </div>
                </section>
            </form>
        </section>
    )
}

export default UpdateAppScreenshotView;