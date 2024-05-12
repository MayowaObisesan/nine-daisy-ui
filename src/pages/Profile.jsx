import React, { useEffect } from "react";
import { Link, useLoaderData } from "react-router-dom";
import useUserData from "../hooks/useUserData";
// import { tokenState, UserContext } from "./Home";
// import { useAtomValue } from "jotai";
// import { BasicGridAppBoxes } from "./AppBoxes";
import useFetch from "../hooks/useFetch";
// import { NavBar } from "./Base";
// import { useDeviceWidth } from "./useDeviceWidth";
import { Avatar, Button, HeaderLink, PageHeaderLink } from "../components/Elements";
import { deviceWidthEnum, getSocialAccountHandle } from "../helpers/utils";
import { getProfile } from "./loaders/appLoaders";
import { useDeviceSize } from "../hooks/useDeviceSize";
import { BasicGridAppBoxes } from "../components/AppBoxes";
import NavBar from "../components/NavBar";
import useTokenData from "../hooks/useTokenData";
import { brandColorMap } from "../helpers/constants";

export async function loader() {
    const me = await getProfile();
    return { me };
}

const PageSectionContainer = ({ classes, children }) => {
    return (
        <section className={`flex flex-col pt-8 pb-8 ${classes}`}>
            {children}
        </section>
    )
}

const PageSectionBody = ({ classes, children }) => {
    return (
        <section className={`${classes}`}>
            {children}
        </section>
    )
}

const ListContentContainer = ({ icon, title, body, classes, children }) => {
    return (
        <section className={`flex flex-row items-start gap-x-2 px-2 py-4 ${classes}`}>
            {
                icon &&
                <div className="size-10 leading-10 text-center">{icon}</div>
            }
            <section className="">
                <div>{title}</div>
                <div className="text-xl py-1">{body}</div>
                {children}
            </section>
        </section>
    )
}

export const PersonalDetailsSection = ({ userData, showArrow, linkUrl }) => {
    return (
        <PageSectionContainer>
            <HeaderLink linkUrl={linkUrl} headerTitle={"Personal Details"} showArrow={showArrow} headerClasses={"lg:text-5xl"} />
            <PageSectionBody classes={"space-y-4 px-4"}>
                <ListContentContainer
                    title={<div className="font-semibold">{"About me"}</div>}
                >
                    <div className={"font-medium text-lg"}>{userData?.about_me}</div>
                </ListContentContainer>

                <ListContentContainer
                    icon={<span className="fa fa-mobile"></span>}
                    classes={"group hover:bg-base-200 hover:rounded-xl"}
                    title={"Mobile"}
                    body={<a href={`tel:${userData?.phone_no}`} className={"font-bold group-hover:underline"}>{userData?.phone_no || "-"}</a>}
                >
                </ListContentContainer>

                <ListContentContainer
                    icon={<span className="fa fa-map-pin"></span>}
                    classes={"hover:bg-base-200 hover:rounded-xl"}
                    title={"Address"}
                    body={<span className={"font-bold"}>{userData?.address}</span>}
                />

                <ListContentContainer
                    icon={<span className="far fa-flag"></span>}
                    title={"Country"}
                    body={<span className={"font-bold"}>{userData?.country}</span>}
                />

                <ListContentContainer
                    icon={<span className="far fa-calendar-plus"></span>}
                    title={"Date Joined"}
                >
                    <div className={"text-xl font-bold"}>{new Date(userData?.date_joined).toDateString() || "-"}</div>
                </ListContentContainer>
            </PageSectionBody>
        </PageSectionContainer>
    )
}

