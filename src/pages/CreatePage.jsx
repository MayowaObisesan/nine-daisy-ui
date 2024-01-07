import React, { useEffect, useRef, useState } from 'react'
import { StyleProcessor } from "../helpers/StyleProcessor";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button, LoadingButton, NotifError, NotifInfo, NotifSuccess, NotifWarning, TemporaryNotif, TextArea, TextInput } from "../components/Elements";
import useFetch from "../hooks/useFetch";
import { deviceWidthEnum, isValidURL, loginToken } from "../helpers/utils";
import axios from 'axios';
import smoothScrollIntoView from 'smooth-scroll-into-view-if-needed';
import { useDeviceSize } from '../hooks/useDeviceSize';
import useTokenData from '../hooks/useTokenData';
import { FormField, LabelField } from '../components/Forms';
import { NINE_CREATE_APP_FORM_DRAFT_NAME, maxCategoryCount } from '../helpers/constants';

const PageSwitchHeader = (props) => {
    return (
        <header
            className="relative top-0 block h-20 leading-[5rem] text-lg font-semibold text-center lg:font-18|font-bold|mg-b2 dark:bg-111314">
            {props.children}
        </header>
    )
}

const PrevPageButton = (props) => {
    return (
        <div>
            <Button
                onClick={props.onClick}
                {...props}
            >
                <span className="fa fa-angle-left"></span>
            </Button>
        </div>
    )
}

const NextPageButton = (props) => {
    return (
        <div id={props.id} className={"dark:bg-base-300 block w-32 ml-auto rounded-xl decoration-none"} tabIndex="-1">
            <Button
                type={"button"}
                classes={"w-full h-14 text-base"}
                disabled={props.disabled}
                onClick={props.onClick}
                {...props}
            >
                Next
                <span className="fa fa-angle-right mg-l2"></span>
            </Button>
        </div>
    )
}

const PageSwitchButtonPanel = (props) => {
    return (
        <div className={"form-page-switch-container flex flex-row place-items-center sticky bottom-0 left-0 bg-inherit bg-mica z-100 w-full px-4 py-2 dark:bg-111314"}>
            {props.children}
        </div>
    )
}

const PageSwitchContentContainer = ({ classes, children }) => {
    return (
        <section className={`space-y-5 w-full h-full bg-inherit overflow-y-auto lg:w-[56%] dark:bg-111314 ${classes}`}>
            {children}
        </section>
    )
}

const PageSwitchContainer = ({ id, classes, children }) => {
    return (
        <section id={id} className={`app-form-page relative flex flex-col w-full items-center flex-grow flex-shrink-0 overflow-y-hidden dark:bg-111314 ${classes}`}>
            {children}
        </section>
    )
}


const getCreateAppFormDraft = () => {
    const defaultAppFormDraft = {};
    let currentDraft = localStorage.getItem(NINE_CREATE_APP_FORM_DRAFT_NAME);
    if (!currentDraft) {
        currentDraft = localStorage.setItem(NINE_CREATE_APP_FORM_DRAFT_NAME, JSON.stringify(defaultAppFormDraft));
    }

    return JSON.parse(currentDraft);
}

const readCreateAppFormDraft = (key) => {
    const parsedCurrentDraft = getCreateAppFormDraft();
    return parsedCurrentDraft ? parsedCurrentDraft[key] : null;
}


