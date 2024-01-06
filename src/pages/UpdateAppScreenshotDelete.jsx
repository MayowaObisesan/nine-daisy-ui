import React, { useEffect, useState } from "react";
import { useLoaderData, useParams } from "react-router-dom";
import useFetch from "../hooks/useFetch";
import { PageHeaderLink } from "../components/Elements";
import axios from "axios";

const UpdateAppScreenshotDelete = (props) => {
    const { appNameId, screenshotId } = useParams();
    const { app } = useLoaderData();
    const appData = app?.data;
    // const [appData] = useFetch(`${process.env.REACT_APP_BASE_URL}/app/${appId}/`);
    const [isSubmit, setIsSubmit] = useState(false);
    const [appScreenshotDeletes, setAppScreenshotDeletes] = useState([]);
    const [appScreenshotDeletesPreview, setAppScreenshotDeletesPreview] = useState([]);
    const [updateAppScreenshotDeleteResponseData, setUpdateAppScreenshotDeleteResponseData] = useState({});

    useEffect(() => {
        console.log(appData?.screenshot)
        // setAppScreenshotDeletes(appData?.screenshot);
    }, [appData]);

    useEffect(() => {
        if (appScreenshotDeletesPreview.length < 4) {
            setAppScreenshotDeletesPreview(
                appScreenshotDeletes?.map((file) => URL.createObjectURL(file))
            );
        }
    }, [appScreenshotDeletes]);

    const handleAppScreenshotDeleteSelect = (event) => {
        const files = Array.from(event.target.files);
        setAppScreenshotDeletes([...appScreenshotDeletes, ...files]);
        // setAppScreenshotDeletesPreview(
        //     files.map((file) => URL.createObjectURL(file))
        // );
    };


    const showLoadingState = (e) => {
        setIsSubmit(true);
    };


    const updateScreenshotDeleteForm = (event) => {
        event.preventDefault();
        const formData = new FormData();
        // if (appImage) {
        //     formData.append("logo", appImage);
        // }
        appScreenshotDeletes.forEach((file, index) => {
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
                setIsSubmit(false);
                setUpdateAppScreenshotDeleteResponseData({
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
                setUpdateAppScreenshotDeleteResponseData({
                    message: errorMessage,
                    successful: false,
                    error: true
                });
                // reset the isSubmit loader
                setIsSubmit(false);
            });
    };

    return (
        <form onSubmit={updateScreenshotDeleteForm}>
            <PageHeaderLink headerTitle={"Delete Screenshot"} />
            <section className={"py-8"}>
                <header className={"px-4 font-semibold h-10 leading-10"}>
                    Delete screenshots of your app
                    {/*<span className={"d-block font-italic"}>You could upload this later</span>*/}
                </header>
                <section
                    className={"flex flex-row flex-nowrap justify-start px-2 every:pct:w-25|h-180|mg-y2|pad-x1|bg-lighter|radius-sm dark:every:bg-222425"}>
                    {
                        appData?.screenshot?.length > 0
                            ? appData?.screenshot.map((image, index) => (
                                <>
                                    <div key={index} className={"w-[25%] h-[180px] my-4 px-2 bg-base-100 rounded bg-lighter radius-inherit dark:bg-base-100"}>
                                        <img src={image.image}
                                            alt={`screenshot preview ${index}`} height={"100%"}
                                            className={"max-w-full h-full rounded pct:max-w-100 object-cover object-center radius-inherit"} />
                                    </div>
                                    {/*<div className={"abs bottom-0 pct:w-100 bg-transparent"}></div>*/}
                                </>
                            ))
                            : <div
                                className={"self-center block w-full leading-normal bg-base-100 pct:w-100 text-8xl lh-normal bg-lighter gradient:to_bottom-whitesmoke-lightgray color-lightgray font-64 font-bold text-center"}>{appData?.name}</div>
                    }
                </section>

                {
                    appScreenshotDeletesPreview?.length < 1
                        ? <label
                            htmlFor={"id-app-screenshot-upload"}
                            className={"flex flex-col justify-center items-center w-[96%] h-[160px] rounded-xl pct:w-96 h-160 border:2px_dashed_DDD mx-auto my-4 radius color-BBB dark:border:2px_dashed_darkgray"}>
                            <span className="fa fa-plus text-4xl font-24 py-4"></span>
                            <div>Select images to upload</div>
                            <input
                                id={"id-app-screenshot-upload"}
                                type="file"
                                name={"screenshot"}
                                hidden
                                accept={"image/*"}
                                multiple
                                onChange={handleAppScreenshotDeleteSelect}
                            />
                        </label>
                        : <section
                            className={"flex flex-row flex-wrap justify-start px-2 every:pct:w-50|h-320|mg-y2|pad-x1|bg-lighter|radius-sm dark:every:bg-222425"}>
                            {
                                appScreenshotDeletesPreview?.map((image, index) => (
                                    <div key={index} className={"w-[50%] h-[320px] my-4 bg-base-100 px-2 rounded radius-inherit dark:bg-base-100"}>
                                        <img src={image}
                                            alt={`screenshot preview ${index}`}
                                            height={"100%"}
                                            className={"max-w-full h-full rounded pct:max-w-100 object-cover object-center radius-inherit"} />
                                        <div onClick={() => { }}>remove</div>
                                    </div>
                                ))
                            }
                            {
                                new Array(4 - appScreenshotDeletesPreview?.length).fill("").map(() => (
                                    <label
                                        htmlFor={"id-app-screenshot-upload"}
                                        className={"flex flex-col justify-center items-center text-center border:2px_dashed_BBB mx-auto rounded radius color-555 dark:border:2px_dashed_darkgray"}>
                                        <span className="fa fa-plus text-4xl font-24 py-4"></span>
                                        <input
                                            id={"id-app-screenshot-upload"}
                                            type="file"
                                            name={"screenshot"}
                                            hidden
                                            accept={"image/*"}
                                            multiple
                                            onChange={handleAppScreenshotDeleteSelect}
                                        />
                                    </label>
                                ))
                            }
                        </section>
                }
            </section>
        </form>

    )
}

export default UpdateAppScreenshotDelete;