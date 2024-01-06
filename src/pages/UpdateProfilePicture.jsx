import React, { useContext, useRef, useState } from "react";
import { Link, useNavigate, useLoaderData } from "react-router-dom";
import useUserData from "../hooks/useUserData";
import { UserContext } from "./Home";
import useFetch from "../hooks/useFetch";
import { Button, ButtonUpdateSubmit, FormInput, LoadingButton, NotifError, NotifSuccess, PageHeaderLink } from "../components/Elements";
import { NotDefined, deviceWidthEnum } from "../helpers/utils";
// import { useDeviceWidth } from "./useDeviceWidth";
import { ProfileDetailLeftNav } from "./ProfileView";
import axios from "axios";
import { useDeviceSize } from "../hooks/useDeviceSize";
import useTokenData from "../hooks/useTokenData";

const UpdateProfilePicture = () => {
    const size = useDeviceSize();
    // const { me } = useRouteLoaderData("root");
    const { me } = useLoaderData("root");
    const userDataResults = me?.data;
    // const { windowWidth, screenWidth, deviceWidthEnum } = useDeviceWidth();
    const profilePictureField = useRef(null);
    const { rawToken, isLoggedIn, tokenData } = useTokenData();
    // const { userDataResults, isError, isLoading, responseDetails } = useUserData();
    const navigate = useNavigate();
    const [updateProfileBasicInfoResponseData, setUpdateProfileBasicInfoResponseData] = useState({});
    const [isSubmit, setIsSubmit] = useState(false);
    const [userDp, setUserDp] = useState(null);
    const [userDpPreview, setUserDpPreview] = useState(null);

    const handleUserDpChange = (event) => {
        const selectedImage = event.target.files[0];
        setUserDp(selectedImage);
        setUserDpPreview(URL.createObjectURL(selectedImage));
    };

    const handleUpdateProfileBasicInfo = (event) => {
        const updateProfileFormData = new FormData();
        console.log(userDpPreview);
        console.log(profilePictureField.current.defaultvalue);
        console.log(userDataResults?.dp);
        if (userDp) {
            updateProfileFormData.append("dp", userDp);
        }
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
                return response.data;
            })
            .then((data) => {
                // // Store the token from the login response
                // localStorage.setItem('nine_login', data['access']);

                // reset the login form
                event.target.reset();
                // reset the isSubmit loader
                setIsSubmit(false);
                setUpdateProfileBasicInfoResponseData({
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
                setUpdateProfileBasicInfoResponseData({
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
    return (
        <section className={"flex flex-row flex-nowrap justify-start w-full h-dvh pct:h-100 dark:bg-111314 overflow-y-auto"}>
            {/* {console.log(userDataResults?.dp)} */}
            {/* {
                size.windowWidth >= deviceWidthEnum.laptop
                    ? <ProfileDetailLeftNav userData={userDataResults} pageName={"picture"} />
                    : null
            } */}
            <form className={"update-profile-container flex flex-col w-full pct:w-100 lg:pct:w-56|mg-r-auto|mg-t8"} encType={"multipart/form-data"} onSubmit={(e) => handleUpdateProfileBasicInfo(e)}>
                {
                    size.windowWidth < deviceWidthEnum.laptop
                        ? <PageHeaderLink headerTitle={"Update profile picture"} />
                        : <PageHeaderLink headerTitle={"Profile picture"} />
                }
                {
                    updateProfileBasicInfoResponseData?.successful
                    && <div className="sticky top-[80px] z-10">
                        <NotifSuccess>
                            {updateProfileBasicInfoResponseData.message}
                        </NotifSuccess>
                    </div>
                }
                {
                    updateProfileBasicInfoResponseData?.error
                    && <div className="sticky top-[80px] z-10">
                        <NotifError>
                            {updateProfileBasicInfoResponseData.message}
                        </NotifError>
                    </div>
                }
                {/*<div className={"sticky top-0 left-0 flex flex-row align-items-center pct:w-100 h-10 bg-white bg-mica z-1"}>*/}
                {/*    <Link to="/profile"*/}
                {/*          className="block square-8 lh-9 top-0 left-1 lg:top-4|left-4|square-8|lh-8 color-initial text-center z-10 decoration-none">*/}
                {/*        <span className="fa fa-angle-left font-18 color-999"></span>*/}
                {/*    </Link>*/}
                {/*    <header className={"block pct:w-100 h-10 lh-10 pad-x2 font-18 font-bold text-left color-444A44"}>{"My Profile update"}</header>*/}
                {/*    /!*<Link*/}
                {/*        to={"/profile/update"}*/}
                {/*        className={"abs px:top-20 right-4 h-5 lh-5 bg-green radius pad-x2 decoration-none color-white"}*/}
                {/*        onClick={(e) => showLoadingState(e)}>*/}
                {/*        {isSubmit ? <span className='fa fa-spinner fa-spin'></span> : "Save"}*/}
                {/*    </Link>*!/*/}
                {/*</div>*/}
                {/*UpdateProfilePicture Page*/}
                <div className={"flex-1 relative flex flex-col justify-start items-center pt-8 pb-4 bg-white-solid overflow-hidden dark:bg-inherit"}>
                    {
                        size.width >= deviceWidthEnum.laptop &&
                        <>
                            <div className={"flex flex-row abs neg:top-30 neg:left-20 pct:w-120 lh-normal color-F4FBF8 font-120 font-bold text-center overflow-hidden dark:color-11131466"}>
                                {userDataResults?.firstname}
                            </div>
                            <div className={"flex flex-row abs top-0 neg:left-20 pct:w-120 lh-normal color-F8F8F8 font-120 font-bold text-right overflow-hidden dark:color-11131466"}>{userDataResults?.lastname}</div>
                        </>
                    }
                    {
                        userDataResults?.dp
                            ? <img
                                alt=""
                                src={userDp ? userDpPreview : userDataResults?.dp}
                                className="relative size-36 leading-[144px] rounded-full square3-12 lh3-12 radius-circle bg-lighter border-0 border-DDD border-solid object-fill cursor-pointer hover:shadow:inset-0px-0px-16px-0px-DDD transition:box-shadow_200ms_ease lg:square3-12|lh3-12 dark:hover:shadow-unset"
                            />
                            : (
                                userDp
                                    ? <div className={"relative block mx-auto size-36 leading-[144px] rounded-full square3-12 lh3-12 radius-circle bg-floralwhite lg:square3-12|lh3-12"}>
                                        <img src={userDpPreview} alt={"Display"} style={{}}
                                            className={"block max-w-full h-full pct:max-w-100 pct:w-100 pct:h-100 object-center object-cover radius-inherit"} />
                                    </div>
                                    : <div
                                        className={"relative size-72 leading-[288px] rounded-full bg-base-200 square2-12 lh2-12 radius-circle bg-lighter border-0 border-DDD border-solid text-center font-bold cursor-pointer hover:shadow:inset-0px-0px-16px-0px-DDD transition:box-shadow_200ms_ease lg:square3-12|lh3-12 dark:bg-222425|color-whitesmoke dark:hover:shadow-unset"}>
                                    </div>
                            )
                    }
                    <div className={"relative block mx-auto text-center dark:color-whitesmoke"}>
                        <label htmlFor="id-user-dp-upload" className={"block btn btn-ghost h-12 leading-[48px] my-8 bg-base-200"}>Change Profile Picture</label>
                        <input
                            type="file"
                            id="id-user-dp-upload"
                            name={"dp"}
                            accept=".jpg,.jpeg,.png"
                            defaultValue={userDp}
                            // defaultValue={userDataResults?.dp.toString()}
                            // value={userDataResults?.dp || ""}
                            onChange={handleUserDpChange}
                            ref={profilePictureField}
                            hidden
                        />
                    </div>
                    {/* <div className={"text-4xl font-24 pt-8 pb-2 color-999"}>{tokenData?.firstname} {tokenData?.lastname}</div> */}
                    {/*<div className={"font-15 font-light"}>{tokenData?.email || tokenData?.phone_no}</div>*/}
                </div>
                <div className={"sticky bottom-0 pct:w-100 mt-4 mb-2 pt-4 pb-4 bg-white-solid lg:pct:w-56 dark:bg-111314"}>
                    {/* <button
                        type={"submit"}
                        className={"block pct:w-64 max-w-480 h-7 lh-7 mx-auto pad-x2 border-0 bg-green color-white radius decoration-none disabled:bg-green-inverse"}
                        disabled={!userDpPreview}
                        onChange={(e) => { }}
                        onClick={(e) => showLoadingState(e)}>
                        {isSubmit ? <span className='fa fa-spinner fa-spin'></span> : "Save"}
                    </button> */}
                    <ButtonUpdateSubmit
                        type={"submit"}
                        classes={"btn-wide block mx-auto"}
                        disabled={!userDpPreview}
                        onChange={(e) => { }}
                        onClick={(e) => showLoadingState(e)}
                    >
                        {isSubmit ? <LoadingButton /> : "Save"}
                    </ButtonUpdateSubmit>
                </div>
            </form>
        </section>
    );
}

export default UpdateProfilePicture;