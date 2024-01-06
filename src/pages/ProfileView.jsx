import React, { useEffect } from "react";
import { Link, useNavigation, useLoaderData, Outlet } from "react-router-dom";
// import useUserData from "../helpers/userData";
// import { tokenState, UserContext } from "./Home";
// import { useAtomValue } from "jotai";
import { deviceWidthEnum, getSocialAccountHandle } from "../helpers/utils";
// import { BasicGridAppBoxes } from "./AppBoxes";
import useFetch from "../hooks/useFetch";
// import { NavBar } from "./Base";
// import { useDeviceWidth } from "./useDeviceWidth";
import { Avatar, HeaderLink, PageHeaderLink } from "../components/Elements";
import { getProfile } from "./loaders/appLoaders";
import { useDeviceSize } from "../hooks/useDeviceSize";
import NavBar from "../components/NavBar";
import { BasicGridAppBoxes } from "../components/AppBoxes";
import { AppsSection, PersonalDetailsSection, ProfileBanner, ProfileBasicDetailsCard, SocialProfileSection } from "./Profile";

export async function loader() {
    const me = await getProfile();
    return { me };
}

export const ProfileDetailLeftNav = ({ userData, pageName }) => {
    const navLinks = ["picture", "basic-info", "social-info"];
    const navLinksData = {
        "picture": "Display Picture",
        "basic-info": "Basic info",
        "social-info": "Social info"
    }

    return (
        <section className={"sticky flex-shrink-0 top-0 w-80 h-screen bg-base-100 dark:bg-base-100 pct:w-20 vh:h-100 bg-lighter dark:bg-000304 dark:every:color-whitesmoke"}>
            <Link to={`${window.location.pathname.split("/").slice(0, window.location.pathname.split("/").length - 1).join("/")}/`}
                className={"flex flex-col justify-center items-start text-2xl lg:text-3xl font-18 leading-normal w-full pct:w-100 h-[160px] px-4 color-initial decoration-none hover:decoration-2 hover:underline hover:decoration-2|underline lg:font-24"}>
                <div className={"font-size-inherit"}>{userData?.firstname}</div>
                <div className={"font-size-inherit font-bold color-gray"}>{userData?.lastname}</div>
            </Link>
            <section
                className={"block *:block *:p-8 *:rounded-xl *:decoration-none hover:*:bg-base-200 dark:bg-base-100 every:d-block|pad-4|radius|decoration-none|color-initial hover:every:bg-light dark:every:color-whitesmoke dark:hover:every:bg-222425"}>
                {
                    navLinks.map((eachNavLink, index) => {
                        if (pageName !== eachNavLink) {
                            return (
                                <Link
                                    to={`${window.location.pathname.split("/").slice(0, window.location.pathname.split("/").length - 1).join("/")}/${eachNavLink.toLowerCase()}`}>
                                    {navLinksData[eachNavLink]}
                                </Link>
                            )
                        }
                    })
                }
            </section>
        </section>
    )
}