function CreateAppsForm() {
    const location = useLocation();
    const [appCreateData, setAppCreateData] = useState(getCreateAppFormDraft() || {});
    const [app_description_textarea_value, setAppDescriptionValue] = useState();
    const selectedCategoryContainer = useRef(null);
    const { rawToken, isLoggedIn, tokenData } = useTokenData();
    const navigate = useNavigate();
    const [appImage, setAppImage] = useState(null);
    const [appImagePreview, setAppImagePreview] = useState(null);
    const [appScreenshots, setAppScreenshots] = useState([]);
    const [appScreenshotsPreview, setAppScreenshotsPreview] = useState([]);
    const [defaultAppsCategory] = useFetch(`${process.env.REACT_APP_BASE_URL}/app/category_list/`);
    const [selectedCategoryCount, setSelectedCategoryCount] = useState(0);
    const [selectedCategoryData, setSelectedCategoryData] = useState('');
    const [selectedCategoryList, setSelectedCategoryList] = useState([]);
    const categoryItemsContainer = useRef(null);
    const categoryInputField = useRef(null);
    const appFormElement = useRef(null);
    const appFormPagePilesContainer = useRef(null);
    const [appCategoryData, setAppCategoryData] = useState([]);
    const [currentFormPage, setCurrentFormPage] = useState("basic");
    const [appFormPageData, setAppFormPageData] = useState([{
        "basic": { "valid": false, "index": 1 },
        "logo": { "valid": false, "index": 2 },
        "screenshots": { "valid": false, "index": 3 },
        "category": { "valid": false, "index": 4 },
        "links": { "valid": false, "index": 5 }
    }]);
    const [appFormPageSuccessfulList, setAppFormPageSuccessfulList] = useState({
        "basic": false,
        "logo": false,
        "screenshots": false,
        "category": false,
        "links": false
    });
    const [appLinksValid, setAppLinksValid] = useState(false);
    const createAppFormBaseURL = location.pathname;
    const [appCreateResponseData, setAppCreateResponseData] = useState({});
    const [fieldInfo, setFieldInfo] = useState({});
    const [isSubmit, setIsSubmit] = useState(false);
    const size = useDeviceSize();
    const [descriptionCount, setDescriptionCount] = useState(0);
    const closeCreatePageModal = useRef(null);
    const [appFormDraft, setAppFormDraft] = useState(getCreateAppFormDraft() || {});
    const [draftExist, setDraftExist] = useState(false);
    const [draftPopulated, setDraftPopulated] = useState(false);

    const updateCreateFormDraft = () => {
        // Save form data to localStorage
        localStorage.setItem(NINE_CREATE_APP_FORM_DRAFT_NAME, JSON.stringify(appFormDraft));
        // setTimeout(() => {
        // }, 800);    // Debounce fetch-storage and write-to-storage time by 800ms
    }

    const deleteCreateFormDraft = () => {
        localStorage.removeItem(NINE_CREATE_APP_FORM_DRAFT_NAME);
    }

    useEffect(() => {
        // Check if there is a draft currently
        // const currentDraft = localStorage.getItem(NINE_CREATE_APP_FORM_DRAFT_NAME);
        // if (currentDraft) setDraftExist(true);
        if (readCreateAppFormDraft("name")) setDraftExist(true);
    }, []);

    useEffect(() => {
        // scroll the piles into view
        // document.querySelector(`#id-${currentFormPage}-pile`).scrollIntoView({ 'inline': 'center', 'block': 'nearest', 'behavior': 'smooth' });
        smoothScrollIntoView(document.querySelector(`#id-${currentFormPage}-pile`), { 'inline': 'center', 'block': 'nearest', 'behavior': 'smooth', scrollMode: 'if-needed' });
        // const scrollPilesTimeout = setTimeout(
        //   () => document.querySelector(`#id-${currentFormPage}-pile`).scrollIntoView({ 'inline': 'center', 'block': 'nearest', 'behavior': 'smooth' }),
        //   800
        // );
        // return () => { clearTimeout(scrollPilesTimeout) }
    }, [currentFormPage])

    useEffect(() => {
        setSelectedCategoryCount(appCategoryData?.length);
    }, [appCategoryData]);

    useEffect(() => {
        if (appCreateData?.name && appCreateData?.description) {
            setAppFormPageSuccessfulList({ ...appFormPageSuccessfulList, "basic": true })
            // setAppFormPageData(appFormPageData)
        } else {
            setAppFormPageSuccessfulList({ ...appFormPageSuccessfulList, "basic": false })
        }
        /*if (
            appCreateData?.playstore_link
            || appCreateData?.appstore_link
            || appCreateData?.external_link
            || appCreateData?.website
        ) {
          // setAppFormPageSuccessfulList({...appFormPageSuccessfulList, "links": true})
          setAppCreateData(values => (
              {...values, ["links"]: true}
          ));
        } else {
          setAppFormPageSuccessfulList({...appFormPageSuccessfulList, "links": false})
        }*/

        if (
            isValidURL(appCreateData?.website)
            || (
                isValidURL(appCreateData?.external_link)
                || isValidURL(appCreateData?.appstore_link)
                || isValidURL(appCreateData?.playstore_link)
            )
        ) {
            setAppLinksValid(true)
        } else {
            setAppLinksValid(false)
        }
        return () => {
            setAppFormPageSuccessfulList({ ...appFormPageSuccessfulList })
        }
    }, [appCreateData])

    useEffect(() => {
        if (selectedCategoryCount > 0) {
            setAppFormPageSuccessfulList({ ...appFormPageSuccessfulList, "category": true })
        } else {
            setAppFormPageSuccessfulList({ ...appFormPageSuccessfulList, "category": false })
        }
        return () => { }
    }, [selectedCategoryCount])

    useEffect(() => {
        if (appImage) {
            setAppFormPageSuccessfulList({ ...appFormPageSuccessfulList, "logo": true })
        } else {
            setAppFormPageSuccessfulList({ ...appFormPageSuccessfulList, "logo": false })
        }
    }, [appImage])

    useEffect(() => {
        if (appScreenshots.length > 0) {
            setAppFormPageSuccessfulList({ ...appFormPageSuccessfulList, "screenshots": true })
        } else {
            setAppFormPageSuccessfulList({ ...appFormPageSuccessfulList, "screenshots": false })
        }
    }, [appScreenshots])

    const handleAppImageChange = (event) => {
        const selectedImage = event.target.files[0];
        setAppImage(selectedImage);
        setAppImagePreview(URL.createObjectURL(selectedImage));
    };

    const handleAppScreenshotSelect = (event) => {
        const files = Array.from(event.target.files);
        setAppScreenshots(files);
        setAppScreenshotsPreview(
            files.map((file) => URL.createObjectURL(file))
        );
    };

    const showLoadingState = (e) => {
        setIsSubmit(true);
    };

    function submitNewAppForm(event) {
        event.preventDefault();
        console.log('Initializing submitting new App Form.');
        const formData = new FormData();
        if (appCreateData?.name && appCreateData?.description) {
            formData.append("name", appCreateData?.name)
            formData.append("description", appCreateData?.description)
        }
        if (appImage) {
            formData.append("logo", appImage);
        }
        appScreenshots.forEach((file, index) => {
            // formData.append(`images[${index}]`, file)
            formData.append(`screenshot`, file)
        });
        if (selectedCategoryCount > 0) {
            formData.append("category", appCategoryData);
        }
        if (appCreateData?.playstore_link) {
            formData.append("playstore_link", appCreateData?.playstore_link)
        }
        if (appCreateData?.appstore_link) {
            formData.append("appstore_link", appCreateData?.appstore_link)
        }
        if (appCreateData?.external_link) {
            formData.append("external_link", appCreateData?.external_link)
        }
        if (appCreateData?.website) {
            formData.append("website", appCreateData?.website)
        }
        const newAppApiUrl = `${process.env.REACT_APP_BASE_URL}/app/`;
        const newAppFetchConfig = {
            method: 'POST',
            headers: {
                // 'Accept': '*',
                // 'Origin': '*',
                'Authorization': `Bearer ${loginToken()}`,
                // 'Content-Type': "multipart/form-data"
            },
            // body: formData,
            data: formData,
            modes: 'cors',
        }
        // fetch(newAppApiUrl, newAppFetchConfig)
        axios(newAppApiUrl, newAppFetchConfig)
            .then(response => {
                console.log("Received response")
                console.log(response)
                console.log(typeof response.status)
                if (response.status !== 201) {
                    // let error_message;
                    // if (response.status === 401) {
                    //   error_message = "Kindly login to register your app"
                    // } else if (response.status === 400) {
                    //   error_message = "Unable to perform update. Kindly fix any form errors and re-submit"
                    // } else if (response.status === 500) {
                    //   error_message = "Something went wrong from our end. We are resolving this right now. Please try again in 3 minutes"
                    // } else {
                    //   // There is no network connection or the Server is not up.
                    //   error_message = "Network Error"
                    // }
                    // setAppCreateResponseData({
                    //   message: error_message,
                    //   successful: false,
                    //   error: true
                    // });
                    // throw null;
                    throw response;
                }
                // new NEH().closeNewAppsFormTemplate()
                // return response.json()
                return response.data;
            })
            .then(data => {
                console.info(`New App instance created successfully. ::`)
                // console.info(data)
                setIsSubmit(false);
                // Show the success alert and redirect to the home page
                setAppCreateResponseData({
                    message: "App created successful",
                    successful: true,
                    error: false
                });
                setTimeout(() => {
                    navigate('/');
                }, 800);
            })
            .catch(err => {
                // console.log(err)
                const errorMessage = err.response?.data.error || "Unable to process request";
                console.error(`Error occurred when creating new App. :: ${err}`)
                setAppCreateResponseData({
                    message: errorMessage,
                    successful: false,
                    error: true
                });
                setIsSubmit(false);
            })

        // reset the form data
        setAppScreenshots([]);
        setAppScreenshotsPreview([]);
    }

    const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setAppCreateData(values => (
            { ...values, [name]: value }
        ));
        setAppFormDraft(values => (
            { ...values, [name]: value }
        ));
    }

    const handleAppFormPageSwitchTemplate = (pageType) => {
        const selector = appFormElement.current.querySelector(`#id-${pageType}-form`)
        smoothScrollIntoView(selector, { behavior: 'smooth', scrollMode: 'if-needed' });

        // Only run the setCurrentFormPage state function. Else the scrollIntoView stops after 800ms on laptops.
        if (size.windowWidth <= deviceWidthEnum.tablet) {
            setCurrentFormPage(() => pageType);
        }

        // scroll the piles into view
        // document.querySelector(`#id-${pageType}-pile`).scrollIntoView({'inline': 'center', 'behavior': 'smooth'});

        /* To show the fragment of the previous and next for pages, clone the elements, add it to the element scrolled into
        * and on scroll out of that element, remove the element from the current view.*/
    }

    const handleAppFormPageSwitch = (evt, pageType) => {
        // setCurrentFormPageIndex(currentFormPageIndex+1);
        handleAppFormPageSwitchTemplate(pageType);
        updateCreateFormDraft();
    }

    const handleAppFormPageSwitchBack = (evt, pageType) => {
        // setCurrentFormPageIndex(currentFormPageIndex-1)
        handleAppFormPageSwitchTemplate(pageType);
    }

    const handleCategoryChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setAppCategoryData(values => {
            if (values.includes(value)) {
                return values.filter((item) => item !== value);
            } else {
                return [...values, value]
            }
        });
        setAppFormDraft(values => {
            if (values.includes(value)) {
                return values.filter((item) => item !== value);
            } else {
                return [...values, value]
            }
        });
    }

    const updateDescriptionCount = (event) => {
        setDescriptionCount(event.currentTarget.value.length);
    }

    async function checkNameExists(event) {
        const appName = event.currentTarget.value;
        const fieldName = event.currentTarget.name;
        const requestConfig = {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                // 'Origin': '*',
                // 'Authorization': `Bearer ${rawToken}`,
                // 'Content-Type': "multipart/form-data"
            },
            // body: formData,
            // data: formData,
            modes: 'cors',
        }
        // Delay the fetch request for 800ms
        setTimeout(async function () {
            const appExistURL = `${process.env.REACT_APP_BASE_URL}/app/exists/?name=${appName}`;
            await axios(appExistURL, requestConfig)
                .then(response => {
                    if (response.status !== 200) throw response;
                    return response.data;
                }).then(data => {
                    // console.log(data)
                    // data?.exists && 
                    setFieldInfo(
                        values => (
                            { ...values, [fieldName]: data?.exists }
                        )
                    );
                }).catch(error => {
                    console.log(error.response?.data.error)
                })
        }, 800)
    }

    return (
        <section
            className="new-app-form-container flex flex-row justify-center items-center w-full h-full overflow-x-hidden overflow-y-hidden">
            {/* <section
                className="new-app-banner lg:pct:w-28 pct:h-86 mg-r4 bg-f9f9f9 bg-mica radius-inherit border-1 border-eeeeee">
                <section className="bg-00995544"></section>
            </section> */}
            <form method="post" action=""
                className="new-app-form w-full md:h-[92%] h-full overflow-y-auto radius-inherit border0.5 border-gold lg:shadow lg:h-full"
                encType={"multipart/form-data"}
                ref={appFormElement}
                onSubmit={(event) => submitNewAppForm(event)}>
                <input type="hidden" name="csrf_token" />
                {
                    isLoggedIn && tokenData?.is_verified !== undefined && !tokenData?.is_verified
                        ? <div className={"sticky top-0 flex flex-row items-center p-2 bg-warning/25 backdrop-blur z-50 lg:justify-center"}>
                            <span>
                                Kindly verify your account to register your app on Nine.
                                <br />You won't be able to register your app until you verify your identity
                            </span>
                            <Link
                                to={"/verify-user"}
                                className={"d-block h-10 leading-10 ml-4 px-4 bg-warning color-black text-center rounded decoration-none"}>
                                Verify account
                            </Link>
                        </div>
                        : null
                }
                {/* {
                    draftExist && !draftPopulated &&
                    <TemporaryNotif time={3000}><NotifWarning message={"We have recovered your previous draft"} /></TemporaryNotif>
                } */}
                {/* Open the modal using document.getElementById('ID').showModal() method */}
                <dialog id="close-create-page-modal" className="modal" ref={closeCreatePageModal}>
                    <div className="modal-box text-center space-y-6">
                        <h3 className="relative font-bold text-2xl">
                            <span className={"absolute top-1 left-2 fa fa-info-circle text-info text-xl"}></span>
                            <span>Form not submitted</span>
                        </h3>
                        <div className="py-4 bg-base-100 rounded-xl text-lg">
                            {/* You haven't submitted your form. */}
                            {/* <br /> */}
                            You will be redirected to the home page.
                            <div className="">Do you want to Proceed?</div>
                        </div>
                        <Link to={"/"} className={""} onClick={() => updateCreateFormDraft()}>
                            <Button
                                classes={"btn-primary font-bold text-lg mt-4"}
                            >
                                Yes, go to home page
                            </Button>
                        </Link>
                        <div className="modal-action justify-center absolut -top-4 right-2">
                            <form method="dialog">
                                {/* if there is a button in form, it will close the modal */}
                                <button className="btn text-lg">
                                    {/* <CloseIcon width={"20"} height={"20"} /> */}
                                    No, Stay on Page
                                </button>
                            </form>
                        </div>
                    </div>
                </dialog>
                <section className={"sticky top-0 flex flex-row flex-nowrap justify-start items-center w-full max-w-full h-[8%] z-10 bg-base-200 backdrop-blur overflow-x-auto every:flex|flex-column|mg-y1|pad-x4|pad-y2 lg:justify-center lg:overflow-hidden dark:bg-111314 dark:color-whitesmoke"} ref={appFormPagePilesContainer}>
                    {/* If the user is still creating and clicks the back button, display a modal informing the user that the form will be saved as draft. */}
                    {
                        appFormDraft?.name
                            ? <Button
                                className={"fa fa-arrow-left w-[32px] flex flex-col my-2 px-8 py-4 font-16 decoration-none color-initial lg:absolute lg:left-8 dark:color-whitesmoke"}
                                onClick={() => closeCreatePageModal.current.showModal()}
                            />
                            : <Link
                                to={"/"}
                                className={"fa fa-arrow-left w-[32px] flex flex-col my-2 px-8 py-4 font-16 decoration-none color-initial lg:absolute lg:left-8 dark:color-whitesmoke"}
                                onClick={() => updateCreateFormDraft()}
                            />
                    }
                    {
                        ["Basic", "Logo", "Screenshots", "Category", "Links"].map((eachPile, index) => {
                            return (
                                <div key={index} id={`id-${eachPile.toLowerCase()}-pile`} className={`flex flex-col my-2 px-8 py-4 ${eachPile.toLowerCase() === currentFormPage ? "font-bold font-14 text-center" : ""}`}>
                                    {eachPile}
                                    {
                                        appFormPageSuccessfulList[eachPile.toLowerCase()] && appFormPageSuccessfulList[eachPile.toLowerCase()] === true
                                            ? <>
                                                <div className={"fa fa-check-circle text-success text-center"}></div>
                                            </>
                                            : null
                                    }
                                </div>
                            )
                        })
                    }
                </section>

                {
                    appCreateResponseData?.successful
                        ? <NotifSuccess message={appCreateResponseData.message} />
                        : null
                }
                {
                    appCreateResponseData?.error
                        ? <NotifError message={appCreateResponseData.message} />
                        : null
                }
                <section
                    className={"relative flex flex-row flex-nowrap flex-1 flex-grow shrink-0 w-full h-[92%] overflow-hidden every:flex|flex-column|pct:w-100|mg-0|pad-0|font-14|bg-white-solid lg:every:flex|flex-column|justify-start|pct:w-100|mg-r4|mg-0|pad-0|font-14|bg-white-transparent"}>
                    <PageSwitchContainer id={"id-basic-form"}>
                        <PageSwitchContentContainer>
                            <PageSwitchHeader>Tell us about your App</PageSwitchHeader>
                            <div className={"leading-8 px-4 py-8 bg-base-200 rounded-xl lg:lh-normal lg:px-8 lg:py-8 dark:bg-222425"}>
                                <header className={"px-4"}>Hi {tokenData?.firstname}, kindly fill the important details about your App before we list it on Nine.</header>
                                <ol className={"px-8 leading-10 list-decimal"}>
                                    {/*<header>Guidelines:</header>*/}
                                    <li>Required fields have the asterisk symbol on them</li>
                                    <li>Use an App name that identifies your App</li>
                                    <li>Don't try to add an App you did not create or build or have permission to register on Nine.
                                        Strong penalty exist for users that engage in such acts.</li>
                                </ol>
                            </div>
                            <div className={"p-4 space-y-8"}>
                                <FormField classes={"font-semibold"}>
                                    <LabelField>
                                        App Name <span className={"text-error"}>*</span>
                                        <TextInput
                                            required={true}
                                            id={"id-app-name"}
                                            name={"name"}
                                            placeholder={"Your app name"}
                                            defaultValue={appFormDraft.name}
                                            value={appCreateData.name || appFormDraft.name}
                                            onChange={handleChange}
                                            onKeyUp={checkNameExists}
                                            maxLength={48}
                                        />
                                    </LabelField>
                                    {appCreateData?.name && fieldInfo?.name && <div className={"px-2 text-error"}>This app name exist</div>}
                                </FormField>
                                <FormField classes={"font-semibold"}>
                                    <LabelField>
                                        Describe your app <span className={"text-error"}>*</span>
                                        <TextArea
                                            id="id-new-app-description"
                                            name="description"
                                            cols="30"
                                            rows="10"
                                            required={true}
                                            placeholder="Write about your app in few words."
                                            defaultValue={appFormDraft.description}
                                            // value={app_description_textarea_value}
                                            value={appFormDraft.description}
                                            onChange={(event) => { handleChange(event); updateDescriptionCount(event) }}
                                            maxLength={120}
                                        />
                                    </LabelField>
                                    {<div className={"font-semibold text-sm px-1"}>Character: {descriptionCount} / 120</div>}
                                </FormField>
                            </div>
                        </PageSwitchContentContainer>
                        <PageSwitchButtonPanel>
                            <NextPageButton
                                disabled={!(appCreateData?.name && appCreateData?.description)}
                                onClick={(evt) => handleAppFormPageSwitch(evt, "logo")}
                            ></NextPageButton>
                        </PageSwitchButtonPanel>
                    </PageSwitchContainer>

                    <PageSwitchContainer id={"id-logo-form"}>
                        <PageSwitchContentContainer>
                            <PageSwitchHeader>Upload your App logo</PageSwitchHeader>
                            <div className={"d-block mx-auto text-center"}>
                                <div className={"d-block mx-auto w-72 h-72 leading-[18rem] rounded-full bg-base-100 border-2 border-dashed border-base-100 dark:bg-222425"}>
                                    {
                                        appImage && (
                                            <div className={"relative block w-full h-full rounded-full"}>
                                                <img src={appImagePreview} alt={"App uploaded logo"} style={{}}
                                                    className={"block max-w-full h-full object-center object-cover rounded-full"} />
                                            </div>
                                        )
                                    }
                                </div>
                                <label htmlFor="id-image-upload" className={"inline-block h-12 leading-[3rem] btn btn-ghost bg-base-100 px-6 my-4 dark:bg-222425|color-whitesmoke"}>Set App Logo</label>
                                <input
                                    type="file"
                                    id="id-image-upload"
                                    name={"logo"}
                                    accept=".jpg,.jpeg,.png"
                                    onChange={handleAppImageChange}
                                    hidden
                                />
                            </div>
                        </PageSwitchContentContainer>
                        <PageSwitchButtonPanel>
                            <PrevPageButton
                                onClick={(e) => { handleAppFormPageSwitchBack(e, "basic") }}
                            ></PrevPageButton>
                            <NextPageButton
                                onClick={(evt) => handleAppFormPageSwitch(evt, "screenshots")}
                            ></NextPageButton>
                        </PageSwitchButtonPanel>
                    </PageSwitchContainer>

                    <PageSwitchContainer id={"id-screenshots-form"}>
                        <PageSwitchContentContainer classes={"lg:w-full"}>
                            <PageSwitchHeader>Upload Screenshots of your app</PageSwitchHeader>
                            <section className={"pad-y4"}>
                                {
                                    appScreenshotsPreview.length < 1
                                        ? <label
                                            htmlFor={"id-app-screenshot-upload"}
                                            className={"flex flex-col justify-center items-center w-[96%] h-[240px] lg:w-[56%] bg-base-100 hover:bg-base-200 hover:cursor-pointer mx-auto mb-4 rounded-xl text-base-content transition-colors hover:transition-colors"}>
                                            {/* className={"flex flex-col justify-center items-center w-[96%] h-[160px] pct:w-96 h-160 border:2px_dashed_DDD mx-auto mb-4 rounded-xl bg-base-200 radius color-BBB dark:border:2px_dashed_darkgray"}> */}
                                            <span className="fa fa-plus text-xl py-4"></span>
                                            <div>Select images to upload</div>
                                            <div className={"font-bold leading-normal text-base"}>Maximum of 4 images</div>
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
                                            // className={"flex flex-row flex-wrap justify-around px-2 every:pct:w-48|h-320|mg-b2|bg-lighter|radius-sm"}>
                                            className={"flex flex-row flex-wrap justify-center gap-4 px-4 every:pct:w-48|h-320|mg-b2|bg-lighter|radius-sm dark:every:bg-222425"}>
                                            {
                                                appScreenshotsPreview?.map((screenshot_obj, index) => (
                                                    <div key={index}
                                                        // className={"w-[48%] h-[320px] bg-base-100 mb-4 px-2 rounded-lg"}>
                                                        className={"h-[320px] rounded-xl bg-base-200 lg:hover:bg-base-100 transition-colors radius-inherit"}>
                                                        <img src={screenshot_obj}
                                                            alt={`screenshot preview ${index}`}
                                                            height={"100%"}
                                                            // className={"max-w-full object-cover object-center rounded-lg"} />
                                                            className={"max-w-full h-full object-cover object-center rounded-xl radius-inherit"} />
                                                    </div>
                                                ))
                                            }
                                            {
                                                appScreenshotsPreview?.length > 0
                                                    ? new Array(4 - appScreenshotsPreview?.length).fill("").map((_, index) => (
                                                        <label key={index}
                                                            htmlFor={"id-app-screenshot-upload"}
                                                            // className={"flex flex-col justify-center items-center text-center bg-base-100 border-2 border-dashed border-base-100 mx-auto rounded-xl color-999 decoration-none dark:bg-222425 dark:border-2 dark:border-base-100"}>
                                                            className={"flex flex-col justify-center items-center flex-1 min-w-[240px] h-[320px] bg-base-200 lg:hover:bg-base-100 transition-colors text-center border:2px_dashed_DDD mx-auto rounded-xl radius color-999 decoration-none dark:border:2px_dashed_darkgray"}>
                                                            <span className="fa fa-plus text-xl py-4"></span>
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
                            </section>
                        </PageSwitchContentContainer>
                        <PageSwitchButtonPanel>
                            <PrevPageButton
                                onClick={(e) => { handleAppFormPageSwitchBack(e, "logo") }}
                            ></PrevPageButton>
                            <NextPageButton
                                disabled={!appScreenshots}
                                onClick={(evt) => handleAppFormPageSwitch(evt, "category")}
                            ></NextPageButton>
                        </PageSwitchButtonPanel>
                    </PageSwitchContainer>

                    <PageSwitchContainer id={"id-category-form"}>
                        <PageSwitchContentContainer classes={"lg:w-full"}>
                            <PageSwitchHeader>Select a category for your App</PageSwitchHeader>
                            <section id="id-new-app-category-fragment" className={"new-app-category-fragment relative lg:w-[56%] lg:mx-auto lg:px-4"}>
                                <div
                                    className={"sticky top-0 block w-full bg-base-200/80 backdrop-blur px:top-80 d-block pct:w-100 bg-white bg-mica z-10 dark:bg-111314 dark:bg-base-200/80"}
                                    ref={selectedCategoryContainer}>
                                    {
                                        appCategoryData?.map((eachCategory, index) => (
                                            <span key={index} id={`id-category-${index}`}
                                                className="inline-block h-10 leading-10 px-4 mx-2 my-2 rounded-full bg-base-100 text-base-content radius-round bg-lighter border:1px_solid_BBB font-bold dark:bg-222425|color-whitesmoke|border:1px_solid_darkgray">
                                                {eachCategory}
                                            </span>
                                        ))
                                    }
                                    {
                                        defaultAppsCategory && appCategoryData.length > 0 &&
                                        <div className="block absolute top-1 right-4 h-12 leading-[3rem] px-2 text-center font-bold z-100 dark:color-darkgray">
                                            <span className={"badge badge-warning badge-lg"}>
                                                {selectedCategoryCount} of 4
                                            </span>
                                        </div>
                                    }
                                </div>
                                <section className={"relative px-4 lg:px-0"} ref={categoryItemsContainer}>
                                    {
                                        defaultAppsCategory
                                            ? defaultAppsCategory?.map((eachAppsCategory, index) => {
                                                return (
                                                    <div key={index} className={"relative dark:color-whitesmoke"}>
                                                        <label
                                                            htmlFor={`id-category-${eachAppsCategory}`}
                                                            className="flex flex-row items-center h-16 leading-[64px] my-4 px-4 rounded-2xl cursor-pointer hover:bg-base-200 has-[:disabled]:cursor-not-allowed has-[:disabled]:text-base-content/50 has-[:checked]:bg-primary has-[:checked]:text-primary-content has-[:checked]:font-bold has-[:checked]:ring-primary transition-all"
                                                            data-category_name={eachAppsCategory}
                                                            data-category_item_selected={false}
                                                        >
                                                            <span className={"flex-1 w-full"}>{eachAppsCategory}</span>
                                                            <input
                                                                key={index}
                                                                type="checkbox"
                                                                name={"category"}
                                                                id={`id-category-${eachAppsCategory}`}
                                                                className="appearance-none checked:checkbox checked:checkbox-sm checked:bg-success"
                                                                // defaultChecked={appData?.category.split(",").includes(eachAppsCategory)}
                                                                defaultValue={eachAppsCategory}
                                                                onChange={handleCategoryChange}
                                                                disabled={!appCategoryData?.includes(eachAppsCategory) && appCategoryData?.length === maxCategoryCount}
                                                            />
                                                        </label>
                                                        {/* <input
                                                            key={index}
                                                            type="checkbox"
                                                            name={"category"}
                                                            id={`id-category-${index}`}
                                                            className={"peer/sibling-categoryname appearance-none block w-[96%] h-16 leading-[4rem] px-6 py-1 border-0 radius2 text-left cursor-pointer lg:hover:pct:w-100|mg-x-auto|bg-green-inverse disabled:color-lightgray|cursor-not-allowed checked:bg-green|color-FFFFFF|pct:w-100|mg-x-auto|mg-y-2 transition:all_200ms_ease dark:disabled:color-898989|opacity-20"}
                                                            // defaultChecked={appData?.category.split(",").includes(eachAppsCategory)}
                                                            defaultValue={eachAppsCategory}
                                                            onChange={handleCategoryChange}
                                                            disabled={!appCategoryData?.includes(eachAppsCategory) && appCategoryData?.length === 4}
                                                        />
                                                        <label
                                                            htmlFor={`id-category-${index}`}
                                                            className={"d-block abs top-0 left-0 h-8 lh-8 pad-x3 pad-y-3 border-0 radius2 text-left cursor-pointer peer-checked/sibling-categoryname:text-base-content peer-disabled/sibling-categoryname:text-gray-600 peer-disabled/sibling-categoryname:cursor-not-allowed dark:peer-disabled/sibling-categoryname:text-neutral-content dark:peer-disabled/sibling-categoryname:opacity-40"}
                                                            data-category_name={eachAppsCategory}
                                                            data-category_item_selected={false}
                                                            onClick={(event) => addToSelectedCategory(event)}>
                                                            {eachAppsCategory}
                                                        </label> */}
                                                    </div>
                                                )
                                            })
                                            : <div className={"flex flex-col w-full h-[640px] justify-center items-center"}>
                                                Error fetching categories
                                                <div>Check your network connection</div>
                                            </div>
                                    }
                                </section>
                            </section>
                        </PageSwitchContentContainer>
                        <PageSwitchButtonPanel>
                            <PrevPageButton
                                onClick={(e) => { handleAppFormPageSwitchBack(e, "screenshots") }}
                            ></PrevPageButton>
                            <NextPageButton
                                disabled={appCreateData?.length < 1}
                                onClick={(evt) => handleAppFormPageSwitch(evt, "links")}
                            ></NextPageButton>
                        </PageSwitchButtonPanel>
                    </PageSwitchContainer>

                    <PageSwitchContainer id={"id-links-form"}>
                        <PageSwitchContentContainer>
                            <PageSwitchHeader>Add Links to download your app</PageSwitchHeader>
                            <div className={"p-4 space-y-8"}>
                                <FormField>
                                    <LabelField>
                                        Play Store
                                        <TextInput
                                            id={"id-new-app-playstore-link"}
                                            name={"playstore_link"}
                                            placeholder={"PlayStore download link"}
                                            onChange={handleChange}
                                        />
                                    </LabelField>
                                </FormField>
                                <FormField>
                                    <LabelField>
                                        App Store
                                        <TextInput
                                            id={"id-new-app-appstore-link"}
                                            name={"appstore_link"}
                                            placeholder={"AppStore download link"}
                                            onChange={handleChange}
                                        />
                                    </LabelField>
                                </FormField>
                                <FormField>
                                    <LabelField>
                                        Other Store
                                        <TextInput
                                            type={"url"}
                                            id={"id-new-app-external-link"}
                                            name={"external_link"}
                                            placeholder={"Link to other Store download link"}
                                            onChange={handleChange}
                                        />
                                    </LabelField>
                                </FormField>
                                <FormField>
                                    <LabelField>
                                        Other Store
                                        <TextInput
                                            type={"url"}
                                            id={"id-new-app-website"}
                                            name={"website"}
                                            placeholder={"Your app's website or landing page"}
                                            onChange={handleChange}
                                        />
                                    </LabelField>
                                </FormField>
                            </div>
                        </PageSwitchContentContainer>
                        <PageSwitchButtonPanel>
                            <PrevPageButton
                                onClick={(e) => { handleAppFormPageSwitchBack(e, "category") }}
                            ></PrevPageButton>
                            <div className={"dark:bg-base-300 block ml-auto decoration-none"} tabIndex="-1">
                                <Button
                                    type={"submit"}
                                    classes={"btn-success btn-wide h-14 disabled:bg-green-300 disabled:text-success-content disabled:bg-opacity-80 dark:disabled:bg-success dark:disabled:text-success-content"}
                                    disabled={!(appLinksValid && tokenData?.is_verified)}
                                    onClick={() => { showLoadingState(); deleteCreateFormDraft() }}
                                >
                                    {isSubmit ? <LoadingButton>Listing...</LoadingButton> : "Create"}
                                </Button>
                            </div>
                        </PageSwitchButtonPanel>
                    </PageSwitchContainer>
                </section>
            </form>
        </section>
    )
}

const CreatePage = () => {
    return (
        <section className={"dark:bg-base-300 text-sm lg:text-base"}>
            {/* <div className={"overflow-x-auto bg-base-200"}>
                <ul className="steps w-full my-12">
                    <li data-content="?" className="step step-success">Basic</li>
                    <li data-content="!" className="step step-success">Logo</li>
                    <li data-content="✓" className="step">Screenshots</li>
                    <li data-content="✕" className="step">Category</li>
                    <li data-content="★" className="step">Links</li>
                    <li data-content="●" className="step step-neutral">Step 7</li>
                </ul>
            </div> */}
            <section id="id-new-app-form-fragment"
                className="new-app-form-fragment flex flex-row justify-center items-center h-screen overflow-y-hidden">
                <CreateAppsForm />
            </section>
        </section>
    )
}



export default CreatePage;