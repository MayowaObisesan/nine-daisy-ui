import { FormFields } from "./CreateForm";
import React, { useState } from "react";
import { useLoaderData, useParams } from "react-router-dom";
import useFetch from "../hooks/useFetch";
import { Button, LoadingButton, NotifError, NotifSuccess, PageHeaderLink, TextInput } from "../components/Elements";
// import { useDeviceWidth } from "./useDeviceWidth";
import { AppDetailLeftNav } from "./UpdateAppDetail";
import axios from "axios";
import { useDeviceSize } from "../hooks/useDeviceSize";
import { deviceWidthEnum } from "../helpers/utils";
import { FormField, LabelField } from "../components/Forms";

const UpdateAppDownloadLinks = () => {
    const { appNameId } = useParams();
    const { app } = useLoaderData();
    const appData = app?.data;
    // const { windowWidth, screenWidth, deviceWidthEnum } = useDeviceWidth();
    const size = useDeviceSize();
    // const [appData] = useFetch(`${process.env.REACT_APP_BASE_URL}/app/${appId}/`);
    const [isSubmit, setIsSubmit] = useState(false);
    const [updateAppDownloadLinksData, setUpdateAppDownloadLinksData] = useState({});
    const [updateAppDownloadLinksResponseData, setUpdateAppDownloadLinksResponseData] = useState({});

    const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setUpdateAppDownloadLinksData(values => (
            { ...values, [name]: value }
        ));
    }

    const showLoadingState = (e) => {
        setIsSubmit(true);
    };

    const updateDownloadLinksForm = (event) => {
        event.preventDefault();
        const formData = new FormData();
        if (updateAppDownloadLinksData?.playstore_link) {
            formData.append("playstore_link", updateAppDownloadLinksData?.playstore_link);
        }
        if (updateAppDownloadLinksData?.appstore_link) {
            formData.append("appstore_link", updateAppDownloadLinksData?.appstore_link);
        }
        if (updateAppDownloadLinksData?.external_link) {
            formData.append("external_link", updateAppDownloadLinksData?.external_link);
        }

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
                if (response.status !== 200) throw Error(response.error);
                // return response.json()
                return response.data;
            })
            .then(data => {
                setIsSubmit(false);
                setUpdateAppDownloadLinksResponseData({
                    message: "App update successful",
                    successful: true,
                    error: false
                });
            })
            .catch((error) => {
                let error_message;
                if (error.status === 401) {
                    error_message = "Kindly login to update your Profile"
                } else if (error.status === 400) {
                    error_message = "Unable to perform update. Kindly fix any form errors and re-submit"
                } else if (error.status === 500) {
                    error_message = "Check your internet connection"
                } else {
                    // There is no network connection or the Server is not up.
                    error_message = "Network Error"
                }
                setUpdateAppDownloadLinksResponseData({
                    message: error_message,
                    successful: false,
                    error: true
                });
                // reset the isSubmit loader
                setIsSubmit(false);
            });
    };

    return (
        <section className={"flex flex-row flex-nowrap justify-start w-full h-screen pct:h-100 dark:bg-111314"}>
            {/* {
                size.windowWidth >= deviceWidthEnum.laptop
                    ? <AppDetailLeftNav appName={appData?.name} pageName={"Download-links"} />
                    : null
            } */}
            <form action={""} method={"PATCH"} onSubmit={updateDownloadLinksForm} className={"flex flex-col w-full l:w-[56%] lg:mr-auto pct:w-100 lg:pct:w-56|mg-r-auto|mg-t8"}>
                {
                    size.windowWidth < deviceWidthEnum.laptop
                        ? <PageHeaderLink headerTitle={"Update download links"} />
                        : <PageHeaderLink headerTitle={"Download links"} />
                }
                {
                    updateAppDownloadLinksResponseData?.successful
                        // ? <div
                        //     className="relative mx-auto text-center pct:w-64 py-4 rounded radius-sm bg-green-inverse color-green">
                        //     {updateAppDownloadLinksResponseData.message}
                        // </div>
                        ? <NotifSuccess message={updateAppDownloadLinksResponseData.message} />
                        : null
                }
                {
                    updateAppDownloadLinksResponseData?.error
                        // ? <div
                        //     className="relative mg-x-auto text-center pct:w-64 pad-y2 radius-sm bg-red-inverse color-red">
                        //     {updateAppDownloadLinksResponseData.message}
                        // </div>
                        ? <NotifError message={updateAppDownloadLinksResponseData.message} />
                        : null
                }

                <section className={"px-4 space-y-10 flex-1"}>
                    <FormField>
                        <LabelField text={"Play Store"}>
                            <TextInput
                                type={"url"}
                                id={"id-new-app-playstore-link"}
                                name={"playstore_link"}
                                defaultValue={appData?.playstore_link}
                                placeholder={"PlayStore download link"}
                                onChange={handleChange}
                            />
                        </LabelField>
                    </FormField>
                    <FormField>
                        <LabelField text={"AppStore"}>
                            <TextInput
                                type={"url"}
                                id={"id-new-app-appstore-link"}
                                name={"appstore_link"}
                                defaultValue={appData?.appstore_link}
                                placeholder={"AppStore download link"}
                                onChange={handleChange}
                            />
                        </LabelField>
                    </FormField>
                    <FormField>
                        <LabelField text={"Other Store"}>
                            <TextInput
                                type={"url"}
                                id={"id-new-app-external-link"}
                                name={"external_link"}
                                defaultValue={appData?.external_link}
                                placeholder={"Link to other Store download link"}
                                onChange={handleChange}
                            />
                        </LabelField>
                    </FormField>
                </section>

                {/* <FormFields
                    useDefaultInput
                    type={"url"}
                    label_value={"Play Store"}
                    id={"id-new-app-playstore-link"}
                    name={"playstore_link"}
                    defaultValue={appData?.playstore_link}
                    placeholder={"PlayStore download link"}
                    onChange={handleChange}
                >
                </FormFields>

                <FormFields
                    useDefaultInput
                    type={"url"}
                    id={"id-new-app-appstore-link"}
                    name={"appstore_link"}
                    defaultValue={appData?.appstore_link}
                    label_value={"AppStore"}
                    placeholder={"AppStore download link"}
                    onChange={handleChange}
                >
                </FormFields>

                <FormFields
                    useDefaultInput
                    type={"url"}
                    id={"id-new-app-external-link"}
                    name={"external_link"}
                    defaultValue={appData?.external_link}
                    label_value={"Other Store"}
                    placeholder={"Link to other Store download link"}
                    onChange={handleChange}
                >
                </FormFields> */}


                <div className={"sticky bottom-0 py-12 w-full mx-auto bg-white-solid dark:bg-111314 l:w-[56%]"}>
                    {/* <button
                        type={"submit"}
                        className={"d-block pct:w-64 max-w-480 h-7 lh-7 mg-x-auto pad-x2 border-0 bg-green color-white radius decoration-none cursor-pointer disabled:bg-green-inverse disabled:cursor-not-allowed"}
                        disabled={!(updateAppDownloadLinksData?.playstore_link || updateAppDownloadLinksData?.appstore_link || updateAppDownloadLinksData?.external_link)}
                        onClick={showLoadingState}
                    >
                        {isSubmit ? <span className='fa fa-spinner fa-spin'></span> : "Save"}
                    </button> */}
                    <Button
                        type={"submit"}
                        classes={"btn-wide block mx-auto"}
                        disabled={!(updateAppDownloadLinksData?.playstore_link || updateAppDownloadLinksData?.appstore_link || updateAppDownloadLinksData?.external_link)}
                        onClick={showLoadingState}
                    >
                        {isSubmit ? <LoadingButton /> : "Save"}
                    </Button>
                </div>
            </form>
        </section>
    );
}

export default UpdateAppDownloadLinks;