export const ProfileViewIndex = () => {
    const navigation = useNavigation();
    const size = useDeviceSize();
    const { me } = useLoaderData();
    const userData = me?.data;
    const [userApps] = useFetch(`${process.env.REACT_APP_BASE_URL}/user/${userData?.id}/apps/`);
    const [socialSitesList] = useFetch(`${process.env.REACT_APP_BASE_URL}/app/social_list/`);

    return (
        <section className={"w-full h-screen overflow-y-auto"}>
            {
                size.windowWidth >= deviceWidthEnum.laptop
                    ? <NavBar showProfile={false} />
                    : null
            }
            {
                size.windowWidth < deviceWidthEnum.laptop
                    ? <PageHeaderLink headerTitle={"Update Profile"} fixTop={true} />
                    : null
            }
            <ProfileBanner userData={userData} userApps={userApps} removeAbout={true} />
            {/* <ProfileBasicDetailsCard userData={userData} /> */}

            {/* Profile Details Groups */}
            <section className={"flex flex-col lg:grid lg:grid-cols-3 gap-y-8 lg:grid-flow-row lg:gap-x-8 lg:gap-y-8 px-2 pt-2 pb-8 lg:p-8"}>
                <section className={"card card-bordered bg-base-100"}>
                    <div className={"relative block pct:w-100 pt-4 pb-8 bg-white-solid dark:bg-111314|color-whitesmoke"}>
                        <HeaderLink headerTitle={"Display picture"} showArrow={true} linkUrl={"picture"} classes={"px-2 py-4 lg:p-4"} />
                        <div className={"flex flex-row items-center px-6 lg:px-8"}>
                            <span className={"lg:text-lg mr-4 lg:font-14|lh-40"}>Use a dp that personalizes you</span>
                            {
                                userData?.dp
                                    ? <img src={userData?.dp} alt={`${userData?.firstname}`} width={"48"} height={"48"}
                                        className="block ml-auto w-12 h-12 bg-base-200 bg-light rounded-full radius-circle object-cover object-center lg:w-20 lg:h-20 leading-[80px] lg:w-80|h-80|lh-80" />
                                    : <div
                                        className={"relative block ml-auto size-12 leading-[12] square-6 lh-6 radius-circle border-0 border-DDD border-solid bg-light color-initial text-center font-bold cursor-pointer hover:shadow:inset-0px-0px-16px-0px-DDD transition:box-shadow_200ms_ease lg:square-10|lh-10 dark:bg-222425|color-whitesmoke dark:hover:shadow:inset-0px-0px-16px-0px-000304 dark:brightness-60"}>
                                        {userData?.name?.split('')[0].toUpperCase().toString()}
                                    </div>
                            }
                            <Avatar
                                src={userData?.dp}
                                alt={`${userData?.firstname}`}
                                width={"16"}
                                classes={"block ml-auto w-24 h-24 bg-base-200"}
                            >
                                {
                                    !userData?.dp
                                    && <div
                                        className={"relative block ml-auto w-24 h-24 leading-[96px] border-0 border-DDD border-solid text-center font-bold cursor-pointer hover:shadow:inset-0px-0px-16px-0px-DDD transition:box-shadow_200ms_ease lg:square-10|lh-10 dark:bg-222425|color-whitesmoke dark:hover:shadow:inset-0px-0px-16px-0px-000304 dark:brightness-60"}>
                                        {/* {userData?.firstname?.split('')[0].toUpperCase().toString()} */}
                                    </div>
                                }
                            </Avatar>
                        </div>
                    </div>
                </section>
                <section className={"card card-bordered bg-base-100 lg:col-span-2"}>
                    <PersonalDetailsSection userData={userData} showArrow={true} linkUrl={"basic-info"} />
                </section>
                <section className={"card card-bordered bg-base-100 lg:col-span-2"}>
                    <AppsSection userData={userData} userApps={userApps} userId={userData?.id} showArrow={true} />
                </section>
                <section className={"card card-bordered bg-base-100"}>
                    <SocialProfileSection userData={userData} socialSitesList={socialSitesList} showArrow={true} linkUrl={"social-info"} />
                </section>
            </section>
        </section>
    );
}

