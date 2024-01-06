import React, { useRef, useState } from "react";
import { useNavigate, useLoaderData } from "react-router-dom";
import useUserData from "../hooks/useUserData";
import { Button, ButtonUpdateSubmit, LoadingButton, NotifError, NotifSuccess, PageHeaderLink, TextArea, TextInput } from "../components/Elements";
import 'react-phone-number-input/style.css'
import PhoneInput, { getCountries, getCountryCallingCode } from 'react-phone-number-input'
import en from 'react-phone-number-input/locale/en'
import { AppDetailLeftNav } from "./UpdateAppDetail";
import { ProfileDetailLeftNav } from "./ProfileView";
import axios from "axios";
import { deviceWidthEnum } from "../helpers/utils";
import { useDeviceSize } from "../hooks/useDeviceSize";
import useTokenData from "../hooks/useTokenData";
import { FormField, LabelField } from "../components/Forms";

const UpdateProfileBasicInfo = () => {
    const size = useDeviceSize();
    // const { me } = useRouteLoaderData("root");
    const { me } = useLoaderData();
    const userDataResults = me?.data;
    // const { windowWidth, screenWidth, deviceWidthEnum } = useDeviceWidth();
    const [updateProfileBasicInfoData, setUpdateProfileBasicInfoData] = useState({});
    const [mobile, setMobile] = useState("");
    const [address, setAddress] = useState("");
    const [mobileFocused, setMobileFocused] = useState(false);
    const [addressFocused, setAddressFocused] = useState(false);
    const mobileField = useRef(null);
    const addressField = useRef(null);
    const aboutMeField = useRef(null);
    const updateProfileSubmitButton = useRef(null);
    const { rawToken, isLoggedIn, tokenData } = useTokenData();
    // const { userDataResults, isError, isLoading, responseDetails } = useUserData();
    const navigate = useNavigate();
    const [updateProfileBasicInfoResponseData, setUpdateProfileBasicInfoResponseData] = useState({});
    const [isSubmit, setIsSubmit] = useState(false);
    const [clickedButton, setClickedButton] = useState(null);
    const [phoneInput, setPhoneInput] = useState();
    const [countryInput, setCountryInput] = useState();
    const [countryCodeInput, setCountryCodeInput] = useState();

    const handleUpdateProfileBasicInfo = (event) => {
        const updateProfileFormData = new FormData();
        console.log(phoneInput);
        console.log(countryInput);
        console.log(en[countryInput]);
        if (phoneInput) {
            updateProfileFormData.append("phone_no", phoneInput);
            updateProfileFormData.append("country", en[countryInput]);
            updateProfileFormData.append("country_code", countryInput);
        }
        if (updateProfileBasicInfoData?.address) {
            updateProfileFormData.append("address", updateProfileBasicInfoData?.address);
        }
        if (updateProfileBasicInfoData?.about_me) {
            updateProfileFormData.append("about_me", updateProfileBasicInfoData?.about_me);
        }
        /*if (updateProfileBasicInfoData?.country) {
            updateProfileFormData.append("country", updateProfileBasicInfoData?.country);
        }*/
        const updateProfileURL = `${process.env.REACT_APP_BASE_URL}/user/${userDataResults?.id}/`;
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
                // reset the isSubmit loader
                setIsSubmit(false);
                // setEmail('');
                // setPassword('');
                setUpdateProfileBasicInfoResponseData({
                    message: "Update successful",
                    successful: true,
                    error: false
                });
                // setTimeout(() => {
                //     navigate('/profile');
                // }, 800);
            })
            .catch((error) => {
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
    const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setUpdateProfileBasicInfoData(values => (
            { ...values, [name]: value }
        ));
    }

    const handleCountry = (country) => {
        // console.log("setcountry", country);
        setCountryInput(country);
        setCountryCodeInput(en[country]);
    }
    return (
        <section className={"flex flex-row flex-nowrap justify-start w-full h-dvh dark:bg-111314 overflow-y-auto"}>
            {/* {
                size.windowWidth >= deviceWidthEnum.laptop
                    ? <ProfileDetailLeftNav userData={userDataResults} pageName={"basic-info"} />
                    : null
            } */}
            <form className={"update-profile-container flex flex-col w-full pct:w-100 lg:pct:w-56|mg-r-auto|mg-t8"} encType={"multipart/form-data"} onSubmit={(e) => handleUpdateProfileBasicInfo(e)}>
                {
                    size.windowWidth < deviceWidthEnum.laptop
                        ? <PageHeaderLink headerTitle={"Update basic info"} />
                        : <PageHeaderLink headerTitle={"Basic info"} />
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
                {/*UpdateProfileBasicInfo Page*/}
                <section className={"flex-1 flex flex-col pad-t4 pad-b4 bg-white-solid dark:bg-inherit"}>
                    {/*<header className={"font-15 pad-x2"}>Personal details</header>*/}
                    <section className={"space-y-10 px-4 every:flex|flex-column|mg-y1|pad-2|font-14 dark:color-whitesmoke"}>
                        {/* About me */}
                        <FormField>
                            <LabelField text={"About me"}>
                                <TextArea
                                    name="about_me"
                                    id="id-basic-info-aboutme"
                                    placeholder="Write about yourself"
                                    defaultValue={userDataResults?.about_me || updateProfileBasicInfoData?.about_me}
                                    value={undefined}
                                    onChange={handleChange}
                                />
                            </LabelField>
                        </FormField>

                        {/* Phone number */}
                        <FormField>
                            <LabelField text={"Mobile"}>
                                <PhoneInput
                                    name={"phone_no"}
                                    labels={en}
                                    defaultCountry={""}
                                    className={"phone_input flex flex-row items-center space-x-0 w-full h-16 leading-[64px] bg-transparent pct:w-100 my-2 border:1px_solid_lightgray radius-sm transition:outline_80ms_ease *:bg-base-100 *:h-full *:self-start *:px-6 *:outline-0 *:border-0 *:rounded-xl has-[:focus]:first:*:bg-primary focus:*:outline-2 focus:*:outline-primary dark:focus:*:outline-0 dark:focus:*:bg-base-200 dark:focus-visible:*:outline-primary focus-within:outline-2 focus-within:outline-primary focus-within:border-transparent every:h-8|lh-8|pad-x2|outline:1px_solid_transparent|border-0|radius-inherit|font-12 focus-within:outline:2px_solid_gray|outline-offset-3 dark:bg-222425|border:1px_solid_000304|color-whitesmoke dark:placeholder:color-darkgray dark:focus:outline:3px_solid_444445"}
                                    placeholder="Your mobile number"
                                    smartCaret={true}
                                    value={phoneInput || userDataResults?.phone_no}
                                    onChange={(phoneInput) => { setPhoneInput(phoneInput) }}
                                    onCountryChange={handleCountry}
                                />
                            </LabelField>
                        </FormField>

                        {/* Address */}
                        <FormField>
                            <LabelField text={"Address"}>
                                <TextArea
                                    name="address"
                                    defaultValue={userDataResults?.address || updateProfileBasicInfoData.address}
                                    value={undefined}
                                    placeholder="Your Address"
                                    onChange={handleChange}
                                    onFocus={(e) => setAddressFocused(true)}
                                    ref={addressField}
                                />
                            </LabelField>
                        </FormField>

                        {/* Country */}
                        <FormField>
                            <LabelField text={"Country"}>
                                <select
                                    name="country"
                                    defaultValue={"NG"}
                                    value={userDataResults?.country_code || countryInput}
                                    className={"input input-lg select w-full"}
                                    // className="pct:w-100 h-8 lh-8 pad-x2 mg-y1 outline:1px_solid_transparent border:1px_solid_lightgray outline-offset-2 focus:outline:2px_solid_gray transition:outline_80ms_ease radius-sm font-12 disabled:cursor-not-allowed dark:bg-222425|border:1px_solid_000304|color-whitesmoke dark:placeholder:color-darkgray dark:focus:outline:3px_solid_444445 dark:disabled:bg-22242588|color-444546"
                                    disabled={true}
                                // onChange={(e) => { console.log(e.target.value); setCountryInput(e.target.value) }}
                                // onSelect={e => { console.log(e.target.value) }}
                                // onChange={(value) => { console.log(value); setCountryInput(en[value]); setCountryCodeInput(value) }}
                                // onSelect={res => console.log("res")}
                                >
                                    {/*<option value={""}>
                                        {en["ZZ"]}
                                    </option>*/}
                                    {getCountries().map((country) => (
                                        <option key={country} value={country}>
                                            {en[country]}
                                            {/*+{getCountryCallingCode(country)}*/}
                                        </option>
                                    ))}
                                </select>
                            </LabelField>
                        </FormField>

                    </section>
                    <section className="hidden">
                        <div className={"form-input-fields align-items-start"}>
                            <label htmlFor="id-new-app-description" className="pad-y1">
                                About me
                                <span className={"font-bold color-red pad-x-2"}>*</span>
                            </label>
                            <textarea
                                name="about_me"
                                id="id-basic-info-aboutme"
                                className="pct:w-100 h-12 pad-x2 pad-y2 mg-y1 outline:1px_solid_transparent border:1px_solid_BBB outline-offset-2 focus:outline:2px_solid_gray transition:outline_80ms_ease radius-smr font-family-inherit resize-none dark:bg-222425|border:1px_solid_000304|color-whitesmoke dark:placeholder:color-darkgray dark:focus:outline:3px_solid_444445"
                                // rows="10" cols="30"
                                placeholder="Write about yourself"
                                defaultValue={userDataResults?.about_me || updateProfileBasicInfoData?.about_me}
                                value={undefined}
                                ref={aboutMeField}
                                onChange={handleChange}
                            />
                            {/*onChange={(event, props) => appDescriptionChange(event, props)}*/}
                            <span className=""></span>
                        </div>

                        <div className={""}>
                            <span className={""}>Mobile: </span>
                            {/*<input
                                type="tel"
                                name="phone_no"
                                defaultValue={userDataResults?.phone_no}
                                placeholder="Your Mobile number"
                                onChange={handleChange}
                                ref={mobileField}
                                pattern="[0-9]{11,}"
                                className="pct:w-100 h-8 lh-8 pad-x2 mg-y1 outline:1px_solid_transparent border:1px_solid_lightgray outline-offset-2 focus:outline:2px_solid_gray transition:outline_80ms_ease radius-sm font-12"
                            />*/}
                            <PhoneInput
                                name={"phone_no"}
                                labels={en}
                                defaultCountry={""}
                                className={"phone_input pct:w-100 mg-y1 border:1px_solid_lightgray radius-sm transition:outline_80ms_ease every:h-8|lh-8|pad-x2|outline:1px_solid_transparent|border-0|radius-inherit|font-12 focus-within:outline:2px_solid_gray|outline-offset-3 dark:bg-222425|border:1px_solid_000304|color-whitesmoke dark:placeholder:color-darkgray dark:focus:outline:3px_solid_444445"}
                                placeholder="Your mobile number"
                                smartCaret={true}
                                value={phoneInput || userDataResults?.phone_no}
                                onChange={(phoneInput) => { setPhoneInput(phoneInput) }}
                                onCountryChange={handleCountry}
                            />
                        </div>
                        <div className={""}>
                            <span className={""}>Address: </span>
                            <textarea
                                name="address"
                                defaultValue={userDataResults?.address || updateProfileBasicInfoData.address}
                                value={undefined}
                                placeholder="Your Address"
                                onChange={handleChange}
                                onFocus={(e) => setAddressFocused(true)}
                                ref={addressField}
                                className="d-block pct:w-100 h-12 pad-y2 pad-x2 mg-y1 outline:1px_solid_transparent border:1px_solid_lightgray outline-offset-2 focus:outline:2px_solid_gray transition:outline_80ms_ease radius-sm font-12 resize-none dark:bg-222425|border:1px_solid_000304|color-whitesmoke dark:placeholder:color-darkgray dark:focus:outline:3px_solid_444445"
                            ></textarea>
                        </div>
                        <div className={""}>
                            <label>
                                Country
                                <select
                                    name="country"
                                    defaultValue={"NG"}
                                    value={userDataResults?.country_code || countryInput}
                                    className="pct:w-100 h-8 lh-8 pad-x2 mg-y1 outline:1px_solid_transparent border:1px_solid_lightgray outline-offset-2 focus:outline:2px_solid_gray transition:outline_80ms_ease radius-sm font-12 disabled:cursor-not-allowed dark:bg-222425|border:1px_solid_000304|color-whitesmoke dark:placeholder:color-darkgray dark:focus:outline:3px_solid_444445 dark:disabled:bg-22242588|color-444546"
                                    disabled={true}
                                // onChange={(e) => { console.log(e.target.value); setCountryInput(e.target.value) }}
                                // onSelect={e => { console.log(e.target.value) }}
                                // onChange={(value) => { console.log(value); setCountryInput(en[value]); setCountryCodeInput(value) }}
                                // onSelect={res => console.log("res")}
                                >
                                    {/*<option value={""}>
                                        {en["ZZ"]}
                                    </option>*/}
                                    {getCountries().map((country) => (
                                        <option key={country} value={country}>
                                            {en[country]}
                                            {/*+{getCountryCallingCode(country)}*/}
                                        </option>
                                    ))}
                                </select>
                            </label>
                        </div>
                    </section>
                </section>
                <div className={"sticky bottom-0 pct:w-100 mg-t-4 mg-b2 pt-8 pb-8 bg-white/70 backdrop-blur dark:bg-base-300 lg:pct:w-100 dark:bg-inherit"}>
                    {/* <button
                        type={"submit"}
                        onChange={(e) => { }}
                        onClick={(e) => showLoadingState(e)}
                        className={"d-block pct:w-64 max-w-480 h-7 lh-7 mg-x-auto pad-x2 border-0 bg-green color-white radius decoration-none cursor-pointer disabled:bg-green-inverse|cursor-not-allowed"}
                        disabled={!updateProfileBasicInfoData?.phone_no && !updateProfileBasicInfoData?.address && !updateProfileBasicInfoData?.about_me && !countryInput}
                        ref={updateProfileSubmitButton}>
                        {isSubmit ? <span className='fa fa-spinner fa-spin'></span> : "Save"}
                    </button> */}
                    <ButtonUpdateSubmit
                        type={"submit"}
                        onChange={(e) => { }}
                        onClick={(e) => showLoadingState(e)}
                        disabled={!updateProfileBasicInfoData?.phone_no && !updateProfileBasicInfoData?.address && !updateProfileBasicInfoData?.about_me && !countryInput}
                    >
                        {isSubmit ? <LoadingButton /> : "Save"}
                    </ButtonUpdateSubmit>
                </div>
            </form>
        </section>
    );
}

export default UpdateProfileBasicInfo;