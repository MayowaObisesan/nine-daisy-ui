import { useLoaderData, useNavigate } from "react-router-dom";
import { Button, LoadingButton, NotifError, PageHeaderLink, TextInput } from "../components/Elements";
import React, { useState } from "react";
import useFetch from "../hooks/useFetch";
import { deviceWidthEnum } from "../helpers/utils";
// import { useDeviceWidth } from "./useDeviceWidth";
import { FormFields } from "./CreateForm";
import axios from "axios";
import { useDeviceSize } from "../hooks/useDeviceSize";
import NavBar from "../components/NavBar";
import { FormField, LabelField } from "../components/Forms";


function DeleteApp() {
    // const { appId } = useParams();
    const { app } = useLoaderData();
    const appData = app?.data;
    const navigate = useNavigate();
    // const [appData] = useFetch(`${process.env.REACT_APP_BASE_URL}/app/${id}/`);
    // const { windowWidth, screenWidth, deviceWidthEnum } = useDeviceWidth();
    const size = useDeviceSize();
    const [appName, setAppName] = useState("");
    const [deleteAppResponseData, setDeleteAppResponseData] = useState({});
    const [isSubmit, setIsSubmit] = useState(false)

    const showLoadingState = (e) => {
        setIsSubmit(true);
    };

    const handleAppDelete = (event) => {
        const deleteAppFormData = new FormData();
        const deleteAppURL = `${process.env.REACT_APP_BASE_URL}/app/${appData?.id}/`;
        // const deleteAppURL = "https://blessedmayowa.pythonanywhere.com/deleteApp/";
        const headers = {
            'Accept': '*/*',
            // 'Origin': '*',
        };
        const fetchInit = {
            method: 'DELETE',
            headers: headers,
            mode: 'cors',
            // body: deleteAppFormData,
            data: deleteAppFormData,
            cache: 'default',
        };
        event.preventDefault();

        // fetch(deleteAppURL, fetchInit)
        axios(deleteAppURL, fetchInit)
            .then(response => {
                if (response.status !== 200) {
                    throw response;
                }
                let error_message;
                if (response.status === 401) {
                    error_message = "Kindly login to proceed"
                } else if (response.status === 400) {
                    error_message = "Unable to delete this App. Kindly fix any errors and re-submit"
                } else if (response.status === 500) {
                    error_message = "Check your internet connection"
                } else {
                    // There is no network connection or the Server is not up.
                    error_message = "Oops. Network Error"
                }
                setDeleteAppResponseData({
                    message: error_message,
                    successful: false,
                    error: true
                });
                // return response.json();
                return response.data;
            })
            .then((data) => {
                // reset the delete form
                event.target.reset();
                // reset the isSubmit loader
                setIsSubmit(false);
                setDeleteAppResponseData({
                    message: "App Deleted successfully",
                    successful: true,
                    error: false
                });
                setTimeout(() => {
                    navigate('/');
                }, 800);
            })
            .catch((error) => {

                // reset the isSubmit loader
                setIsSubmit(false);
            });
    }

    return (
        <form
            method={"DELETE"}
            action={""}
            className="delete-app-form-container flex flex-col justify-start items-start w-full h-dvh pct:w-100 pct:h-100 overflow-x-hidden dark:bg-111314|color-whitesmoke"
            onSubmit={handleAppDelete}
        >
            {
                size.windowWidth < deviceWidthEnum.laptop
                    ? <PageHeaderLink headerTitle={`Delete ${appData?.name}`} fixTop={false} />
                    : <NavBar showSearch={false} />
            }

            {/*<AppBoxes {...appData} hideUser={true}/>*/}
            <section className={"flex-1 w-full lg:w-[56%] pct:w-96 mx-auto mg-y2 p-8 lh-4 rounded-xl bg-red-inverse radius lg:pct:w-56"}>
                <NotifError title={"Danger"} noTitle>
                    <div className={"text-lg space-y-4"}>
                        <div><b>This action cannot be undone.</b></div>
                    </div>
                </NotifError>
                <section className={"w-[80%] space-y-16 mx-auto my-16"}>
                    <section className={"space-y-6 text-lg lg:space-y-10 lg:text-xl"}>
                        <div>If you choose to proceed</div>
                        <ul className={"list-decimal space-y-4 ps-5 lg:space-y-8"}>
                            <li>
                                No one will see this app on Nine once you delete it.
                            </li>
                            <li>
                                All of this app versions will be deleted.
                            </li>
                            <li>
                                This app will be removed from every ongoing event and nominations.
                            </li>
                        </ul>
                    </section>
                    {/* <div className="font-bold text-center text-lg lg:text-xl">This app will no longer be available on Nine once you click the delete button below.</div> */}
                    {/* <div>
                    <span className={"fa fa-warning text-error-content font-16 color-red square-4 text-center"}></span>
                    <span className={"font-18"}>Warning</span>
                </div>
                This app will no longer be available on Nine once you click the delete button below.
                <div><b>This action cannot be undone.</b></div> */}
                    {/*Are you sure you want to delete {appData?.name}?*/}
                    <br />

                    <section className={"block w-full space-y-8 pct:w-100 z-1 lg:px:top-0|pct:w-56|mg-x-auto"}>
                        {/* <FormFields
                    useDefaultInput={true}
                    type={"text"}
                    name={"name"}
                    label_value={"Enter app name"}
                    required={true}
                    placeholder={`Type ${appData?.name} here`}
                    onChange={(event) => setAppName(event.target.value)}
                /> */}
                        <div className={"text-center lg:text-xl dark:text-error-content"}>
                            Type <b>{appData?.name}</b> in the text field below to delete this app.
                        </div>
                        <FormField classes={"lg:w-[80%] lg:mx-auto"}>
                            <LabelField>
                                <TextInput
                                    type={"text"}
                                    name={"name"}
                                    label_value={"Enter app name"}
                                    required={true}
                                    placeholder={`Type ${appData?.name} here`}
                                    classes={"font-bold focus:outline-error"}
                                    onChange={(event) => setAppName(event.target.value)}
                                    autoComplete={"no"}
                                />
                            </LabelField>
                        </FormField>
                        <section className={"sticky bottom-16 w-full lg:w-[56%] pct:w-100 mx-auto px-4 my-8"}>
                            {/* <button
                    className={"d-block pct:w-100 h-6 lh-6 font-semibold border-0 outline-red outline-offset-2 bg-red color-white cursor-pointer radius disabled:bg-red-inverse|cursor-not-allowed lg:pct:w-40|mg-x-auto"}
                    disabled={appName !== appData?.name}
                    onClick={showLoadingState}
                    type={"submit"}
                >
                    {isSubmit ? <span className='fa fa-spinner fa-spin'></span> : "Delete"}
                </button> */}
                            <Button
                                type={"submit"}
                                classes={"btn-wide block mx-auto btn-error disabled:bg-error disabled:text-white dark:disabled:bg-red-800"}
                                disabled={appName !== appData?.name}
                                onClick={showLoadingState}
                            >
                                {isSubmit ? <LoadingButton /> : "Delete"}
                            </Button>
                        </section>
                    </section>
                </section>
            </section>

        </form>
    )
}

export default DeleteApp;