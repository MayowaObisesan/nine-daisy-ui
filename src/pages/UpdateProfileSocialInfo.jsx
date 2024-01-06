import React, { useContext, useEffect, useRef, useState } from "react";
import { Link, useLoaderData, useNavigate } from "react-router-dom";
import useUserData from "../hooks/useUserData";
import { UserContext } from "./Home";
import useFetch from "../hooks/useFetch";
import { Button, ButtonUpdateSubmit, FormInput, LoadingButton, NotifError, NotifSuccess, PageHeaderLink, TextInput } from "../components/Elements";
import { NotDefined, deviceWidthEnum } from "../helpers/utils";
import { ProfileDetailLeftNav } from "./ProfileView";
import axios from "axios";
import { useDeviceSize } from "../hooks/useDeviceSize";
import useTokenData from "../hooks/useTokenData";
import { FormField, LabelField } from "../components/Forms";
import { brandColorMap } from "../helpers/constants";

const UpdateProfileSocialInfo = () => {
    const size = useDeviceSize();
    // const { me } = useRouteLoaderData("root");
    const { me } = useLoaderData();
    const userDataResults = me?.data;
    // const { windowWidth, screenWidth, deviceWidthEnum } = useDeviceWidth();
    const [updateProfileData, setUpdateProfileSocialInfoData] = useState({});
    const facebookURLField = useRef(null);
    const twitterURLField = useRef(null);
    const instagramURLField = useRef(null);
    const youtubeURLField = useRef(null);
    const tiktokURLField = useRef(null);
    const updateProfileSubmitButton = useRef(null);
    const socialInputsContainer = useRef(null);
    const moreSocialSitesContainer = useRef(null);
    const { rawToken, isLoggedIn, tokenData } = useTokenData();
    // const { userDataResults, isError, isLoading, responseDetails } = useUserData();
    const [profileSocialAccount, setProfileSocialAccount] = useState([]);
    const [profileSocialAccountDifference, setProfileSocialAccountDifference] = useState([]);
    const navigate = useNavigate();
    // const [userData] = useFetch(`${process.env.REACT_APP_BASE_URL}/user/me/`);
    const [updateProfileSocialInfoResponseData, setUpdateProfileSocialInfoResponseData] = useState({});
    const [isSubmit, setIsSubmit] = useState(false);
    const [clickedButton, setClickedButton] = useState(null);
    const [appendedSocialSites, setAppendedSocialSites] = useState([]);
    const [visibleSocialAccount, setVisibleSocialAccount] = useState([]);
    const [socialSitesList] = useFetch(`${process.env.REACT_APP_BASE_URL}/app/social_list/`);
    const [socialSitesDict, setSocialSitesDict] = useState({});

    useEffect(() => {
        // Array.prototype.diff = function (arr2) { return this.filter(x => !arr2.includes(x)); }
        // [1, 2, 3].diff([2, 3])

        // Find the difference between the socialSitesList and the user defined profileSocialAccount list (array) and return the difference
        setProfileSocialAccountDifference(socialSitesList?.filter(x => !profileSocialAccount?.includes(x)).concat(profileSocialAccount?.filter(x => !socialSitesList.includes(x))))
        userDataResults?.social_account_dict && setProfileSocialAccount(Object.keys(userDataResults?.social_account_dict))
    }, [userDataResults, socialSitesList])

    useEffect(() => {
        if (Object.keys(profileSocialAccount).length === 0) {
            setVisibleSocialAccount(socialSitesList?.slice(0, 4))
        } else {
            const combinedSocialAccountList = profileSocialAccount.concat(profileSocialAccountDifference).slice(0, 5)
            setVisibleSocialAccount(combinedSocialAccountList)
        }
        console.log(profileSocialAccountDifference)
        console.log(profileSocialAccount)
    }, [profileSocialAccount, profileSocialAccountDifference, socialSitesList])

    const handleSocialSiteSelect = (event) => {
        const socialName = event.target.name.toString();
        const socialDict = {}
        socialDict[socialName] = event.target.value;
        // setSocialSitesDict({...socialSitesDict, socialDict});
        setSocialSitesDict({ ...socialSitesDict, ...socialDict });
    };

    const handleUpdateProfileSocialInfo = (event) => {
        const updateProfileFormData = new FormData();
        updateProfileFormData.append("social_account_dict", JSON.stringify({ ...userDataResults?.social_account_dict, ...socialSitesDict }));
        const updateProfileURL = `${process.env.REACT_APP_BASE_URL}/user/${tokenData?.user_id}/`;
        // const updateProfileURL = "https://blessedmayowa.pythonanywhere.com/updateProfile/";
        const headers = {
            'Accept': '*/*',
            // 'Origin': '*',
        };
        const fetchConfig = {
            method: 'PATCH',
            headers: headers,
            mode: 'cors',
            // body: updateProfileFormData,
            data: updateProfileFormData,
            cache: 'default',
        };
        event.preventDefault();

        // fetch(updateProfileURL, fetchConfig)
        axios(updateProfileURL, fetchConfig)
            .then(response => {
                if (response.status !== 200) {
                    throw response;
                }
                // return response.json();
                return response.json()
            })
            .then((data) => {
                console.log(data);
                // // Store the token from the login response
                // localStorage.setItem('nine_login', data['access']);

                // reset the login form
                event.target.reset();
                // reset the isSubmit loader
                setIsSubmit(false);
                setUpdateProfileSocialInfoResponseData({
                    message: "Login successful",
                    successful: true,
                    error: false
                });
                setTimeout(() => {
                    navigate('/profile');
                }, 800);
            })
            .catch((error) => {
                // let error_message;
                // if (error.status === 401) {
                //     error_message = "Kindly login to update your Profile"
                // } else if (error.status === 400) {
                //     error_message = "Unable to update your profile. Kindly fix any errors and re-submit"
                // } else if (error.status === 500) {
                //     error_message = "Check your internet connection"
                // } else {
                //     // There is no network connection or the Server is not up.
                //     error_message = "Oops. Network Error"
                // }
                const errorMessage = error.response?.data.error || "Unable to process request";
                setUpdateProfileSocialInfoResponseData({
                    message: errorMessage,
                    successful: false,
                    error: true
                });
                // reset the isSubmit loader
                setIsSubmit(false);
            });
    };
    const showLoadingState = (e) => {
        // e.target.innerHTML = "<span class='fa fa-spinner fa-spin'></span>";
        setIsSubmit(true);
    };

    const addSocialInput = (iconName) => {
        setClickedButton(iconName);
        console.log(iconName)
        console.log(socialInputsContainer.current)
        // socialInputsContainer.current.appendChild(socialInputs(iconName));
        console.log(socialInputsContainer.current.childNodes.length);
        if (appendedSocialSites.includes(iconName)) {
            setAppendedSocialSites(appendedSocialSites);
            // setVisibleSocialSites(appendedSocialSites);
        } else {
            setAppendedSocialSites([...appendedSocialSites, iconName]);
        }
        setVisibleSocialAccount([...visibleSocialAccount, iconName]);
    }

    return (
        <section className={"flex flex-row flex-nowrap justify-start w-full h-dvh dark:bg-111314 overflow-y-auto"}>
            {/* {
                size.windowWidth >= deviceWidthEnum.laptop
                    ? <ProfileDetailLeftNav userData={userDataResults} pageName={"social-info"} />
                    : null
            } */}
            <form className={"update-profile-container flex flex-col w-full bg-light pct:w-100 lg:pct:w-56|mg-r-auto|mg-t8 dark:bg-inherit dark:color-whitesmoke"} encType={"multipart/form-data"} onSubmit={(e) => handleUpdateProfileSocialInfo(e)}>
                {
                    size.windowWidth < deviceWidthEnum.laptop
                        ? <PageHeaderLink headerTitle={"Update social info"} />
                        : <PageHeaderLink headerTitle={"Social info"} />
                }
                {
                    updateProfileSocialInfoResponseData?.successful
                    && <div className="sticky top-[80px] z-10">
                        <NotifSuccess>
                            {updateProfileSocialInfoResponseData.message}
                        </NotifSuccess>
                    </div>
                }
                {
                    updateProfileSocialInfoResponseData?.error
                    && <div className="sticky top-[80px] z-10">
                        <NotifError>
                            {updateProfileSocialInfoResponseData.message}
                        </NotifError>
                    </div>
                }
                {/*<div className={"sticky top-0 left-0 flex flex-row align-items-center pct:w-100 h-10 bg-white bg-mica z-1"}>*/}
                {/*    <Link to="/profile"*/}
                {/*          className="d-block square-8 lh-9 top-0 left-1 lg:top-4|left-4|square-8|lh-8 color-initial text-center z-10 decoration-none">*/}
                {/*        <span className="fa fa-angle-left font-18 color-999"></span>*/}
                {/*    </Link>*/}
                {/*    <header className={"d-block pct:w-100 h-10 lh-10 pad-x2 font-18 font-bold text-left color-444A44"}>{"My Profile update"}</header>*/}
                {/*    <Link*/}
                {/*        to={"/profile/update"}*/}
                {/*        className={"abs px:top-20 right-4 h-5 lh-5 bg-green radius pad-x2 decoration-none color-white"}*/}
                {/*        onClick={(e) => showLoadingState(e)}>*/}
                {/*        {isSubmit ? <span className='fa fa-spinner fa-spin'></span> : "Save"}*/}
                {/*        /!*<span className={"fa fa-pen pad-l1 color-white"}></span>*!/*/}
                {/*    </Link>*/}
                {/*</div>*/}
                {/*<Link to="/profile" className="fixed top-4 left-4 square-4 lh-4 lg:top-4|left-4|square-8|lh-8 color-initial text-center font-14 radius-circle bg-light z-10"><span className="fa fa-arrow-left"></span></Link>*/}
                {/*UpdateProfileSocialInfo Page*/}
                <section className={"flex-1 flex flex-col pad-t4 pad-b4 bg-white-solid dark:bg-inherit"}>
                    {/*<header className={"pct:w-100 font-15 pad-x2 pad-y2 font-medium"}>
                        {"Social Profile"}
                    </header>*/}
                    <section className={"space-y-10 px-4 every:flex|flex-col|mg-y1|pad-2|font-14"} ref={socialInputsContainer}>
                        {/*
                        Show the four most important social media links first.
                        * Linkedin
                        * github
                        * stackoverflow
                        * youtube
                        * medium
                        */}
                        {/* {console.log(userDataResults?.social_account_dict)} */}
                        {/* {userDataResults?.social_account_dict && Object.keys(userDataResults?.social_account_dict)?.length} - ABC */}
                        {/* {profileSocialAccount?.length} - DEF */}
                        {/* {
                            profileSocialAccount?.map((eachSocialAccount, index) => {
                                if (Object.keys(userDataResults?.social_account_dict)?.length > 0) {
                                    return (
                                        <div key={eachSocialAccount.trim()} className={""}>
                                            <span className={""}>
                                                <span className={`fab fa-${eachSocialAccount.trim()} square-4 lh-4 text-center color-999`}></span>
                                                {eachSocialAccount.trim()}:
                                            </span>
                                            <input
                                                type="url"
                                                name={eachSocialAccount.trim()}
                                                defaultValue={userDataResults?.social_account_dict[eachSocialAccount]}
                                                // value={userDataResults?.phone_no || updateProfileData.phone_no}
                                                // value={userDataResults?.phone_no}
                                                placeholder={`Your ${eachSocialAccount.trim()} link`}
                                                onChange={handleSocialSiteSelect}
                                                className="pct:w-100 h-8 lh-8 pad-x2 mg-y1 outline:1px_solid_transparent border:1px_solid_lightgray outline-offset-2 focus:outline:2px_solid_gray transition:outline_80ms_ease radius-sm font-12"
                                            />
                                        </div>
                                    );
                                };
                            })
                        } */}
                        {/* {profileSocialAccountDifference?.length} - 123 */}
                        {/* {profileSocialAccount} */}
                        {/* <div></div> */}
                        {/* {visibleSocialAccount} - GHI */}
                        {
                            // Find the difference between the socialSitesList and the user defined profileSocialAccount list (array) and return the difference
                            // socialSitesList?.filter(x => !profileSocialAccount?.includes(x)).concat(profileSocialAccount?.filter(x => !socialSitesList.includes(x)))?.map((eachSocialSite, index) => {
                            // profileSocialAccount?.length < 4
                            // visibleSocialAccount?.length < 4
                            visibleSocialAccount?.map((eachSocialSite, index) => {
                                // ? socialSitesList?.map((eachSocialSite, index) => {
                                // if (index < 4) {
                                // if (userDataResults?.social_account_dict[eachSocialSite]) {
                                return (
                                    // appendedSocialSites.includes(eachSocialSite.trim()) && (
                                    <div key={eachSocialSite} className={""}>
                                        <FormField>
                                            <LabelField>
                                                <span className={"flex flex-row items-center space-x-2"}>
                                                    <span className={`fab fa-${eachSocialSite} ${brandColorMap[eachSocialSite]} size-8 leading-8 square-4 lh-4 text-lg text-center color-999`}></span>
                                                    <span className={""}>{eachSocialSite}:</span>
                                                </span>
                                            </LabelField>
                                            <TextInput
                                                type="url"
                                                name={eachSocialSite}
                                                classes={"font-semibold"}
                                                defaultValue={userDataResults?.social_account_dict[eachSocialSite]}
                                                placeholder={`Your ${eachSocialSite} link`}
                                                onChange={handleSocialSiteSelect}
                                            />
                                        </FormField>
                                        {/* <span className={""}>
                                            <span className={`fab fa-${eachSocialSite} square-4 lh-4 text-center color-999`}></span>
                                            {eachSocialSite}:
                                        </span>
                                        <input
                                            type="url"
                                            name={eachSocialSite}
                                            defaultValue={userDataResults?.social_account_dict[eachSocialSite]}
                                            // value={userDataResults?.phone_no || updateProfileData.phone_no}
                                            // value={userDataResults?.phone_no}
                                            placeholder={`Your ${eachSocialSite} link`}
                                            onChange={handleSocialSiteSelect}
                                            className="pct:w-100 h-8 lh-8 pad-x2 mg-y1 outline:1px_solid_transparent border:1px_solid_lightgray outline-offset-2 focus:outline:2px_solid_gray transition:outline_80ms_ease radius-sm font-12 dark:bg-222425|border:1px_solid_000304|color-whitesmoke dark:placeholder:color-darkgray dark:focus:outline:3px_solid_444445"
                                        /> */}
                                    </div>
                                    // )
                                );
                                // }
                                // }
                            })
                            // : null
                        }
                        {/* {
                            // Display the name of the social site and an input field to add that account to your profile.
                            // socialSitesList?.map((eachSocialSite, index) => {
                            appendedSocialSites?.map((eachSocialSite, index) => {
                                // if (index > 4) {
                                return (
                                    // appendedSocialSites?.includes(eachSocialSite.trim()) && 
                                    (
                                        <div key={eachSocialSite.trim()} className={""}>
                                            <span className={""}>
                                                <span className={`fab fa-${eachSocialSite.trim()} square-4 lh-4 text-center color-999`}></span>
                                                {eachSocialSite.trim()}:
                                            </span>
                                            <input
                                                type="url"
                                                name={eachSocialSite.trim()}
                                                // value={userDataResults?.phone_no || updateProfileData.phone_no}
                                                // value={userDataResults?.phone_no}
                                                placeholder={`Your ${eachSocialSite.trim()} link`}
                                                onChange={handleSocialSiteSelect}
                                                className="pct:w-100 h-8 lh-8 pad-x2 mg-y1 outline:1px_solid_transparent border:1px_solid_lightgray outline-offset-2 focus:outline:2px_solid_gray transition:outline_80ms_ease radius-sm font-12"
                                            />
                                        </div>
                                    )
                                );
                                // }
                            })
                        } */}
                    </section>
                    {/* {appendedSocialSites} - {appendedSocialSites.length} - {visibleSocialAccount} */}
                    <section className={""}>
                        {
                            moreSocialSitesContainer.current?.childNodes.length > 0
                                ? <header className={"px-4"}>
                                    Add more
                                </header>
                                : null
                        }
                        <section
                            className={"flex flex-row flex-nowrap gap-x-2 p-4 bg-mica text-center overflow-x-auto every:flex|flex-column|align-items-center|w-120|max-w-120|flex-nogrow|flex-noshrink|mg-x1|mg-y1|pad-x1|pad-y2|cursor-pointer hover:every:bg-lighter dark:hover:every:bg-333435"}
                            ref={moreSocialSitesContainer}>
                            {
                                // socialSitesList?.filter(x => !visibleSocialAccount?.includes(x)).concat(visibleSocialAccount?.filter(x => !socialSitesList.includes(x)))?.map((eachSocialSite, index) => {
                                profileSocialAccountDifference?.filter(x => !visibleSocialAccount?.includes(x))?.map((eachSocialSite, index) => {
                                    // profileSocialAccountDifference?.map((eachSocialSite, index) => {
                                    // socialSitesList?.map((eachSocialSite, index) => {
                                    // if (index < 4) {
                                    const eachSocialSiteTrimmed = eachSocialSite?.trim();
                                    return (
                                        // !visibleSocialAccount?.includes(eachSocialSiteTrimmed)
                                        // ? 
                                        <div key={eachSocialSite} className={"btn card w-32 py-4 shadow rounded-xl radius dark:bg-222425|shadow-unset"} data-icon-name={eachSocialSiteTrimmed} onClick={() => addSocialInput(eachSocialSiteTrimmed)}>
                                            <span className={`fab fa-${eachSocialSiteTrimmed} square-8 lh-8 font-18 text-center`}></span>
                                            <div className={"pct:w-100 text-ellipsis"}>{eachSocialSiteTrimmed.replace("-", "")}</div>
                                        </div>
                                        // : null
                                    );
                                    // }
                                })
                            }
                        </section>
                    </section>
                </section>
                <div className={"sticky bottom-0 pct:w-100 pt-8 pb-8 bg-white/80 backdrop-blur dark:bg-base-300 lg:pct:w-100 dark:bg-inherit"}>
                    {/* <button
                        type={"submit"}
                        onChange={(e) => { }}
                        onClick={(e) => showLoadingState(e)}
                        className={"d-block pct:w-64 max-w-480 h-7 lh-7 mg-x-auto pad-x2 border-0 bg-green color-white radius decoration-none disabled:bg-green-inverse"}
                        disabled={!updateProfileData}
                        ref={updateProfileSubmitButton}>
                        {isSubmit ? <span className='fa fa-spinner fa-spin'></span> : "Save"}
                    </button> */}
                    <ButtonUpdateSubmit
                        type={"submit"}
                        onChange={(e) => { }}
                        onClick={(e) => showLoadingState(e)}
                        disabled={!updateProfileData}
                    >
                        {isSubmit ? <LoadingButton /> : "Save"}
                    </ButtonUpdateSubmit>
                </div>
            </form>
        </section>
    );
}

export default UpdateProfileSocialInfo;