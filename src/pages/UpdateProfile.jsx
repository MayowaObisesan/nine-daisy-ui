import React, { useContext, useRef, useState } from "react";
import useTokenData from "../helpers/tokenData";
import { Link, useLoaderData, useNavigate, useRouteLoaderData } from "react-router-dom";
import useUserData from "../hooks/useUserData";
import { UserContext } from "./Home";
import useFetch from "../hooks/useFetch";
import { Button, FormInput } from "../components/Elements";
import { NotDefined } from "../helpers/utils";
import axios from "axios";
import { getProfile } from "./loaders/appLoaders";

// export async function loader() {
//     const user = await getProfile();
//     return { user };
// }

const UpdateProfile = () => {
    const { me } = useRouteLoaderData("root");
    const userDataResults = me?.data;
    const { rawToken, isLoggedIn, tokenData } = useTokenData();
    const [updateProfileData, setUpdateProfileData] = useState({});
    // const [mobile, setMobile] = useState("");
    // const [address, setAddress] = useState("");
    // const [mobileFocused, setMobileFocused] = useState(false);
    const [addressFocused, setAddressFocused] = useState(false);
    const mobileField = useRef(null);
    const addressField = useRef(null);
    // const facebookURLField = useRef(null);
    // const twitterURLField = useRef(null);
    // const instagramURLField = useRef(null);
    // const youtubeURLField = useRef(null);
    // const tiktokURLField = useRef(null);
    const profilePictureField = useRef(null);
    const updateProfileSubmitButton = useRef(null);
    const socialInputsContainer = useRef(null);
    const moreSocialSitesContainer = useRef(null);
    // const { userDataResults, isError, isLoading, responseDetails } = useUserData();
    const navigate = useNavigate();
    // const [userData] = useFetch(`${process.env.REACT_APP_BASE_URL}/user/me/`);
    const [updateProfileResponseData, setUpdateProfileResponseData] = useState({});
    const [isSubmit, setIsSubmit] = useState(false);
    const [userDp, setUserDp] = useState(null);
    const [userDpPreview, setUserDpPreview] = useState(null);
    const [clickedButton, setClickedButton] = useState(null);
    const [visibleSocialSites, setVisibleSocialSites] = useState([]);
    const [socialSitesList] = useFetch(`${process.env.REACT_APP_BASE_URL}/app/social_list/`);
    const [socialSitesDict, setSocialSitesDict] = useState({});

    const handleSocialSiteSelect = (event) => {
        const socialName = event.target.name.toString();
        const socialDict = {}
        socialDict[socialName] = event.target.value;
        // setSocialSitesDict({...socialSitesDict, socialDict});
        setSocialSitesDict({ ...socialSitesDict, ...socialDict });
        // setAppScreenshotsPreview(
        //     files.map((file) => URL.createObjectURL(file))
        // );
    };

    const validateMobile = (e) => {

    };
    const validateAddress = (e) => {

    };

    const handleUserDpChange = (event) => {
        const selectedImage = event.target.files[0];
        setUserDp(selectedImage);
        setUserDpPreview(URL.createObjectURL(selectedImage));
    };

    const handleUpdateProfile = (event) => {
        const updateProfileFormData = new FormData();
        console.log(profilePictureField.current.defaultvalue);
        console.log(userDataResults?.dp);
        if (updateProfileData?.dp) {
            updateProfileFormData.append("dp", updateProfileData?.dp);
        }
        if (userDataResults?.phone_no) {
            updateProfileFormData.append("phone_no", userDataResults?.phone_no)
        }
        if (userDataResults?.address) {
            updateProfileFormData.append("address", userDataResults?.address);
        }
        if (userDataResults?.country) {
            updateProfileFormData.append("country", userDataResults?.country);
        }
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
                return response.data;
            })
            .then((data) => {
                console.log(data);
                // // Store the token from the login response
                // localStorage.setItem('nine_login', data['access']);

                // reset the login form
                event.target.reset();
                // reset the isSubmit loader
                setIsSubmit(false);
                // setEmail('');
                // setPassword('');
                setUpdateProfileResponseData({
                    message: "Login successful",
                    successful: true,
                    error: false
                });
                setTimeout(() => {
                    navigate('/profile');
                }, 800);
            })
            .catch((error) => {
                let error_message;
                if (error.status === 401) {
                    error_message = "Kindly login to update your Profile"
                } else if (error.status === 400) {
                    error_message = "Unable to update your profile. Kindly fix any errors and re-submit"
                } else if (error.status === 500) {
                    error_message = "Check your internet connection"
                } else {
                    // There is no network connection or the Server is not up.
                    error_message = "Oops. Network Error"
                }
                setUpdateProfileResponseData({
                    message: error_message,
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
    const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setUpdateProfileData(values => (
            { ...values, [name]: value }
        ));
    }

    const addSocialInput = (iconName) => {
        setClickedButton(iconName);
        console.log(iconName)
        console.log(socialInputsContainer.current)
        // socialInputsContainer.current.appendChild(socialInputs(iconName));
        console.log(socialInputsContainer.current.childNodes.length);
        if (visibleSocialSites.includes(iconName)) {
            setVisibleSocialSites(visibleSocialSites);
        } else {
            setVisibleSocialSites([...visibleSocialSites, iconName]);
        }
    }

    const socialInputs = (iconName) => {
        return (
            <div className={""}>
                <span className={""}><span className={`fab fa-${iconName} square-4 lh-4 text-center color-999`}></span>Instagram: </span>
                <input
                    type="url"
                    name={`${iconName}_url`}
                    // defaultValue={userDataResults?.instagram_url}
                    // value={userDataResults?.phone_no || updateProfileData.phone_no}
                    // value={userDataResults?.phone_no}
                    placeholder={`Your ${iconName} link`}
                    onChange={handleChange}
                    // ref={instagramURLField}
                    className="pct:w-100 h-8 lh-8 pad-x2 mg-y1 outline:1px_solid_transparent border:1px_solid_lightgray outline-offset-2 focus:outline:2px_solid_gray transition:outline_80ms_ease radius-sm font-12"
                />
            </div>
        )
    };
    return (
        <form className={"update-profile-container bg-light"} encType={"multipart/form-data"} onSubmit={(e) => handleUpdateProfile(e)}>
            <div className={"sticky top-0 left-0 flex flex-row align-items-center pct:w-100 h-10 bg-white bg-mica z-1"}>
                <Link to="/profile"
                    className="d-block square-8 lh-9 top-0 left-1 lg:top-4|left-4|square-8|lh-8 color-initial text-center z-10 decoration-none">
                    <span className="fa fa-angle-left font-18 color-999"></span>
                </Link>
                <header className={"d-block pct:w-100 h-10 lh-10 pad-x2 font-18 font-bold text-left color-444A44"}>{"My Profile update"}</header>
                <Link
                    to={"/profile/update"}
                    className={"abs px:top-20 right-4 h-5 lh-5 bg-green radius pad-x2 decoration-none color-white"}
                    onClick={(e) => showLoadingState(e)}>
                    {isSubmit ? <span className='fa fa-spinner fa-spin'></span> : "Save"}
                    {/*<span className={"fa fa-pen pad-l1 color-white"}></span>*/}
                </Link>
                {/*<Button*/}
                {/*    type={"submit"}*/}
                {/*    reff={updateProfileSubmitButton}>*/}
                {/*</Button>*/}
            </div>
            {/*<Link to="/profile" className="fixed top-4 left-4 square-4 lh-4 lg:top-4|left-4|square-8|lh-8 color-initial text-center font-14 radius-circle bg-light z-10"><span className="fa fa-arrow-left"></span></Link>*/}
            {/*UpdateProfile Page*/}
            <div className={"relative flex flex-column justify-center align-items-center flex-basis flex-grow pad-t8 pad-b4 bg-white-solid overflow-hidden"}>
                <div className={"flex flex-row abs neg:top-30 neg:left-20 pct:w-120 lh-normal color-F4FBF8 font-120 font-bold text-center overflow-hidden"}>
                    {userDataResults?.firstname}
                </div>
                <div className={"flex flex-row abs top-0 neg:left-20 pct:w-120 lh-normal color-F8F8F8 font-120 font-bold text-right overflow-hidden"}>{userDataResults?.lastname}</div>
                {
                    userDataResults?.dp
                        ? <img alt=""
                            className="sibling-user relative square-12 lh-12 radius-circle bg-lighter border-0 border-DDD border-solid bg-green-inverse cursor-pointer hover:shadow:inset-0px-0px-16px-0px-DDD transition:box-shadow_200ms_ease"
                            src={userDp ? userDpPreview : userDataResults?.dp}
                        />
                        : (
                            userDp
                                ? <div className={"relative d-block mg-x-auto square-12 lh-12 radius-circle bg-floralwhite"}>
                                    <img src={userDpPreview} alt={"upload"} style={{}}
                                        className={"d-block pct:max-w-100 pct:w-100 pct:h-100 object-center object-cover radius-inherit"} />
                                </div>
                                : <div
                                    className={"sibling-user relative square-12 lh-12 radius-circle bg-lighter border-0 border-DDD border-solid bg-green-inverse text-center font-bold cursor-pointer hover:shadow:inset-0px-0px-16px-0px-DDD transition:box-shadow_200ms_ease"}>
                                    {tokenData?.firstname?.split('')[0].toUpperCase().toString() + tokenData?.lastname?.split('')[0].toUpperCase().toString()}
                                </div>
                        )
                }
                <div className={"relative d-block mg-x-auto text-center"}>
                    {/*<div className={"d-block mg-x-auto square-12 lh-12 radius-circle bg-floralwhite"}>
                        {
                            userDp && (
                                <div className={"relative d-block pct:w-100 pct:h-100 bg-orange radius-inherit"}>
                                    <img src={userDpPreview} alt={"App Image"} style={{}}
                                         className={"d-block pct:max-w-100 pct:h-100 object-center object-cover radius-inherit"}/>
                                </div>
                            )
                        }
                    </div>*/}
                    <label htmlFor="id-user-dp-upload">Change Profile Picture</label>
                    <input
                        type="file"
                        id="id-user-dp-upload"
                        name={"dp"}
                        accept=".jpg,.jpeg,.png"
                        defaultValue={userDataResults?.dp}
                        // value={userDataResults?.dp || ""}
                        onChange={handleUserDpChange}
                        ref={profilePictureField}
                        hidden
                    />
                </div>
                <div className={"font-24 pad-t2 pad-b1"}>{tokenData?.firstname} {tokenData?.lastname}</div>
                <div className={"font-15 font-light"}>{tokenData?.email || tokenData?.phone_no}</div>
            </div>
            <section className={"flex flex-column pad-t4 pad-b4 bg-white-solid"}>
                <header className={"font-15 pad-x2"}>Personal details</header>
                {/*{JSON.stringify(userDataResults)}*/}
                {/*{updateProfileData?.phone_no}*/}
                <section className={"every:flex|flex-column|mg-y1|pad-2|font-14"}>
                    <div className={""}>
                        <span className={""}>Mobile: </span>
                        <input
                            type="tel"
                            name="phone_no"
                            defaultValue={userDataResults?.phone_no}
                            // value={userDataResults?.phone_no || updateProfileData.phone_no}
                            // value={userDataResults?.phone_no}
                            placeholder="Your Mobile number"
                            onChange={handleChange}
                            ref={mobileField}
                            pattern="[0-9]{11,}"
                            className="pct:w-100 h-8 lh-8 pad-x2 mg-y1 outline:1px_solid_transparent border:1px_solid_lightgray outline-offset-2 focus:outline:2px_solid_gray transition:outline_80ms_ease radius-sm font-12"
                        />
                    </div>
                    <div className={""}>
                        <span className={""}>Address: </span>
                        <textarea
                            name="address"
                            defaultValue={userDataResults?.address || updateProfileData.address}
                            value={undefined}
                            placeholder="Your Address"
                            onChange={handleChange}
                            onFocus={(e) => setAddressFocused(true)}
                            onBlur={(e) => validateAddress(e)}
                            ref={addressField}
                            className="d-block pct:w-100 h-12 pad-y2 pad-x2 mg-y1 outline:1px_solid_transparent border:1px_solid_lightgray outline-offset-2 focus:outline:2px_solid_gray transition:outline_80ms_ease radius-sm font-12 resize-none"
                        ></textarea>
                    </div>
                    <div className={""}>
                        <label>
                            Country
                            <select
                                name="country"
                                defaultValue={userDataResults?.country}
                                // value={updateProfileData.country}
                                onChange={handleChange}
                                className="pct:w-100 h-8 lh-8 pad-x2 mg-y1 outline:1px_solid_transparent border:1px_solid_lightgray outline-offset-2 focus:outline:2px_solid_gray transition:outline_80ms_ease radius-sm font-12"
                            >
                                <option value="United States">United States</option>
                                <option value="United Kingdom">United Kingdom</option>
                                <option value="Nigeria">Nigeria</option>
                                <option value="Canada">Canada</option>
                                <option value="Uganda">Uganda</option>
                                <option value="Kenya">Kenya</option>

                            </select>
                        </label>
                    </div>
                    {/*<div className={""}>
                        <span className={""}>Date Joined: </span>
                        <div className={""}>{new Date(userDataResults?.date_joined).toDateString()}</div>
                    </div>*/}
                </section>
            </section>
            <section className={"flex flex-column mg-y-4 pad-t4 pad-b4 bg-white-solid"}>
                <header className={"pct:w-100 font-15 pad-x2 pad-y2 font-medium"}>
                    {"Social Profile".toUpperCase()}
                </header>
                <section className={"every:flex|flex-column|mg-y1|pad-2|font-14"} ref={socialInputsContainer}>
                    {/*<div className={""}>
                        <span className={""}><span className={"fab fa-linkedin square-4 lh-4 text-center color-999"}></span> linkedin: </span>
                        <input
                            type="url"
                            name="linkedin_url"
                            defaultValue={userDataResults?.linkedin_url}
                            // value={userDataResults?.phone_no || updateProfileData.phone_no}
                            // value={userDataResults?.phone_no}
                            placeholder="Your linkedin link"
                            onChange={handleChange}
                            // ref={linkedinURLField}
                            className="pct:w-100 h-8 lh-8 pad-x2 mg-y1 outline:1px_solid_transparent border:1px_solid_lightgray outline-offset-2 focus:outline:2px_solid_gray transition:outline_80ms_ease radius-sm font-12"
                        />
                    </div>
                    <div className={""}>
                        <span className={""}><span className={"fab fa-facebook square-4 lh-4 text-center color-999"}></span> facebook: </span>
                        <input
                            type="url"
                            name="facebook_url"
                            defaultValue={userDataResults?.facebook_url}
                            // value={userDataResults?.phone_no || updateProfileData.phone_no}
                            // value={userDataResults?.phone_no}
                            placeholder="Your facebook link"
                            onChange={handleChange}
                            ref={facebookURLField}
                            className="pct:w-100 h-8 lh-8 pad-x2 mg-y1 outline:1px_solid_transparent border:1px_solid_lightgray outline-offset-2 focus:outline:2px_solid_gray transition:outline_80ms_ease radius-sm font-12"
                        />
                    </div>
                    <div className={""}>
                        <span className={""}><span className={"fab fa-twitter square-4 lh-4 text-center color-999"}></span> Twitter: </span>
                        <input
                            type="url"
                            name="twitter_url"
                            defaultValue={userDataResults?.twitter_url}
                            // value={userDataResults?.phone_no || updateProfileData.phone_no}
                            // value={userDataResults?.phone_no}
                            placeholder="Your twitter link"
                            onChange={handleChange}
                            ref={twitterURLField}
                            className="pct:w-100 h-8 lh-8 pad-x2 mg-y1 outline:1px_solid_transparent border:1px_solid_lightgray outline-offset-2 focus:outline:2px_solid_gray transition:outline_80ms_ease radius-sm font-12"
                        />
                    </div>
                    <div className={""}>
                        <span className={""}><span className="fab fa-youtube square-4 lh-4 text-center color-999"></span> Youtube: </span>
                        <input
                            type="url"
                            name="youtube_url"
                            defaultValue={userDataResults?.youtube_url}
                            // value={userDataResults?.phone_no || updateProfileData.phone_no}
                            // value={userDataResults?.phone_no}
                            placeholder="Your youtube link"
                            onChange={handleChange}
                            ref={youtubeURLField}
                            className="pct:w-100 h-8 lh-8 pad-x2 mg-y1 outline:1px_solid_transparent border:1px_solid_lightgray outline-offset-2 focus:outline:2px_solid_gray transition:outline_80ms_ease radius-sm font-12"
                        />
                    </div>
                    <div className={""}>
                        <span className={""}><span className="fab fa-instagram square-4 lh-4 text-center color-999"></span>Instagram: </span>
                        <input
                            type="url"
                            name="instagram_url"
                            defaultValue={userDataResults?.instagram_url}
                            // value={userDataResults?.phone_no || updateProfileData.phone_no}
                            // value={userDataResults?.phone_no}
                            placeholder="Your instagram link"
                            onChange={handleChange}
                            ref={instagramURLField}
                            className="pct:w-100 h-8 lh-8 pad-x2 mg-y1 outline:1px_solid_transparent border:1px_solid_lightgray outline-offset-2 focus:outline:2px_solid_gray transition:outline_80ms_ease radius-sm font-12"
                        />
                    </div>
                    <div className={""}>
                        <span className={""}><span className="fab fa-tiktok square-4 lh-4 text-center color-999"></span>Tiktok: </span>
                        <input
                            type="url"
                            name="tiktok_url"
                            defaultValue={userDataResults?.tiktok_url}
                            // value={userDataResults?.phone_no || updateProfileData.phone_no}
                            // value={userDataResults?.phone_no}
                            placeholder="Your tiktok link"
                            onChange={handleChange}
                            ref={tiktokURLField}
                            className="pct:w-100 h-8 lh-8 pad-x2 mg-y1 outline:1px_solid_transparent border:1px_solid_lightgray outline-offset-2 focus:outline:2px_solid_gray transition:outline_80ms_ease radius-sm font-12"
                        />
                    </div>*/}
                    {/*
                    Show the four most important social media links first.
                    * Linkedin
                    * github
                    * stackoverflow
                    * youtube
                    * medium
                    */}
                    {
                        socialSitesList?.map((eachSocialSite, index) => {
                            if (index <= 4) {
                                return (
                                    // visibleSocialSites.includes(eachSocialSite.trim()) && (
                                    <div key={eachSocialSite.trim()} className={""}>
                                        <span className={""}>
                                            <span className={`fab fa-${eachSocialSite.trim()} square-4 lh-4 text-center color-999`}></span>
                                            {eachSocialSite.trim()}:
                                        </span>
                                        <input
                                            type="url"
                                            name={eachSocialSite.trim()}
                                            defaultValue={userDataResults?.social_account_dict[eachSocialSite]}
                                            // value={userDataResults?.phone_no || updateProfileData.phone_no}
                                            // value={userDataResults?.phone_no}
                                            placeholder={`Your ${eachSocialSite.trim()} link`}
                                            onChange={handleSocialSiteSelect}
                                            // ref={instagramURLField}
                                            className="pct:w-100 h-8 lh-8 pad-x2 mg-y1 outline:1px_solid_transparent border:1px_solid_lightgray outline-offset-2 focus:outline:2px_solid_gray transition:outline_80ms_ease radius-sm font-12"
                                        />
                                    </div>
                                    // )
                                );
                            }
                        })
                    }
                    {
                        socialSitesList?.map((eachSocialSite, index) => {
                            if (index > 4) {
                                return (
                                    visibleSocialSites.includes(eachSocialSite.trim()) && (
                                        <div key={eachSocialSite.trim()} className={""}>
                                            <span className={""}>
                                                <span className={`fab fa-${eachSocialSite.trim()} square-4 lh-4 text-center color-999`}></span>
                                                {eachSocialSite.trim()}:
                                            </span>
                                            <input
                                                type="url"
                                                name={eachSocialSite.trim()}
                                                // defaultValue={userDataResults?.instagram_url}
                                                // value={userDataResults?.phone_no || updateProfileData.phone_no}
                                                // value={userDataResults?.phone_no}
                                                placeholder={`Your ${eachSocialSite.trim()} link`}
                                                onChange={handleSocialSiteSelect}
                                                // ref={instagramURLField}
                                                className="pct:w-100 h-8 lh-8 pad-x2 mg-y1 outline:1px_solid_transparent border:1px_solid_lightgray outline-offset-2 focus:outline:2px_solid_gray transition:outline_80ms_ease radius-sm font-12"
                                            />
                                        </div>
                                    )
                                );
                            }
                        })
                    }
                </section>
                <section className={""}>
                    {
                        moreSocialSitesContainer.current?.childNodes.length > 0
                            ? <header className={"pad-x2"}>
                                Add more
                            </header>
                            : null
                    }
                    <section className={"flex flex-row flex-nowrap pad-x2 bg-mica text-center overflow-x-auto every:flex|flex-column|align-items-center|w-120|max-w-120|flex-nogrow|flex-noshrink|mg-x1|mg-y1|pad-x1|pad-y2"} ref={moreSocialSitesContainer}>
                        {
                            socialSitesList?.map((eachSocialSite, index) => {
                                if (index > 4) {
                                    const eachSocialSiteTrimmed = eachSocialSite.trim();
                                    return (
                                        !visibleSocialSites.includes(eachSocialSiteTrimmed) &&
                                        <div key={eachSocialSite} className={"shadow radius"} data-icon-name={eachSocialSiteTrimmed} onClick={() => addSocialInput(eachSocialSiteTrimmed)}>
                                            <span className={`fab fa-${eachSocialSiteTrimmed} square-8 lh-8 font-18 text-center`}></span>
                                            <div className={"pct:w-100 text-ellipsis"}>{eachSocialSiteTrimmed.replace("-", "")}</div>
                                        </div>
                                    );
                                }
                            })
                        }
                    </section>
                </section>
            </section>
            <div className={"mg-t-4 mg-b2 pad-t4 pad-b4 bg-white-solid"}>
                <Button
                    type={"submit"}
                    onChange={(e) => { }}
                    onClick={(e) => showLoadingState(e)}
                    reff={updateProfileSubmitButton}>
                    {isSubmit ? <span className='fa fa-spinner fa-spin'></span> : "Save"}
                </Button>
            </div>
        </form>
    );
}

export default UpdateProfile;