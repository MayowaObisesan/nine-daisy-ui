import { useState } from "react";
import { Button, LoadingButton, NotifError, NotifSuccess, TextArea, TextInput } from "../components/Elements"
import { FormField, LabelField } from "../components/Forms"
import { releaseType } from "../helpers/constants";
import { useNavigate, useParams } from "react-router-dom";

const CreateNewVersion = () => {
    const { appNameId } = useParams();
    const navigate = useNavigate();
    const [createVersionData, setCreateVersionData] = useState({});
    const [createVersionResponseData, setCreateVersionResponseData] = useState({});
    const [isSubmit, setIsSubmit] = useState(false);
    const [descriptionCount, setDescriptionCount] = useState(0);

    const handleCreateNewVersion = (event) => {
        // const signupURL = "http://localhost:8000/signup/";
        // const signupURL = "https://blessedmayowa.pythonanywhere.com/signup/";
        const signupURL = `${process.env.REACT_APP_BASE_URL}/app/version/`;
        const headers = {
            'Accept': '*/*',
            // 'Origin': '*',
        };
        const fetchInit = {
            method: 'POST',
            headers: headers,
            mode: 'cors',
            body: new FormData(event.target),
            cache: 'default',
        };
        event.preventDefault();

        fetch(signupURL, fetchInit)
            .then(response => {
                if (!response.ok) {
                    // throw response;
                    setCreateVersionResponseData({
                        message: "Error occurred updating your app details",
                        successful: false,
                        error: true
                    });
                }
                return response.json();
            })
            .then((data) => {
                // reset the signup form
                event.target.reset();
                setIsSubmit(false);
                //setSignupData({})
                setCreateVersionResponseData({
                    message: "Version update successful",
                    successful: true,
                    error: false
                });
                setTimeout(() => {
                    navigate(`/app/${appNameId}`);
                }, 800);

            })
            .catch((error) => {
                let error_message;
                if (error.status === 401) {
                    error_message = "You are not authorized to perform this action"
                } else if (error.status === 400) {
                    error_message = "Version update form is not valid"
                } else if (error.status === 500) {
                    error_message = "Check your internet connection"
                } else {
                    // error_message = error;
                }
                setCreateVersionResponseData({
                    message: error_message,
                    successful: false,
                    error: true
                });
                // reset the isSubmit loader
                setIsSubmit(false);
            });
    }

    const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;

        // validateFormFields(name, value);

        setCreateVersionData(values => (
            { ...values, [name]: value }
        ));
    }

    const handleKeyUp = () => { }

    const showLoadingState = () => {
        setIsSubmit(true);
    };

    const updateDescriptionCount = (event) => {
        setDescriptionCount(event.currentTarget.value.length);
    }

    return (
        <section className={"flex flex-row justify-center items-center h-dvh"}>
            <form onSubmit={handleCreateNewVersion}
                className="relative flex flex-col gap-12 mx-auto px-1 w-[96%] lg:w-[480px] lg:shadow2">
                {createVersionResponseData?.successful ? <NotifSuccess message={createVersionResponseData.message} /> : null}
                {createVersionResponseData?.error ? <NotifError message={createVersionResponseData.message} /> : null}

                <div className={"flex flex-col"}>
                    <FormField classes={"font-semibold"}>
                        <LabelField>
                            Write about your latest Feature <span className={"text-error"}>*</span>
                            <TextArea
                                id="id-new-app-description"
                                name="description"
                                cols="30"
                                rows="10"
                                required={true}
                                placeholder="Your app latest features"
                                onChange={(event) => { handleChange(event); updateDescriptionCount(event) }}
                                maxLength={2000}
                                classes={"text-base h-40"}
                            />
                        </LabelField>
                        {<div className={"font-semibold text-sm px-1 pt-1"}>Character: {descriptionCount} / 2000</div>}
                    </FormField>
                    <div className={"flex flex-row flex-nowrap justify-between gap-4"}>
                        <FormField classes={"flex-grow"}>
                            <LabelField
                                text={<span className={"font-semibold"}>Release Type</span>}
                                classes={"font-bold"}
                            >
                                {/* <TextInput
                                    type="text"
                                    name="firstname"
                                    placeholder="Your firstname"
                                    onChange={handleChange}
                                    onKeyUp={handleKeyUp}
                                /> */}
                                <select className="select w-full max-w-xs h-16 focus:outline-primary focus:border-transparent">
                                    <option disabled selected>Choose a release type</option>
                                    {
                                        releaseType.map((eachReleaseType) => (
                                            <option key={eachReleaseType} className="bg-base-200">{eachReleaseType}</option>
                                        ))
                                    }
                                </select>
                            </LabelField>
                        </FormField>
                        <FormField classes={"flex-grow"}>
                            <LabelField
                                text={<span className={"font-semibold"}>Version</span>}
                                classes={"font-bold"}
                            >
                                <TextInput
                                    type="text"
                                    name="lastname"
                                    placeholder="Release version"
                                    onChange={handleChange}
                                    onKeyUp={handleKeyUp}
                                />
                            </LabelField>
                        </FormField>
                    </div>
                    <FormField>
                        <LabelField
                            text={<span className={"font-semibold"}>Release Date</span>}
                            classes={"font-bold"}
                        >
                            {/* <TextInput
                                type="email"
                                name="email"
                                value={""}
                                placeholder="Enter your active email"
                                onChange={handleChange}
                                onKeyUp={handleKeyUp}
                            /> */}
                            <input type="datetime-local" name="release-data" id="" className="input w-full h-16 bg-base-100 focus:outline-primary focus:border-transparent" />
                        </LabelField>
                    </FormField>
                </div>
                <div className={"form-control"}>
                    <Button
                        type="submit"
                        disabled={descriptionCount < 1}
                        onClick={(e) => showLoadingState(e)}
                    >
                        {isSubmit ? <LoadingButton /> : "Submit"}
                    </Button>
                </div>
            </form>
        </section>
    )
}

export default CreateNewVersion;