// const ProfileViewOld = () => {
//     return (
//         <section className={"profile-container bg-light lg:bg-white-solid dark:bg-000304" + navigation.state === "loading" ? " next-page-animation" : ""}>
//             {
//                 size.windowWidth >= deviceWidthEnum.laptop
//                     ? <NavBar showProfile={false} />
//                     : null
//             }
//             {
//                 size.windowWidth < deviceWidthEnum.laptop
//                     ? <PageHeaderLink headerTitle={"Update Profile"} fixTop={true} />
//                     : null
//             }
//             <section
//                 className={"fixed px:top-80 flex flex-col justify-center items-center pct:w-100 h-200 mg-x-auto bg-lighter text-center lg:relative|px:top-0|h-480|pad-y8 dark:bg-000304|color-whitesmoke"}>
//                 {/*<Link to={"logo"}
//                           className={"d-block pad-y4 text-center decoration-none color-initial"}>
//                         {
//                             userData?.dp
//                                 ? <img src={userData?.dp} alt={`${userData?.firstname}`}
//                                        className="d-block mg-x-auto w-104 h-104 bg-light radius-circle object-cover object-center"/>
//                                 : <div
//                                     className={"relative d-block mg-x-auto square2-1 lh2-1 radius-circle border-0 border-DDD border-solid bg-green color-white text-center font-bold cursor-pointer hover:shadow:inset-0px-0px-16px-0px-DDD transition:box-shadow_200ms_ease"}>
//                                     {userData?.firstname.split('')[0].toUpperCase().toString()}
//                                 </div>
//                         }
//                     </Link>*/}
//                 {/*<div className={"font-30 lh-normal lg:font-60"}>
//                         <div className={"font-size-inherit"}></div>
//                         <div className={"font-size-inherit font-bold color-gray"}>Update Profile</div>
//                     </div>*/}
//                 {/*Profile Page*/}
//                 <div
//                     className={"relative flex flex-row justify-center align-items-center flex-basis flex-grow bg-inherit overflow-hidden z-10"}>
//                     {
//                         userData?.dp
//                             ? <img alt=""
//                                 className="relative d-block square-12 lh-12 radius-circle bg-lighter border-0 border-DDD border-solid bg-light cursor-pointer hover:shadow:inset-0px-0px-16px-0px-DDD transition:box-shadow_200ms_ease lg:square2-6|lh2-6"
//                                 src={userData?.dp}
//                             />
//                             : <div
//                                 className={"relative d-block square-12 lh-12 radius-circle bg-lighter border-0 border-DDD border-solid bg-light text-center font-bold cursor-pointer hover:shadow:inset-0px-0px-16px-0px-DDD transition:box-shadow_200ms_ease lg:square2-6|lh2-6 dark:bg-111314|color-whitesmoke dark:hover:shadow:inset-0px-0px-16px-0px-000304 dark:brightness-60"}>
//                                 {userData?.firstname?.split('')[0].toUpperCase() + userData?.lastname?.split('')[0].toUpperCase()}
//                             </div>
//                     }
//                     <div
//                         className={"d-block font-24 font-semibold pad-x2 pad-t2 pad-b1 lg:font-32|pad-y4"}>
//                         {userData?.firstname} {userData?.lastname}
//                         <div
//                             className={"relative font-15 font-light pad-y2 text-left lg:font-18|pad-y2"}>{userData?.email || userData?.phone_no}</div>
//                     </div>
//                     {/*<div className={"relative d-block mg-y2 lg:mg-y5"}>
//                             {
//                                 "python, javascript, golang".split(",").map((each_user_skills, index) => {
//                                     return (
//                                         <span key={index}
//                                               className={"bg-light radius pad-1 mg-x-2 lg:font-13"}>{each_user_skills}</span>
//                                     )
//                                 })
//                             }
//                         </div>*/}
//                     {/*<Link to={"/profile/update"}
//                               className={"h-5 lh-5 bg-green radius pad-x2 mg-t2 decoration-none color-white"}>Edit <span
//                             className={"fa fa-pen pad-l1 color-white"}></span></Link>*/}
//                 </div>
//             </section>

//             <section className={"relative px:top-280 bg-light lg:top-0|bg-initial dark:bg-111314|color-whitesmoke"}>
//                 <section className={"flex flex-column pad-t4 pad-b4 bg-white-solid lg:pct:w-56|mg-x-auto dark:bg-111314"}>
//                     {/*<header className={"font-15 pad-x2 pad-y2 font-medium lg:font-18|pad-y4"}>{"Personal details"}</header>*/}
//                     <section className={"bg-light dark:bg-000304"}>
//                         <div className={"relative d-block pct:w-100 pad-t2 pad-b8 bg-white-solid dark:bg-111314|color-whitesmoke"}>
//                             <HeaderLink headerTitle={"Display picture"} showArrow={true} linkUrl={"picture"} />
//                             <div className={"flex flex-row align-items-center pad-x2"}>
//                                 <span className={"lg:font-14|lh-40"}>Use a dp that personalizes you</span>
//                                 {
//                                     userData?.dp
//                                         ? <img src={userData?.dp} alt={`${userData?.firstname}`} width={"48"} height={"48"}
//                                             className="d-block mg-l-auto w-48 h-48 bg-light radius-circle object-cover object-center lg:w-80|h-80|lh-80" />
//                                         : <div
//                                             className={"relative d-block mg-l-auto square-6 lh-6 radius-circle border-0 border-DDD border-solid bg-light color-initial text-center font-bold cursor-pointer hover:shadow:inset-0px-0px-16px-0px-DDD transition:box-shadow_200ms_ease lg:square-10|lh-10 dark:bg-222425|color-whitesmoke dark:hover:shadow:inset-0px-0px-16px-0px-000304 dark:brightness-60"}>
//                                             {userData?.name?.split('')[0].toUpperCase().toString()}
//                                         </div>
//                                 }
//                             </div>
//                         </div>

