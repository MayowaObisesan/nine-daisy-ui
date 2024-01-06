import { FormFields } from "./CreateForm";
import React, { useState } from "react";
import { useLoaderData, useParams } from "react-router-dom";
import useFetch from "../hooks/useFetch";
import { Button, LoadingButton, NotifError, NotifSuccess, PageHeaderLink, TextArea, TextInput } from "../components/Elements";
// import { useDeviceWidth } from "./useDeviceWidth";
import { AppDetailLeftNav } from "./UpdateAppDetail";
import axios from "axios";
import { useDeviceSize } from "../hooks/useDeviceSize";
import { deviceWidthEnum } from "../helpers/utils";
import { FormField, LabelField } from "../components/Forms";

const UpdateAppBasicInfo = () => {
    const { appNameId } = useParams();
    console.log(appNameId);
    const { app } = useLoaderData();
    const appData = app?.data;
    // const { size.windowWidth, screenWidth, deviceWidthEnum } = useDeviceWidth();
    const size = useDeviceSize();
    // const [appData] = useFetch(`${process.env.REACT_APP_BASE_URL}/app/${id}/`);
    const [isSubmit, setIsSubmit] = useState(false);
    const [updateAppBasicInfoData, setUpdateAppBasicInfoData] = useState({});
    const [updateAppBasicInfoResponseData, setUpdateAppBasicInfoResponseData] = useState({});

    const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setUpdateAppBasicInfoData(values => (
            { ...values, [name]: value }
        ));
    }

    const showLoadingState = (e) => {
        setIsSubmit(true);
    };

    const updateBasicInfoForm = (event) => {
        event.preventDefault();
        const formData = new FormData();
        if (updateAppBasicInfoData?.name) {
            formData.append("name", updateAppBasicInfoData?.name);
        }
        if (updateAppBasicInfoData?.description) {
            formData.append("description", updateAppBasicInfoData?.description);
        }
        if (updateAppBasicInfoData?.version) {
            formData.append("version", updateAppBasicInfoData?.version);
        }
        if (updateAppBasicInfoData?.website) {
            formData.append("website", updateAppBasicInfoData?.website);
        }

        const updateAppURL = `${process.env.REACT_APP_BASE_URL}/app/${appNameId}/`;
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
        // fetch(updateAppURL, fetchInit)
        axios(updateAppURL, fetchInit)
            .then(response => {
                if (response.status !== 200) throw Error(response.error);
                // response.json()
                return response.data
            })
            .then(data => {
                setIsSubmit(false);
                setUpdateAppBasicInfoResponseData({
                    message: "App info update successful",
                    successful: true,
                    error: false
                });
            })
            .catch((error) => {
                let errorMessage = error.response?.data.error || "Unable to process request";
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
                setUpdateAppBasicInfoResponseData({
                    message: errorMessage,
                    successful: false,
                    error: true
                });
                // reset the isSubmit loader
                setIsSubmit(false);
            });
    };

    return (
        <section className={"flex flex-row flex-nowrap justify-start w-full h-screen pct:w-100 dark:bg-111314"}>
            {/* {
                size.windowWidth >= deviceWidthEnum.laptop
                    ? <AppDetailLeftNav appName={appData?.name} pageName={"Basic-info"} />
                    : null
            } */}
            <form action={""} method={"PATCH"} onSubmit={updateBasicInfoForm} className={"flex flex-col w-full pct:w-100 l:w-[56%] lg:mr-auto lg:pct:w-56|mg-r-auto|mg-t8"}>
                {
                    size.windowWidth < deviceWidthEnum.laptop
                        ? <PageHeaderLink headerTitle={"Update basic info"} />
                        : <PageHeaderLink headerTitle={"Basic info"} />
                }
                {
                    updateAppBasicInfoResponseData?.successful
                        // ? <div
                        //     className="sticky px:top-80 mg-x-auto text-center pct:w-64 pad-y2 radius-sm bg-green-inverse color-green">
                        //     {updateAppBasicInfoResponseData.message}
                        // </div>
                        ? <NotifSuccess>
                            {updateAppBasicInfoResponseData.message}
                        </NotifSuccess>
                        : null
                }
                {
                    updateAppBasicInfoResponseData?.error
                        // ? <div
                        //     className="sticky px:top-80 mg-x-auto text-center pct:w-64 pad-y2 radius-sm bg-red-inverse color-red">
                        //     {updateAppBasicInfoResponseData.message}
                        // </div>
                        ? <NotifError>
                            {updateAppBasicInfoResponseData.message}
                        </NotifError>
                        : null
                }

                {/* <FormFields
                    useDefaultInput
                    label_value={"App name"}
                    id={"id-app-name"}
                    name={"name"}
                    defaultValue={appData?.name}
                    placeholder={"Your app name"}
                    onChange={handleChange}
                >
                </FormFields> */}
                <section className="space-y-10 px-4 flex-1">
                    <FormField>
                        <LabelField text={"App name"}>
                            <TextInput
                                type={"text"}
                                name={"name"}
                                defaultValue={appData?.name}
                                placeholder={"Your app name"}
                                onChange={handleChange}
                            />
                        </LabelField>
                    </FormField>

                    {/* <div className="form-input-fields flex flex-column align-items-start pad-x2 pad-y1 dark:color-whitesmoke">
                    <label htmlFor="id-new-app-description" className="pad-y1">Description</label>
                    <textarea name="description" id="id-new-app-description"
                        cols="30" rows="10"
                        className="pct:w-100 h2-2 pad-x2 pad-y2 mg-y1 outline:1px_solid_transparent border:1px_solid_BBB outline-offset-2 focus:outline:2px_solid_gray transition:outline_80ms_ease radius-smr font-family-inherit resize-none dark:bg-222425|border:1px_solid_000304|color-whitesmoke dark:focus:outline:3px_solid_444445"
                        defaultValue={appData?.description}
                        placeholder="Describe your App"
                        onChange={handleChange}
                    />
                    <span className=""></span>
                </div> */}

                    <FormField>
                        <LabelField text={"Description"}>
                            <TextArea
                                id="id-new-app-description"
                                name="description"
                                cols="30"
                                rows="10"
                                required={true}
                                placeholder="Write about your app in few words."
                                defaultValue={appData?.description}
                                onChange={handleChange}
                                maxLength={120}
                            />
                        </LabelField>
                    </FormField>

                    {/* <FormFields
                    useDefaultInput
                    label_value={"Version"}
                    id={"id-app-version"}
                    name={"version"}
                    defaultValue={appData?.version}
                    placeholder={"Your app's version"}
                    onChange={handleChange}
                >
                </FormFields> */}
                    <FormField>
                        <LabelField text={"Version"}>
                            <TextInput
                                type={"text"}
                                name={"version"}
                                defaultValue={appData?.version}
                                placeholder={"Your app's version"}
                                onChange={handleChange}
                            />
                        </LabelField>
                    </FormField>

                    {/* <FormFields
                    useDefaultInput={true}
                    label_value={"App website"}
                    id={"id-new-app-website"}
                    name={"website"}
                    defaultValue={appData?.website}
                    placeholder={"Your app's website or landing page"}
                    onChange={handleChange}
                >
                </FormFields> */}
                    <FormField>
                        <LabelField text={"App website"}>
                            <TextInput
                                type={"text"}
                                name={"website"}
                                defaultValue={appData?.website}
                                placeholder={"Your app's website or landing page"}
                                onChange={handleChange}
                            />
                        </LabelField>
                    </FormField>
                </section>

                <div className={"sticky bottom-0 py-12 w-full mx-auto l:w-[56%] dark:bg-111314"}>
                    {/* <button
                        type={"submit"}
                        className={"d-block pct:w-64 max-w-480 h-7 lh-7 mg-x-auto pad-x2 border-0 bg-green color-white radius decoration-none disabled:bg-green-inverse"}
                        onClick={showLoadingState}
                        disabled={!updateAppBasicInfoData?.name && !updateAppBasicInfoData?.description && !updateAppBasicInfoData?.version && !updateAppBasicInfoData?.website}
                    >
                        {isSubmit ? <span className='fa fa-spinner fa-spin'></span> : "Save"}
                    </button> */}
                    <Button
                        type={"submit"}
                        classes={"block btn-wide mx-auto"}
                        onClick={showLoadingState}
                        disabled={!updateAppBasicInfoData?.name && !updateAppBasicInfoData?.description && !updateAppBasicInfoData?.version && !updateAppBasicInfoData?.website}
                    >
                        {isSubmit ? <LoadingButton /> : "Save"}
                    </Button>
                </div>
            </form>
        </section>
    );
}
export default UpdateAppBasicInfo;