export const AppsSection = ({ userData, userApps, userId, showArrow, linkUrl }) => {
    const tokenData = useTokenData();

    return (
        <PageSectionContainer>
            {
                userId === tokenData.tokenData?.user_id
                    ? <HeaderLink linkUrl={`/user/${tokenData.tokenData?.user_id}/apps` || linkUrl} headerTitle={"Your Apps"} showArrow={showArrow} />
                    : <HeaderLink linkUrl={"apps" || linkUrl} headerTitle={userId === tokenData.tokenData?.user_id ? "Your Apps" : `${userData?.firstname} Apps`} showArrow={showArrow} />
            }
            <PageSectionBody classes={"space-y-4"}>
                <section className={"flex flex-row flex-nowrap justify-start items-start pad-x2 py-4 overflow-x-auto"}>
                    {
                        userApps?.results?.length > 0
                            ? userApps?.results.map((eachUserApps, index) => {
                                return (
                                    index < 6 ? <BasicGridAppBoxes key={eachUserApps.id} {...eachUserApps} /> : null
                                )
                            })
                            : <div className={"mx-auto my-2 p-4 text-lg text-center font-semibold color-gray"}>No apps yet</div>
                    }
                </section>
                {
                    userData?.clicks > 0
                        ? <section className={"every:flex|flex-column|mg-y1|pad-2|font-14"}>
                            <div className={""}>
                                <span className={""}><span className={"fa fa-eye square-4 lh-4 text-center color-999"}></span> 144 views </span>
                                {/*<span className={"pad-l4 pad-y1"}>{userData?.phone_no || <NotDefined />}</span>*/}
                            </div>
                            <div className={""}>
                                <span className={""}><span className={"fa fa-smile square-4 lh-4 text-center color-999"}></span> 16 reactions (Likes, clap) </span>
                                {/*<span className={"pad-l4 pad-y1"}>{userData?.country || <NotDefined />}</span>*/}
                            </div>
                            <div className={""}>
                                <span className={""}><span className="fa fa-save square-4 lh-4 text-center color-999"></span> 4 saves </span>
                                {/*<span className={"pad-l4 pad-y1"}>{userData?.address || <NotDefined />}</span>*/}
                            </div>
                            <div className={""}>
                                <span className={""}><span className="fa fa-money square-4 lh-4 text-center color-999"></span> 5 Donations (#6000) </span>
                                {/*<span className={"pad-l4 pad-y1"}>{new Date(userData?.date_joined).toLocaleDateString() || <NotDefined />}</span>*/}
                            </div>
                        </section>
                        : null
                }
            </PageSectionBody>
        </PageSectionContainer>
    )
}

export const SocialProfileSection = ({ userData, socialSitesList, showArrow, linkUrl }) => {
    return (
        <PageSectionContainer>
            <HeaderLink headerTitle={"Social Profile"} showArrow={showArrow} linkUrl={linkUrl} />
            <PageSectionBody classes={"space-y-4 px-4"}>
                {
                    userData && socialSitesList?.filter(item => Object.keys(userData?.social_account_dict).includes(item)).length > 0
                        ? socialSitesList?.map((socialSite, index) => {
                            if (userData?.social_account_dict[socialSite]) {
                                return (
                                    <div key={index} className={"dark:color-whitesmoke"}>
                                        <ListContentContainer
                                            icon={<span
                                                className={`fab fa-${socialSite} text-xl ${brandColorMap[socialSite]}`}>
                                            </span>}
                                            classes={"group hover:bg-base-200 hover:rounded-xl"}
                                            title={socialSite}
                                            body={<a href={userData?.social_account_dict[socialSite]}
                                                target={"_blank"}
                                                rel="noreferrer"
                                                className={"group-hover:underline pad-l4 pad-y1 font-semibold color-initial dark:color-darkgray"}
                                            >
                                                @{getSocialAccountHandle(userData?.social_account_dict[socialSite])}
                                            </a>}
                                        >
                                        </ListContentContainer>
                                    </div>
                                )
                            }
                        })
                        : <div className={"text-center color-gray"}>No account configured</div>
                }
            </PageSectionBody>
        </PageSectionContainer>
    )
}

export const ProfileBasicDetailsCard = ({ userData }) => {
    const size = useDeviceSize();

    return (
        <div
            className={"relative flex flex-col md:flex-row justify-start items-center md:gap-x-8 lg:gap-x-4 flex-basis flex-grow bg-white/60 md:bg-base-100 dark:bg-base-200 py-12 md:px-16 lg:px-16 md:py-24 rounded-3xl overflow-hidden"}>
            <Avatar
                src={userData?.dp}
                alt={"profile"}
                classes={"w-24 size-24 leading-[96px] md:size-40 leading-[160px] lg:size-40 lg:leading-[160px] font-bold text-xl lg:text-3xl bg-gray-200"}
            >
                {
                    !userData?.dp &&
                    userData?.firstname?.split('')[0].toUpperCase() + userData?.lastname?.split('')[0].toUpperCase()
                }
            </Avatar>
            <div
                className={"block dark:color-darkgray"}>
                <div className={"font-bold px-4 py-6 text-center text-4xl md:text-6xl md:text-left"}>
                    {userData?.firstname} {userData?.lastname}
                </div>
                {/* <div
                                    className={"relative text-lg font-medium py-2 text-left dark:color-whitesmoke"}>
                                    {userData?.email}
                                    {userData?.phone_no}
                                </div> */}
                <div className={"flex flex-col items-center md:flex-row flex-wrap justify-center md:justify-start"}>
                    {
                        size.windowWidth < deviceWidthEnum.tablet
                            ? <div className={"flex flex-col items-center gap-y-3"}>
                                <div className={"relative text-xl leading-normal font-15"}>
                                    <a href={`mailto: ${userData?.email}`} className={"hover:underline"}>{userData?.email}</a>
                                </div>
                                <div className={"relative text-xl leading-normal font-semibold"}>
                                    <a href={`tel: ${userData?.phone_no}`} className={"font-semibold md:font-normal hover:underline"}>{userData?.phone_no}</a>
                                </div>
                            </div>
                            : <>
                                <ListContentContainer
                                    icon={<span className={"fa fa-message"}></span>}
                                    classes={"hover:underline rounded-2xl"}
                                    body={<a href={`mailto: ${userData?.email}`}>{userData?.email}</a>}
                                />
                                <ListContentContainer
                                    icon={<span className={"fa fa-mobile"}></span>}
                                    classes={"hover:underline rounded-2xl"}
                                    body={<a href={`tel: ${userData?.phone_no}`} className={"font-semibold md:font-normal"}>{userData?.phone_no}</a>}
                                />
                            </>
                    }
                </div>
                {
                    userData?.tags
                        ? <div className={"relative block text-left my-2 lg:my-2"}>
                            {
                                "python, javascript, golang".split(",").map((each_user_skills, index) => {
                                    return (
                                        <span key={index}
                                            className={"bg-light radius p-2 mx-4 lg:text-lg lg:font-13"}>{each_user_skills}</span>
                                    )
                                })
                            }
                        </div>
                        : null
                }
                {/* {
                                    userId === tokenData?.user_id
                                        ? <Link to={"/profile/update"}
                                            className={"block h-5 lh-5 bg-green radius px-4 mt-4 ml-auto decoration-none color-white"}>
                                            Edit
                                            <span className={"fa fa-pen pl-2 color-white"}></span></Link>
                                        : null
                                } */}
            </div>
        </div>
    )
}

const ProfileBasicSocialListCard = ({ userData, socialSitesList, brandColorMap }) => {
    return (
        <>
            {
                userData && socialSitesList?.filter(item => Object.keys(userData?.social_account_dict).includes(item)).length > 0
                && <div className={"flex flex-row justify-center lg:justify-start gap-x-8 md:gap-x-12 lg:gap-x-20 px-4"}>
                    {
                        socialSitesList?.map((socialSite, index) => {
                            if (userData?.social_account_dict[socialSite]) {
                                return (
                                    <div key={index} className={"l:w-32"}>
                                        <a href={userData?.social_account_dict[socialSite]}
                                            target={"_blank"}
                                            rel="noreferrer"
                                            className={"bg-base-200 text-center rounded-xl font-semibold color-initial dark:color-darkgray"}
                                        >
                                            <div className={"lg:tooltip lg:tooltip-bottom lg:tooltip-info"} data-tip={`@${getSocialAccountHandle(userData?.social_account_dict[socialSite])}`}>
                                                <span
                                                    className={`fab fa-${socialSite} block w-16 h-16 leading-[64px] bg-base-100 hover:bg-base-200 rounded-xl text-2xl ${brandColorMap[socialSite]}`}>
                                                </span>
                                            </div>
                                        </a>
                                    </div>
                                )
                            }
                        })
                    }
                </div>
            }
        </>
    )
}

const ProfileBannerAbstractCard = ({ userData, userApps }) => {
    return (
        <section className={"absolute right-0 bg-green-30 min-w-[400px] w-[46%] flex-1 z-0 flex flex-col items-end gap-y-8 px-8 opacity-15 overflow-hidden"}>
            <div className={"flex flex-row justify-end flex-wrap w-full"}>
                {
                    userApps?.results.slice(0, 1).map((eachApp, index) => (
                        <div className={"rotate-6 opacity-60 pointer-events-none select-none"}>
                            <BasicGridAppBoxes {...eachApp} />
                        </div>
                    ))
                }
            </div>
            <div className={"absolute left-48 top-40 flex flex-row"}>
                {
                    userApps?.results.slice(1, 2).map((eachApp, index) => (
                        <div className={"rotate-6 opacity-30 pointer-events-none select-none"}>
                            <BasicGridAppBoxes {...eachApp} />
                        </div>
                    ))
                }
            </div>
            <div className={"absolute left-60 -top-32 flex flex-row"}>
                {
                    userApps?.results.slice(2, 3).map((eachApp, index) => (
                        <div className={"rotate-6 scale-75 opacity-70 pointer-events-none select-none"}>
                            <BasicGridAppBoxes {...eachApp} />
                        </div>
                    ))
                }
            </div>
            {/* <div className={"absolute left-12 top-32 flex flex-row"}>
                                {
                                    userApps?.results.slice(1, 2).map((eachApp, index) => (
                                        <div className={"rotate-6 opacity-80"}>
                                            <BasicGridAppBoxes {...eachApp} />
                                        </div>
                                    ))
                                }
                            </div> */}
            <div className={"card card-bordered card-normal bg-white max-w-xs shadow-xl -rotate-6 opacity-60 dark:bg-base-200"}>
                <div className={"card-body gap-y-6"}>
                    <div className={"card-title font-black text-4xl"}>{userApps?.results.length} Apps</div>
                    <div className={"text-3xl"}>{userData?.firstname} has {userApps?.results.length} Apps</div>
                </div>
            </div>

            <div className={"card card-bordered card-normal bg-white max-w-2xl shadow-xl -rotate-6 -top-2 opacity-60 dark:bg-base-200"}>
                <div className={"card-body gap-y-6"}>
                    <div className={"card-title font-black text-4xl"}>Languages / Stacks</div>
                    <div className={"text-3xl"}>{userData?.firstname} uses these languages</div>
                    <div className="space-x-6 space-y-3">
                        {
                            "python,javascript,typescript,rust".split(",").map((userProgLang) => (
                                <span class="inline-flex items-center gap-x-1.5 py-1.5 px-3 rounded-full text-base font-medium bg-blue-100 text-blue-800 dark:bg-blue-800/30 dark:text-blue-500">
                                    <span class="w-1.5 h-1.5 inline-block rounded-full bg-blue-800 dark:bg-blue-500"></span>
                                    {userProgLang}
                                </span>
                            ))
                        }
                    </div>
                </div>
            </div>
        </section>
    )
}

export const ProfileBanner = ({ userData, socialSitesList, userApps, removeAbout, removeSocial }) => {
    const size = useDeviceSize();

    return (
        <section
            className={"relative flex flex-row justify-center lg:justify-start items-center w-full mx-auto bg-base-100 bg-gradient-to-r from-white dark:from-base-300 to-base-100 dark:to-base-200 to 80% h-[540px] md:h-[600px] lg:h-[720px] py-16 overflow-hidden dark:bg-000304"}>
            {
                size.windowWidth >= deviceWidthEnum.laptop
                && <>
                </>
            }
            {/* <div className={"flex flex-row justify-start absolute -top-8 left-0 lg:-top-24 -z-1 min-w-[64%] pct:w-120 leading-normal text-base-100/50 color-F8FBF8 text-9xl lg:text-[12rem] font-120 font-bold text-right bg-orange-30 overflow-hidden lg:pct:w-100|neg:top-10|left-5 dark:color-11131466"}>
                {userData?.firstname}
            </div>
            <div className={"flex flex-row justify-start absolute top-24 left-0 lg:top-24 -z-1 min-w-[64%] pct:w-120 leading-normal text-base-100/60 color-F8F8F8 text-9xl lg:text-[12rem] font-120 font-bold text-right bg-orange-30 overflow-hidden lg:pct:w-100|left-50 dark:color-11131466"}>
                {userData?.lastname}
            </div> */}
            {/*Profile Page*/}
            <section className={"relative w-full lg:w-auto lg:min-w-[56%] bg-transparent backdrop-blur-sm rounded-2xl p-4 lg:p-8 space-y-8 lg:left-12 z-[1] overflow-clip"}>
                {/* Profile banner - Names Card */}
                <ProfileBasicDetailsCard userData={userData} />

                {/* Profile Banner - About me container */}
                {
                    !removeAbout
                    && <div>
                        <ListContentContainer
                            title={<div className="font-bold">{"About me"}</div>}
                            classes={""}
                        >
                            <div className={"font-medium text-xl"}>{userData?.about_me}</div>
                        </ListContentContainer>
                    </div>
                }

                {/* Profile Banner - Social lists */}
                {
                    !removeSocial
                    && <ProfileBasicSocialListCard userData={userData} socialSitesList={socialSitesList} brandColorMap={brandColorMap} />
                }
            </section>

            {/* Profile abstract cards */}
            <ProfileBannerAbstractCard userData={userData} userApps={userApps} />
        </section>
    )
}

export const UserPageComponent = ({ userId, userData }) => {
    // const { windowWidth, screenWidth, deviceWidthEnum } = useDeviceWidth();
    const size = useDeviceSize();
    // const { rawToken, isLoggedIn, tokenData } = useAtomValue(tokenState);
    const tokenData = useTokenData();
    // const navigate = useNavigate();
    // const user = useContext(UserContext);
    // const [userApps] = useFetch(`${process.env.REACT_APP_BASE_URL}/user/${tokenData.tokenData?.user_id}/apps/`);
    const [userApps] = useFetch(`${process.env.REACT_APP_BASE_URL}/user/${userId}/apps/`);
    const [socialSitesList] = useFetch(`${process.env.REACT_APP_BASE_URL}/app/social_list/`);
    const [timelineList] = useFetch(`${process.env.REACT_APP_BASE_URL}/timeline/`);

    return (
        <section className={"profile-container relative bg-light lg:bg-white-solid dark:bg-111314"}>
            {
                size.windowWidth >= deviceWidthEnum.laptop
                    ? <NavBar showProfile={false}>
                        {
                            userId === tokenData.tokenData?.user_id
                            && <>
                                <div className="divider divider-horizontal"></div>
                                <Link to={"/profile/update"}
                                    className={"block"}>
                                    <Button classes={"text-base"}>
                                        Update Profile
                                        <span className={"fa fa-pen pl-2 color-white"}></span>
                                    </Button>
                                </Link>
                            </>
                        }
                    </NavBar>
                    : null
            }
            {
                // For devices smaller than the laptop
                size.windowWidth < deviceWidthEnum.laptop
                    ? <PageHeaderLink headerTitle={userId === tokenData.tokenData?.user_id ? "My profile" : `${userData?.firstname} Page`} fixTop={true}>
                        {
                            userId === tokenData.tokenData?.user_id
                                ? <Link to={"/profile/update"}
                                    className={"absolute px-4 btn btn-primary px:top-20 right-4 h-5 lh-5 bg-green radius pad-x2 decoration-none color-white"}>
                                    Update Profile
                                    <span className={"fa fa-pen pl-2 color-white"}></span>
                                </Link>
                                : null
                        }
                    </PageHeaderLink>
                    : null
            }
            {
                // For devices smaller than the laptop
                size.windowWidth < deviceWidthEnum.laptop
                    ? <PageHeaderLink noFix={true}>
                        {
                            userId === tokenData.tokenData?.user_id
                                ? <Link
                                    to={"/profile/update"}
                                    className={"btn btn-primary text-primary-content mr-4"}
                                >
                                    Update Profile
                                    <span className={"fa fa-pen pl-2 color-white"}></span>
                                </Link>
                                : null
                        }
                    </PageHeaderLink>
                    : null
            }
            {/*Profile Page*/}
            {
                size.windowWidth < deviceWidthEnum.laptop
                && <div className="relative z-10">
                    <ProfileBanner userData={userData} userApps={userApps} socialSitesList={socialSitesList} removeAbout={true} />
                </div>
            }
            {
                // For devices smaller than the laptop
                size.windowWidth < deviceWidthEnum.laptop
                    ? <div className={"relative hidden flex flex-col justify-center items-center gap-y-2 flex-basis flex-grow py-8 pad-t8 pad-b4 bg-white bg-gradient-to-t from-white dark:from-base-300 to-base-100 dark:to-base-200 to 80% overflow-hidden z-10 dark:bg-000304|color-whitesmoke dark:bg-base-300"}>
                        <div className={"flex flex-row justify-center absolute -top-16 -z-10 w-full pct:w-120 leading-normal text-base-200/30 color-F8FBF8 text-9xl font-120 font-bold text-center overflow-hidden lg:pct:w-100|neg:top-10|left-5 dark:color-11131466"}>
                            {userData?.firstname}
                        </div>
                        <div className={"flex flex-row absolute top-8 -left-0 -z-10 w-full pct:w-120 leading-normal text-base-100/80 color-F8F8F8 text-9xl font-120 font-bold text-right overflow-hidden lg:pct:w-100|left-50 dark:color-11131466"}>
                            {userData?.lastname}
                        </div>
                        {/* {
                            userData?.dp
                                ? <img alt=""
                                    className="sibling-user relative size-24 leading-[96px] square-12 lh-12 radius-circle bg-lighter border-0 border-DDD border-solid bg-light cursor-pointer object-fill object-center hover:shadow:inset-0px-0px-16px-0px-DDD transition:box-shadow_200ms_ease lg:square2-6|lh2-6"
                                    src={userData?.dp}
                                />
                                : <div
                                    className={"sibling-user relative square-12 lh-12 radius-circle bg-lighter border-0 border-DDD border-solid bg-light text-center font-bold cursor-pointer hover:shadow:inset-0px-0px-16px-0px-DDD transition:box-shadow_200ms_ease lg:square2-6|lh2-6 dark:bg-111314|color-whitesmoke dark:hover:shadow:inset-0px-0px-16px-0px-000304 dark:brightness-60"}>
                                    {userData?.firstname?.split('')[0].toUpperCase() + userData?.lastname?.split('')[0].toUpperCase()}
                                </div>
                        } */}
                        <Avatar
                            src={userData?.dp}
                            alt={"profile"}
                            width={"24"}
                            classes={"size-24 leading-[96px] font-bold"}
                        >
                            {
                                !userData?.dp &&
                                userData?.firstname?.split('')[0].toUpperCase() + userData?.lastname?.split('')[0].toUpperCase()
                            }
                        </Avatar>
                        <div className={"block text-pretty text-4xl font-bold leading-[64px]"}>
                            {userData?.firstname} {userData?.lastname}
                        </div>
                        <div className={"relative text-xl leading-normal font-15"}>
                            {userData?.email}
                        </div>
                        <div className={"relative text-xl leading-normal font-semibold"}>
                            {userData?.phone_no}
                        </div>
                        {
                            userData?.tags
                                ? <div className={"relative block my-4 lg:my-10"}>
                                    {
                                        "python, javascript, golang".split(",").map((each_user_skills, index) => {
                                            return (
                                                <span key={index}
                                                    className={"bg-light radius pad-1 mg-x-2 lg:font-13"}>{each_user_skills}</span>
                                            )
                                        })
                                    }
                                </div>
                                : null
                        }
                        {/* {
                            userId === tokenData.tokenData?.user_id
                                ? <Link
                                    to={"/profile/update"}
                                    className={"btn btn-primary my-4"}
                                >
                                    Edit <span className={"fa fa-pen pad-l1 color-white"}></span>
                                </Link>
                                : null
                        } */}
                    </div>
                    : null
            }

            {
                // For laptops and devices larger than the laptop
                size.windowWidth >= deviceWidthEnum.laptop
                    ? <section
                        className={"hidden flex flex-col justify-center items-center w-full pct:w-100 h-[200px] mx-auto mg-x-auto bg-white-solid text-center lg:top-0 lg:h-[480px] py-16 lg:relative|px:top-0|h-480|pad-y8|bg-lighter dark:bg-000304"}>
                        {/*Profile Page*/}
                        <div
                            className={"relative flex flex-row justify-center items-center flex-basis flex-grow bg-transparent overflow-hidden z-10"}>
                            {/* {
                                userData?.dp
                                    ? <img alt=""
                                        className="relative block size-24 leading-[96px] rounded-full square-12 lh-12 radius-circle bg-lighter border-0 border-DDD border-solid bg-light cursor-pointer hover:shadow:inset-0px-0px-16px-0px-DDD transition:box-shadow_200ms_ease lg:size-48 lg:leading-[192px] lg:square2-12|lh2-12 dark:bg-111314|color-whitesmoke dark:hover:shadow:inset-0px-0px-16px-0px-000304 dark:brightness-60"
                                        src={userData?.dp}
                                    />
                                    : <div
                                        className={"relative block size-24 leading-[96px] rounded-full square-12 lh-12 radius-circle bg-lighter border-0 border-DDD border-solid bg-light text-center font-bold cursor-pointer hover:shadow:inset-0px-0px-16px-0px-DDD transition:box-shadow_200ms_ease lg:size-48 lg:leading-[192px] lg:square2-12|lh2-12 dark:bg-111314|color-whitesmoke dark:hover:shadow:inset-0px-0px-16px-0px-000304"}>
                                        {userData?.firstname?.split('')[0].toUpperCase() + userData?.lastname?.split('')[0].toUpperCase()}
                                    </div>
                            } */}
                            <Avatar
                                src={userData?.dp}
                                alt={"profile"}
                                width={"48"}
                                classes={"size-48 leading-[192px] font-bold text-3xl"}
                            >
                                {
                                    !userData?.dp &&
                                    userData?.firstname?.split('')[0].toUpperCase() + userData?.lastname?.split('')[0].toUpperCase()
                                }
                            </Avatar>
                            <div
                                className={"block font-24 font-semibold px-4 pt-4 pb-2 lg:text-4xl lg:py-8 lg:font-32|pad-y4 dark:color-darkgray"}>
                                {userData?.firstname} {userData?.lastname}
                                <div
                                    className={"relative text-lg font-15 font-light py-2 text-left lg:text-xl lg:py-6 lg:font-18|pad-y3 dark:color-whitesmoke"}>
                                    {userData?.email || userData?.phone_no}
                                </div>
                                {
                                    userData?.tags
                                        ? <div className={"relative block text-left my-2 lg:my-2"}>
                                            {
                                                "python, javascript, golang".split(",").map((each_user_skills, index) => {
                                                    return (
                                                        <span key={index}
                                                            className={"bg-light radius p-2 mx-4 lg:text-lg lg:font-13"}>{each_user_skills}</span>
                                                    )
                                                })
                                            }
                                        </div>
                                        : null
                                }
                                {
                                    userId === tokenData.tokenData?.user_id
                                        ? <Link to={"/profile/update"}
                                            className={"block h-5 lh-5 bg-green radius px-4 mt-4 ml-auto decoration-none color-white"}>
                                            Edit
                                            <span className={"fa fa-pen pl-2 color-white"}></span></Link>
                                        : null
                                }
                            </div>
                        </div>
                    </section>
                    : null
            }

            {
                // For laptops and devices larger than the laptop
                size.windowWidth >= deviceWidthEnum.laptop
                && <ProfileBanner userData={userData} userApps={userApps} socialSitesList={socialSitesList} />
            }

            <section className={"flex flex-col lg:flex-row lg:gap-x-12"}>
                <section className={"relative w-full lg:w-[56%] lg:mx-16 lg:top-[40px]"}>
                    {/* Personal Details section */}
                    <PersonalDetailsSection userData={userData} />

                    {/* Your Apps section */}
                    <AppsSection userData={userData} userApps={userApps} userId={userId} showArrow={true} linkUrl={userId === tokenData.tokenData?.user_id ? `/user/${tokenData.tokenData?.user_id}/apps` : "apps"} />

                    {/* Social Profile section */}
                    <SocialProfileSection userData={userData} socialSitesList={socialSitesList} />
                </section>

                {/* User Timeline section */}
                <section className={"relative lg:w-[400px] lg:top-[40px]"}>
                    <PageSectionContainer>
                        <HeaderLink headerTitle={"User Timeline section"} />

                        <PageSectionBody>
                            <section>
                                {/* <!-- Timeline --> */}
                                <div>
                                    {/* {
                                        timelineList.map((eachTimeLine, index) => ())
                                    } */}
                                    {/* <!-- Heading --> */}
                                    <div class="ps-2 my-2 first:mt-0">
                                        <h3 class="text-xs font-medium uppercase text-gray-500 dark:text-gray-400">
                                            1 Aug, 2023
                                        </h3>
                                    </div>
                                    {/* <!-- End Heading --> */}

                                    {/* <!-- Item --> */}
                                    <div class="flex gap-x-3">
                                        {/* <!-- Icon --> */}
                                        <div class="relative last:after:hidden after:absolute after:top-7 after:bottom-0 after:start-3.5 after:w-px after:-translate-x-[0.5px] after:bg-gray-200 dark:after:bg-gray-700">
                                            <div class="relative z-10 w-7 h-7 flex justify-center items-center">
                                                <div class="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-600"></div>
                                            </div>
                                        </div>
                                        {/* <!-- End Icon --> */}

                                        {/* <!-- Right Content --> */}
                                        <div class="grow pt-0.5 pb-8">
                                            <h3 class="flex gap-x-1.5 font-semibold text-gray-800 dark:text-white">
                                                <svg class="flex-shrink-0 w-4 h-4 mt-1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" /><polyline points="14 2 14 8 20 8" /><line x1="16" x2="8" y1="13" y2="13" /><line x1="16" x2="8" y1="17" y2="17" /><line x1="10" x2="8" y1="9" y2="9" /></svg>
                                                Created "Preline in React" task
                                            </h3>
                                            <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
                                                Find more detailed insctructions here.
                                            </p>
                                            <button type="button" class="mt-1 -ms-1 p-1 inline-flex items-center gap-x-2 text-xs rounded-lg border border-transparent text-gray-500 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600">
                                                <img class="flex-shrink-0 w-4 h-4 rounded-full" src="https://images.unsplash.com/photo-1659482633369-9fe69af50bfb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8auto=format&fit=facearea&facepad=3&w=320&h=320&q=80" alt="Image Description" />
                                                James Collins
                                            </button>
                                        </div>
                                        {/* <!-- End Right Content --> */}
                                    </div>
                                    {/* <!-- End Item --> */}

                                    {/* <!-- Item --> */}
                                    <div class="flex gap-x-3">
                                        {/* <!-- Icon --> */}
                                        <div class="relative last:after:hidden after:absolute after:top-7 after:bottom-0 after:start-3.5 after:w-px after:-translate-x-[0.5px] after:bg-gray-200 dark:after:bg-gray-700">
                                            <div class="relative z-10 w-7 h-7 flex justify-center items-center">
                                                <div class="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-600"></div>
                                            </div>
                                        </div>
                                        {/* <!-- End Icon --> */}

                                        {/* <!-- Right Content --> */}
                                        <div class="grow pt-0.5 pb-8">
                                            <h3 class="flex gap-x-1.5 font-semibold text-gray-800 dark:text-white">
                                                Release v5.2.0 quick bug fix 🐞
                                            </h3>
                                            <button type="button" class="mt-1 -ms-1 p-1 inline-flex items-center gap-x-2 text-xs rounded-lg border border-transparent text-gray-500 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600">
                                                <span class="flex flex-shrink-0 justify-center items-center w-4 h-4 bg-white border border-gray-200 text-[10px] font-semibold uppercase text-gray-600 rounded-full dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400">
                                                    A
                                                </span>
                                                Alex Gregarov
                                            </button>
                                        </div>
                                        {/* <!-- End Right Content --> */}
                                    </div>
                                    {/* <!-- End Item --> */}

                                    {/* <!-- Item --> */}
                                    <div class="flex gap-x-3">
                                        {/* <!-- Icon --> */}
                                        <div class="relative last:after:hidden after:absolute after:top-7 after:bottom-0 after:start-3.5 after:w-px after:-translate-x-[0.5px] after:bg-gray-200 dark:after:bg-gray-700">
                                            <div class="relative z-10 w-7 h-7 flex justify-center items-center">
                                                <div class="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-600"></div>
                                            </div>
                                        </div>
                                        {/* <!-- End Icon --> */}

                                        {/* <!-- Right Content --> */}
                                        <div class="grow pt-0.5 pb-8">
                                            <h3 class="flex gap-x-1.5 font-semibold text-gray-800 dark:text-white">
                                                Marked "Install Charts" completed
                                            </h3>
                                            <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
                                                Finally! You can check it out here.
                                            </p>
                                            <button type="button" class="mt-1 -ms-1 p-1 inline-flex items-center gap-x-2 text-xs rounded-lg border border-transparent text-gray-500 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600">
                                                <img class="flex-shrink-0 w-4 h-4 rounded-full" src="https://images.unsplash.com/photo-1659482633369-9fe69af50bfb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=3&w=320&h=320&q=80" alt="Image Description" />
                                                James Collins
                                            </button>
                                        </div>
                                        {/* <!-- End Right Content --> */}
                                    </div>
                                    {/* <!-- End Item --> */}

                                    {/* <!-- Heading --> */}
                                    <div class="ps-2 my-2">
                                        <h3 class="text-xs font-medium uppercase text-gray-500 dark:text-gray-400">
                                            31 Jul, 2023
                                        </h3>
                                    </div>
                                    {/* <!-- End Heading --> */}

                                    {/* <!-- Item --> */}
                                    <div class="flex gap-x-3">
                                        {/* <!-- Icon --> */}
                                        <div class="relative last:after:hidden after:absolute after:top-7 after:bottom-0 after:start-3.5 after:w-px after:-translate-x-[0.5px] after:bg-gray-200 dark:after:bg-gray-700">
                                            <div class="relative z-10 w-7 h-7 flex justify-center items-center">
                                                <div class="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-600"></div>
                                            </div>
                                        </div>
                                        {/* <!-- End Icon --> */}

                                        {/* <!-- Right Content --> */}
                                        <div class="grow pt-0.5 pb-8">
                                            <h3 class="flex gap-x-1.5 font-semibold text-gray-800 dark:text-white">
                                                Take a break ⛳️
                                            </h3>
                                            <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
                                                Just chill for now... 😉
                                            </p>
                                        </div>
                                        {/* <!-- End Right Content --> */}
                                    </div>
                                    {/* <!-- End Item --> */}

                                    {/* <!-- Collapse --> */}
                                    <div id="hs-timeline-collapse" class="hs-collapse hidden w-full overflow-hidden transition-[height] duration-300" aria-labelledby="hs-timeline-collapse-content">
                                        {/* <!-- Heading --> */}
                                        <div class="ps-2 my-2 first:mt-0">
                                            <h3 class="text-xs font-medium uppercase text-gray-500 dark:text-gray-400">
                                                30 Jul, 2023
                                            </h3>
                                        </div>
                                        {/* <!-- End Heading --> */}

                                        {/* <!-- Item --> */}
                                        <div class="flex gap-x-3">
                                            {/* <!-- Icon --> */}
                                            <div class="relative last:after:hidden after:absolute after:top-7 after:bottom-0 after:start-3.5 after:w-px after:-translate-x-[0.5px] after:bg-gray-200 dark:after:bg-gray-700">
                                                <div class="relative z-10 w-7 h-7 flex justify-center items-center">
                                                    <div class="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-600"></div>
                                                </div>
                                            </div>
                                            {/* <!-- End Icon --> */}

                                            {/* <!-- Right Content --> */}
                                            <div class="grow pt-0.5 pb-8">
                                                <h3 class="flex gap-x-1.5 font-semibold text-gray-800 dark:text-white">
                                                    Final touch ups
                                                </h3>
                                                <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
                                                    Double check everything and make sure we're ready to go.
                                                </p>
                                            </div>
                                            {/* <!-- End Right Content --> */}
                                        </div>
                                        {/* <!-- End Item --> */}
                                    </div>
                                    {/* <!-- End Collapse --> */}

                                    {/* <!-- Item --> */}
                                    <div class="ps-[7px] flex gap-x-3">
                                        <button type="button" class="hs-collapse-toggle hs-collapse-open:hidden text-start inline-flex items-center gap-x-1 text-sm text-blue-600 font-medium decoration-2 hover:underline dark:text-blue-500 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600" id="hs-timeline-collapse-content" data-hs-collapse="#hs-timeline-collapse">
                                            <svg class="flex-shrink-0 w-3.5 h-3.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6" /></svg>
                                            Show older
                                        </button>
                                    </div>
                                    {/* <!-- End Item --> */}
                                </div>
                                {/* <!-- End Timeline --> */}
                            </section>
                        </PageSectionBody>
                    </PageSectionContainer>
                </section>
            </section>

            {/* Personal Details section */}
            <section className={"hidden flex flex-col pt-8 pb-8 bg-white-solid lg:w-[64%] lg:mx-auto lg:pct:w-64|mg-x-auto dark:bg-inherit|radius-top-right|radius-top-left"}>
                <header className={"font-15 px-4 py-4 font-medium lg:text-lg lg:py-8 lg:font-18|pad-y4 dark:color-whitesmoke"}>{"Personal details"}</header>
                {/*{JSON.stringify(userData)}*/}
                <section className={"*:flex *:flex-col *:my-2 *:p-2 *:text-base every:flex|flex-column|mg-y1|pad-2|font-14 dark:color-whitesmoke"}>
                    {
                        userData?.firstname !== ""
                            ? <div className={""}>
                                <span className={"lg:font-16"}>About {userData?.firstname} </span>
                                <span className={"py-2 lg:font-13|lh-40"}>
                                    {/* {userData?.about_me || "About me is a service that shows you a summary of each search results, so you can make better choices with your search."} */}
                                    {userData?.about_me || "-"}
                                </span>
                            </div>
                            : null
                    }
                    <div className={""}>
                        <span className={"lg:font-14"}><span className={"fa fa-phone square-4 lh-4 color-999"}></span> Mobile: </span>
                        <a href={`tel:${userData?.phone_no}`} className={"pad-l5 pad-y1 decoration-none color-initial dark:color-whitesmoke"}>{userData?.phone_no || "-"}</a>
                    </div>
                    <div className={""}>
                        <span className={"lg:font-14"}><span className="fa fa-map square-4 lh-4 color-999"></span> Address: </span>
                        <span className={"pad-l5 pad-y1 decoration-none color-initial dark:color-whitesmoke"}>{userData?.address || "-"}</span>
                    </div>
                    <div className={""}>
                        <span className={"lg:font-14"}><span className={"fa fa-flag square-4 lh-4 color-999"}></span> Country: </span>
                        <span className={"pad-l5 pad-y1"}>{userData?.country || "-"}</span>
                    </div>
                    <div className={""}>
                        <span className={"lg:font-14"}><span className="fa fa-calendar-plus square-4 lh-4 color-999"></span>Date Joined: </span>
                        <span className={"pad-l5 pad-y1 color-999"}>{new Date(userData?.date_joined).toLocaleDateString() || "-"}</span>
                    </div>
                </section>
            </section>

            {/* Your Apps section */}
            <section className={"hidden flex flex-col mg-y-pad-t4 pad-b4 bg-white-solid lg:pct:w-64|mg-x-auto dark:bg-inherit"}>
                {
                    userId === tokenData.tokenData?.user_id
                        ? <Link to={`/user/${tokenData.tokenData?.user_id}/apps`} className={"relative pct:w-100 font-15 pad-x2 pad-y2 font-medium radius decoration-none color-initial hover:bg-lighter lg:font-18|pad-y4 dark:color-whitesmoke dark:hover:bg-222425BB"}>
                            {"Your Apps"}
                            <span className={"fa fa-angle-right abs right-4 font-18"}></span>
                        </Link>
                        : <Link to={"apps"} className={"relative pct:w-100 font-15 pad-x2 pad-y2 font-medium radius decoration-none color-initial hover:bg-lighter lg:font-18|pad-y4 dark:color-whitesmoke dark:hover:bg-222425BB"}>
                            {userId === tokenData.tokenData?.user_id ? "Your Apps" : `${userData?.firstname} Apps`}
                            <span className={"fa fa-angle-right abs right-4 font-18"}></span>
                        </Link>
                }
                <section className={"flex flex-row flex-nowrap justify-start align-items-start pad-x2 overflow-x-auto"}>
                    {
                        userApps?.results?.length > 0
                            ? userApps?.results.map((eachUserApps, index) => {
                                return (
                                    index < 6 ? <BasicGridAppBoxes key={eachUserApps.id} {...eachUserApps} /> : null
                                )
                            })
                            : <div className={"mg-x-auto mg-y1 pad-2 font-14 text-center color-gray"}>No apps yet</div>
                    }
                </section>
                {/*{JSON.stringify(userData)}*/}
                {
                    userData?.clicks > 0
                        ? <section className={"every:flex|flex-column|mg-y1|pad-2|font-14"}>
                            <div className={""}>
                                <span className={""}><span className={"fa fa-eye square-4 lh-4 text-center color-999"}></span> 144 views </span>
                                {/*<span className={"pad-l4 pad-y1"}>{userData?.phone_no || <NotDefined />}</span>*/}
                            </div>
                            <div className={""}>
                                <span className={""}><span className={"fa fa-smile square-4 lh-4 text-center color-999"}></span> 16 reactions (Likes, clap) </span>
                                {/*<span className={"pad-l4 pad-y1"}>{userData?.country || <NotDefined />}</span>*/}
                            </div>
                            <div className={""}>
                                <span className={""}><span className="fa fa-save square-4 lh-4 text-center color-999"></span> 4 saves </span>
                                {/*<span className={"pad-l4 pad-y1"}>{userData?.address || <NotDefined />}</span>*/}
                            </div>
                            <div className={""}>
                                <span className={""}><span className="fa fa-money square-4 lh-4 text-center color-999"></span> 5 Donations (#6000) </span>
                                {/*<span className={"pad-l4 pad-y1"}>{new Date(userData?.date_joined).toLocaleDateString() || <NotDefined />}</span>*/}
                            </div>
                        </section>
                        : null
                }
            </section>

            {/* Social Profile section */}
            <section className={"hidden flex flex-col mg-y-pad-t4 pad-b4 bg-white-solid lg:pct:w-64|mg-x-auto dark:bg-inherit"}>
                <header className={"relative pct:w-100 font-15 pad-x2 pad-y2 font-medium lg:font-18|pad-y4 dark:color-whitesmoke dark:hover:bg-222425BB"}>
                    {"Social Profile"}
                    <span className={"fa fa-angle-right abs right-4 font-18"}></span>
                </header>
                <section className={"every:flex|flex-column|mg-y1|pad-2|font-14"}>
                    {/*{socialSitesList?.filter(item => Object.keys(userData?.social_account_dict).every(key=>item === userData?.social_account_dict[key]))}*/}
                    {/*{socialSitesList?.filter(item => Object.keys(userData?.social_account_dict).includes(item))}*/}
                    {/*{socialSitesList?.filter(item => Object.keys(userData?.social_account_dict).includes(item)).length}*/}
                    {
                        userData && socialSitesList?.filter(item => Object.keys(userData?.social_account_dict).includes(item)).length > 0
                            ? socialSitesList?.map((socialSite, index) => {
                                if (userData?.social_account_dict[socialSite]) {
                                    return (
                                        <div key={index} className={"dark:color-whitesmoke"}>
                                            <span className={""}>
                                                <span
                                                    className={`fab fa-${socialSite} square-4 lh-4 text-center color-999`}>
                                                </span>
                                                {socialSite}:
                                            </span>
                                            <a href={userData?.social_account_dict[socialSite]}
                                                target={"_blank"}
                                                rel="noreferrer"
                                                className={"pad-l4 pad-y1 font-semibold color-initial dark:color-darkgray"}
                                            >
                                                @{getSocialAccountHandle(userData?.social_account_dict[socialSite])}
                                            </a>
                                        </div>
                                    )
                                }
                            })
                            : <div className={"text-center color-gray"}>No account configured</div>
                    }
                    {/*{Object.keys(userData?.social_account_dict)?.length > 0 ? "" : <div className={"pad-4 text-center"}>No site linked</div>}*/}
                    {/*<div className={""}>
                        <span className={""}><span className="fab fa-instagram square-4 lh-4 text-center color-999"></span>Instagram: </span>
                        <span className={"pad-l4 pad-y1"}>{"-"}</span>
                    </div>*/}
                </section>
            </section>
        </section>
    )
}

function Profile() {
    const { me } = useLoaderData();
    // const {rawToken, isLoggedIn, tokenData.tokenData} = useTokenData();
    // const {rawToken, isLoggedIn, tokenData.tokenData} = useRecoilValue(tokenState);
    // const { userDataResults, isError, isLoading, responseDetails } = useUserData();
    useEffect(() => {
        return () => { }
    }, [])

    return (
        // <UserPageComponent userId={userDataResults?.id} userData={userDataResults} />
        <><UserPageComponent userId={me?.data?.id} userData={me?.data} /></>
    );
}

export default Profile;