//                         <div className={"mg-t-1 pad-t4 pad-b4 bg-white-solid dark:bg-111314|color-whitesmoke"}>
//                             <HeaderLink headerTitle={"Basic Info"} showArrow={true} linkUrl={"basic-info"} />
//                             {
//                                 userData?.firstname !== ""
//                                     ? <div className={"flex flex-column mg-y1 pad-2 font-14"}>
//                                         <span className={"lg:font-12|font-medium"}>About {userData?.firstname} </span>
//                                         <span className={"pad-y1 lg:font-13|lh-40"}>
//                                             {userData?.about_me || "-"}
//                                         </span>
//                                     </div>
//                                     : null
//                             }
//                             <div className={"flex flex-column mg-y1 pad-2 font-14"}>
//                                 <span className={"lg:font-12|font-medium"}><span className={"fa fa-phone square-4 lh-4 color-999"}></span> Mobile: </span>
//                                 <a href={`tel:${userData?.phone_no}`}
//                                     className={"pad-l5 pad-y1 decoration-none color-initial dark:color-whitesmoke"}>{userData?.phone_no || "-"}</a>
//                             </div>
//                             <div className={"flex flex-column mg-y1 pad-2 font-14"}>
//                                 <span className={"lg:font-12|font-medium"}><span className="fa fa-map square-4 lh-4 color-999"></span> Address: </span>
//                                 <span
//                                     className={"pad-l5 pad-y1 decoration-none color-initial dark:color-whitesmoke"}>{userData?.address || "-"}</span>
//                             </div>
//                             <div className={"flex flex-column mg-y1 pad-2 font-14"}>
//                                 <span className={"lg:font-12|font-medium"}><span className={"fa fa-flag square-4 lh-4 color-999"}></span> Country: </span>
//                                 <span className={"pad-l5 pad-y1"}>{userData?.country || "-"}</span>
//                             </div>
//                             <div className={"flex flex-column mg-y1 pad-2 font-14"}>
//                                 <span className={"lg:font-12|font-medium"}><span
//                                     className="fa fa-calendar-plus square-4 lh-4 color-999"></span>Date Joined: </span>
//                                 <span
//                                     className={"pad-l5 pad-y1 color-999"}>{new Date(userData?.date_joined).toLocaleDateString() || "-"}</span>
//                             </div>
//                         </div>
//                     </section>
//                 </section>
//                 <section className={"flex flex-column mg-y-1 pad-t4 pad-b4 bg-white-solid lg:pct:w-56|mg-x-auto dark:bg-111314|color-whitesmoke"}>
//                     {/*<Link to={""}
//                               className={"relative pct:w-100 font-15 pad-x2 pad-y2 font-medium radius decoration-none color-initial hover:bg-lighter lg:font-18|pad-y4"}>
//                             {"Your Apps"}
//                             <span className={"fa fa-angle-right abs right-4 font-18"}></span>
//                         </Link>*/}
//                     <HeaderLink headerTitle={"Your Apps"} showArrow={true} linkUrl={userData?.id && `../user/${userData?.id}/apps`} />
//                     <section className={"flex flex-row flex-nowrap justify-start align-items-start pad-x2 overflow-x-auto"}>
//                         {
//                             userApps?.results?.length > 0
//                                 ? userApps?.results.map((eachUserApps, index) => {
//                                     return (
//                                         index < 6 ? <BasicGridAppBoxes key={eachUserApps.id} {...eachUserApps} /> : null
//                                     )
//                                 })
//                                 : <div className={"mg-x-auto mg-y1 pad-2 font-14 text-center color-gray"}>No apps yet</div>
//                         }
//                     </section>
//                     {
//                         userData?.clicks > 0
//                             ? <section className={"every:flex|flex-column|mg-y1|pad-2|font-14"}>
//                                 <div className={""}>
//                                     <span className={""}><span
//                                         className={"fa fa-eye square-4 lh-4 text-center color-999"}></span> 144 views </span>
//                                     {/*<span className={"pad-l4 pad-y1"}>{userData?.phone_no || <NotDefined />}</span>*/}
//                                 </div>
//                                 <div className={""}>
//                                     <span className={""}><span
//                                         className={"fa fa-smile square-4 lh-4 text-center color-999"}></span> 16 reactions (Likes, clap) </span>
//                                     {/*<span className={"pad-l4 pad-y1"}>{userData?.country || <NotDefined />}</span>*/}
//                                 </div>
//                                 <div className={""}>
//                                     <span className={""}><span
//                                         className="fa fa-save square-4 lh-4 text-center color-999"></span> 4 saves </span>
//                                     {/*<span className={"pad-l4 pad-y1"}>{userData?.address || <NotDefined />}</span>*/}
//                                 </div>
//                                 <div className={""}>
//                                     <span className={""}><span
//                                         className="fa fa-money square-4 lh-4 text-center color-999"></span> 5 Donations (₦6000) </span>
//                                     {/*<span className={"pad-l4 pad-y1"}>{new Date(userData?.date_joined).toLocaleDateString() || <NotDefined />}</span>*/}
//                                 </div>
//                             </section>
//                             : null
//                     }
//                 </section>
//                 <section className={"flex flex-column mg-y-1 pad-t4 pad-b4 bg-white-solid lg:pct:w-56|mg-x-auto dark:bg-111314|color-whitesmoke"}>
//                     {/*<header className={"relative pct:w-100 font-15 pad-x2 pad-y2 font-medium lg:font-18|pad-y4"}>
//                             {"Social Profile"}
//                             <span className={"fa fa-angle-right abs right-4 font-18"}></span>
//                         </header>*/}
//                     <HeaderLink headerTitle={"Social info"} showArrow={true} linkUrl={"social-info"} />
//                     <section className={"every:flex|flex-column|mg-y1|pad-2|font-14"}>
//                         {
//                             userData && socialSitesList?.filter(item => Object.keys(userData?.social_account_dict).includes(item)).length > 0
//                                 ? socialSitesList?.map((socialSite, index) => {
//                                     if (userData?.social_account_dict[socialSite]) {
//                                         return (
//                                             <div key={index} className={""}>
//                                                 <span className={""}>
//                                                     <span
//                                                         className={`fab fa-${socialSite} square-4 lh-4 text-center color-999`}></span>
//                                                     {socialSite}:
//                                                 </span>
//                                                 <a href={userData?.social_account_dict[socialSite]} target={"_blank"} rel={"noreferrer"}
//                                                     className={"pad-l4 pad-y1 font-semibold color-initial dark:color-darkgray"}>@{getSocialAccountHandle(userData?.social_account_dict[socialSite])}</a>
//                                             </div>
//                                         )
//                                     }
//                                 })
//                                 : <div className={"text-center color-gray"}>No account configured</div>
//                         }
//                     </section>
//                 </section>
//             </section>
//         </section>
//     );
// }

const ProfileView = () => {
    // const { me } = useRouteLoaderData("root");
    const { me } = useLoaderData();
    const userData = me?.data;
    // const { rawToken, isLoggedIn, tokenData } = useTokenData();
    // const { size.windowWidth, screenWidth, deviceWidthEnum } = useDeviceWidth();
    const size = useDeviceSize();
    // const { rawToken, isLoggedIn, tokenData } = useAtomValue(tokenState);
    // const { user.userData, isError, isLoading, responseDetails } = useUserData();
    // const navigate = useNavigate();

    // const user = useContext(UserContext);


    useEffect(() => {
        return () => {
        }
    }, [])

    return (
        <section className="flex flex-col lg:flex-row">
            {
                size.windowWidth >= deviceWidthEnum.laptop
                && <ProfileDetailLeftNav userData={userData} />
            }
            <Outlet />
        </section>
    )

}

export default ProfileView;
