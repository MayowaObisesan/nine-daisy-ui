import { Link, Outlet, useLoaderData } from "react-router-dom";
import { HeaderLink, PageHeaderLink } from "../components/Elements";
import React from "react";
import { deviceWidthEnum, truncateLetters } from "../helpers/utils";
import { getApp } from "./loaders/appLoaders";
import { useDeviceSize } from "../hooks/useDeviceSize";
import NavBar from "../components/NavBar";
import useTokenData from "../hooks/useTokenData";

export async function loader({ params }) {
  const app = await getApp(params.appNameId);
  return { app };
}

export function UpdateAppsGroups() {
  const { app } = useLoaderData();
  const appData = app?.data;
  // const { id } = useParams();
  // const navigate = useNavigate();
  // const [appData] = useFetch(`${process.env.REACT_APP_BASE_URL}/app/${id}/`);
  // const { windowWidth, screenWidth, deviceWidthEnum } = useDeviceWidth();
  const size = useDeviceSize();
  const tokenData = useTokenData();

  return (
    <section
      className="update-app-form-container flex flex-col justify-start items-start w-full h-screen pct:w-100 pct:h-100 overflow-x-hidden dark:bg-111314">
      {/*<section
        className="new-app-banner lg:pct:w-28 pct:h-86 mg-r4 bg-f9f9f9 bg-mica radius-inherit border-1 border-eeeeee">
        <section className="bg-00995544"></section>
      </section>*/}
      {
        size.windowWidth < deviceWidthEnum.laptop
          ? <PageHeaderLink headerTitle={"Update your app"} fixTop={true}>
            {
              appData.owner.id === tokenData?.tokenData?.user_id
                ? <Link to={`/app/${appData.name_id}/update/new`}
                  className={"btn btn-primary absolute right-4 h-10 leading-10 rounded-xl px-4 decoration-none"}>
                  List New Version
                  <span className={"fa fa-upload pl-1"}></span>
                </Link>
                : null
            }
          </PageHeaderLink>
          : <NavBar>
            {
              appData?.owner.id === tokenData?.tokenData?.user_id
                ? <>
                  <div className="divider divider-horizontal"></div>
                  <Link to={`/app/${appData?.name_id}/update`}
                    className={"btn btn-primary h-6 leading-6 bg-green rounded-xl text-base px-4 decoration-none"}>
                    List new version
                    <span className={"fa fa-upload pl-1 text-sm color-white"}></span>
                  </Link>
                </>
                : null
            }
          </NavBar>
      }

      <section className={"fixed top-[80px] px:top-80 flex flex-col justify-center items-center w-full h-[200px] pct:w-100 h-200 mx-auto bg-base-200 bg-light text-center lg:relative lg:top-0 lg:min-h-[480px] lg:py-8 lg:relative|px:top-0|min-h-480|pad-y8 dark:bg-000304"}>
        <div className={"text-2xl font-30 lh-normal w-[80%] pct:w-80 lg:text-5xl lg:font-60"}>
          <div className={"font-size-inherit dark:color-whitesmoke"}>Update</div>
          <div className={"font-size-inherit font-bold color-gray dark:color-darkgray"}>{appData?.name}</div>
        </div>
      </section>
      <section className={"relative top-[280px] px:top-280 block w-full pct:w-100 z-1 lg:top-0 l:w-[56%] lg:mx-auto lg:px:top-0|pct:w-56|mg-x-auto"}>
        {/* <div
          className={"d-none sticky px:top-80 flex flex-row flex-nowrap pct:w-100 h-8 lh-8 bg-green-inverse bg-mica4 overflow-x-auto z-10 every:d-block|flex-grow|flex-noshrink|decoration-none|pad-x2"}>
          {
            ["overview", "screenshots", "basic info", "category", "links", "app management"].map((eachTab, index) => (
              <span key={index}>{eachTab}</span>
            )
            )
          }
        </div> */}

        <section className={"overview-container relative"}>
          {/* Contains:
                  - App logo
                  - App screenshots
                  - App name
                  - App description
                  - App version
                  - App category
                  - App download links
                  - App website
                  - App management (settings, delete, under-construction, beta etc.)
                  */}
          <AppOverview {...appData} />
        </section>
      </section>
    </section>
  )
}

function AppOverview(props) {
  return (
    <section className={"bg-white bg-light rounded-t-2xl px-2 pt-2 pb-8 lg:p-8 lg:pad-unset dark:bg-111314 dark:bg-base-300"}>
      <section className={"flex flex-col lg:grid lg:grid-cols-3 gap-y-8 lg:grid-flow-row lg:gap-x-8 lg:gap-y-8"}>
        <section className={"space-y-8 lg:space-y-8"}>
          {/* App logo */}
          <div className={"card card-bordered bg-base-100 relative block w-full pb-6 pct:w-100 bg-white-solid dark:bg-111314BB dark:color-whitesmoke"}>
            {/* <Link to={"logo"} className={"card-title inline-block v-align-middle w-full pct:w-100 decoration-none color-initial"}>
              <header className={"inline-block w-[80%] font-semibold font-14 px-4 lg:font-18 dark:color-darkgray"}>App Logo</header>
              <div
                className={"inline-block w-[20%] text-right"}>
                <span className={"fa fa-angle-right w-16 h-16 leading-[64px] square-8 lh-8 color-initial text-center decoration-none dark:color-whitesmoke"}></span>
              </div>
            </Link> */}
            <HeaderLink headerTitle={"App Logo"} showArrow={true} linkUrl={"logo"} classes={"px-2 py-4 lg:p-4"} />
            <div className={"flex flex-row items-center px-6 lg:px-8"}>
              <span className={"lg:text-lg mr-4 lg:font-14|lh-40"}>Use a logo that personalizes <b>{props.name}</b></span>
              {
                props.logo
                  ? <img src={props.logo} alt={`${props.name} logo`} width={"48"} height={"48"}
                    className="block ml-auto w-12 h-12 bg-base-200 bg-light rounded-full radius-circle object-cover object-center lg:w-20 lg:h-20 leading-[80px] lg:w-80|h-80|lh-80" />
                  : <div
                    className={"relative block ml-auto w-12 h-12 lh-12 square-6 lh-6 rounded-full radius-circle border-0 border-DDD border-solid bg-light color-initial text-center font-bold cursor-pointer hover:shadow:inset-0px-0px-16px-0px-DDD transition:box-shadow_200ms_ease lg:w-20 lg:h-20 lg:lh-[80px] lg:square-10|lh-10"}>
                    {props?.name?.split('')[0].toUpperCase().toString()}
                  </div>
              }
            </div>
          </div>

          {/* App screenshots*/}
          <div className={"card card-bordered bg-base-100 pb-8 bg-white-solid dark:bg-111314BB lg:m-0"}>
            <HeaderLink headerTitle={"Screenshots"} showArrow={true} linkUrl={"screenshots"} classes={"px-2 py-4 lg:p-4"} />
            <section className={"flex flex-row flex-nowrap justify-start w-full px-2 lg:px-4 pct:w-100 every:radius-sm dark:bg-111314BB"}>
              {
                props?.screenshot?.length > 0
                  ? props?.screenshot.map((image, index) => (
                    <>
                      <div className={"w-full pct:w-100 h-[240px] px-4 pb-4 bg-inherit bg-lighter rounded-xl radius-inherit dark:bg-inherit lg:pb-0"}>
                        <img key={index} src={image.image}
                          alt={`screenshot preview ${index}`} height={"100%"}
                          className={"max-w-full pct:max-w-100 h-full object-cover object-center rounded-xl radius-inherit"} />
                      </div>
                      {/*<div className={"abs bottom-0 pct:w-100 bg-transparent"}></div>*/}
                    </>
                  ))
                  : <div
                    className={"flex flex-col justify-center items-center gap-6 lg:gap-8 w-[96%] h-[160px] pct:w-96 h-160 border:2px_dashed_DDD mx-auto mt-4 rounded-xl radius color-BBB dark:border:2px_dashed_darkgray"}>
                    <span className="fa fa-plus text-2xl font-24 pad-y2"></span>
                    <div>Select images to upload</div>
                  </div>
              }
            </section>
          </div>
        </section>

        {/* App name and Description */}
        <div className={"card card-bordered bg-base-100 col-span-2 gap-2 pb-8 bg-white-solid dark:bg-111314BB"}>
          <HeaderLink headerTitle={"Basic Info"} showArrow={true} linkUrl={"basic-info"} classes={"rounded-t-xl px-2 py-2 lg:px-4 lg:py-4"} />
          <div className="space-y-4 px-2 lg:px-4">
            <div className="relative space-y-2 px-4 py-2 font-13 bg-white-solid lg:font-14|lh-40|pad-y3 dark:bg-111314BB dark:color-whitesmoke">
              <div className={"h4 lh-4 font-11 font-medium lg:font-12"}>App name:</div>
              <div className="font-bold text-2xl">{props.name}</div>
            </div>
            <div className="relative space-y-2 px-4 py-2 bg-white-solid text-md font-13 lg:font-13|lh-40|pad-y3 dark:bg-111314BB dark:color-whitesmoke">
              <div className={"h4 lh-4 font-11 font-medium lg:font-12"}>Description:</div>
              <div className={"text-lg font-medium"}>{props.truncate_description ? truncateLetters(props.description, 0, 160) : props.description}</div>
            </div>
            <div className="relative space-y-2 px-4 py-2 bg-white-solid font-13 lg:font-14|lh-40|pad-y3 dark:bg-111314BB dark:color-whitesmoke">
              <div className={"h4 lh-4 font-11 font-medium lg:font-12"}>Version:</div>
              <kbd className={"kbd kbd-lg"}>{props.version || "-"}</kbd>
            </div>
            <div className="relative space-y-2 px-4 py-2 bg-white-solid font-13 lg:font-14|lh-40|pad-y3 dark:bg-111314BB dark:color-whitesmoke">
              <div className={"h4 lh-4 font-11 font-medium lg:font-12"}>Website:</div>
              <div className={"text-lg font-bold"}>{props.website || "-"}</div>
            </div>
          </div>
        </div>

        {/* App category */}
        <div className={"card card-bordered bg-base-100 bg-white-solid dark:bg-111314BB"}>
          <HeaderLink headerTitle={"Category"} showArrow={true} linkUrl={"category"} classes={"px-2 py-4 lg:p-4"} />
          <div className="flex flex-col py-2 px-2 lg:px-4 overflow-x-auto">
            {
              props.category
                ? props.category?.split(',').map((each_app_category, index) => (
                  <span
                    key={index}
                    className="block px-4 h-12 leading-[48px] mx-1.5 my-2 rounded-xl radius bg-base-200 bg-light font-normal font-12 lg:text-lg lg:h-16 lg:leading-[64px] lg:my-2 lg:font-14|h-8|lh-8|mg-y1-sm dark:bg-333435|color-darkgray">
                    {each_app_category}
                  </span>
                ))
                : <div className={"font-14 color-gray text-center p-4"}>No selected category</div>
            }
          </div>
        </div>

        {/* App download links */}
        <div className={"card card-bordered bg-base-100 bg-white-solid dark:bg-111314BB"}>
          <HeaderLink headerTitle={"Download links"} showArrow={true} linkUrl={"download-links"} classes={"px-2 py-4 lg:p-4"} />
          <section className={"space-y-2 px-2 lg:px-4 every:d-block|pad-2"}>
            <div id="id-app-download-links"
              className={"flex flex-row items-center p-4 color-initial lg:text-xl lg:font-14 dark:color-whitesmoke"}>
              <span className="fab fa-google-play w-12 h-12 leading-[48px] square-6 lh-6 text-2xl font-18 color-444 dark:color-darkgray"></span>
              <div className="leading-tight">
                <div className={"text-[15px]"}>Download from</div>
                <div className={"font-semibold"}>{props.playstore_link ? "Google play store" : "-"}</div>
              </div>
            </div>
            <div id="id-app-download-links"
              className={"flex flex-row items-center p-4 color-initial lg:text-xl lg:font-14 dark:color-whitesmoke"}>
              <span className="fab fa-app-store-ios w-12 h-12 leading-[48px] square-6 lh-6 text-2xl font-18 color-444 dark:color-darkgray"></span>
              <div className="leading-tight">
                <div className={"text-[15px]"}>Download from</div>
                <div className={"font-semibold"}>{props.appstore_link ? "Apple AppStore" : "-"}</div>
              </div>
            </div>
            <div id="id-app-download-links"
              className={"flex flex-row items-center p-4 color-initial lg:text-xl lg:font-14 dark:color-whitesmoke"}>
              <span
                className="fa fa-link w-12 h-12 leading-[48px] square-6 lh-6 text-2xl font-18 color-444 dark:color-darkgray"></span>{props.external_link ? "External download link" : "-"}

            </div>
          </section>
        </div>

        {/* App Management */}
        <div className={"card card-bordered bg-base-100 bg-white-solid dark:bg-111314BB"}>
          <HeaderLink headerTitle={"App management"} showArrow={false} classes={"px-2 py-4 lg:p-4"} />
          <section className={"space-y-2 px-2 lg:px-4 every:d-block|pad-2"}>
            <div id="id-app-download-links"
              className={"flex flex-row items-center p-4 color-lightgray dark:color-333435"}>
              <span className="fa fa-gear w-12 h-12 leading-[48px] square-6 lh-6 text-2xl font-18 color-lightgray dark:color-333435"></span>
              <div className={"lg:text-lg"}>{"Settings"}</div>
            </div>
            <div id="id-app-download-links"
              className={"flex flex-row items-center p-4 color-lightgray dark:color-333435"}>
              <span
                className="fa fa-hammer w-12 h-12 leading-[48px] square-6 lh-6 text-2xl font-18 color-lightgray dark:color-333435"></span>
              <div className={"lg:text-lg"}>{"Under construction"}</div>
            </div>
            <div id="id-app-download-links"
              className={"flex flex-row items-center p-4 color-lightgray dark:color-333435"}>
              <span
                className="fa fa-flask w-12 h-12 leading-[48px] square-6 lh-6 text-2xl font-18 color-lightgray dark:color-333435"></span>
              <div className={"lg:text-lg"}>{"Beta"}</div>
            </div>
            <Link to={`../app/${props.name_id}/delete`} id="id-app-download-links"
              className={"flex flex-row items-center p-4 font-bold text-error color-red decoration-none"}>
              <span className="fa fa-trash w-12 h-12 leading-[48px] square-6 lh-6 text-2xl font-18"></span>
              <div className={"lg:text-lg"}>{"Delete"} {props.name}</div>
            </Link>
          </section>
        </div>
      </section>
    </section>
  )
}

export const AppDetailLeftNav = ({ appName, pageName }) => {
  const navLinks = ["Logo", "Basic-info", "Screenshots", "Category", "Download-links"];
  return (
    <section className={"sticky flex-shrink-0 top-0 w-80 h-screen bg-base-100 dark:bg-base-100 pct:w-20 vh:h-100 bg-lighter px-4 dark:bg-222425 dark:lg:bg-000304"}>
      <Link
        to={`${window.location.pathname.split("/").slice(0, window.location.pathname.split("/").length - 1).join("/")}/`}
        className={"flex flex-col justify-center items-start text-2xl font-18 leading-normal lh-normal w-full h-[160px] pct:w-100 h-160 px-8 pad-x4 color-initial decoration-none hover:decoration-2 hover:underline lg:text-3xl lg:font-24 dark:color-whitesmoke"}>
        <div className={"font-size-inherit"}>Update</div>
        <div className={"font-size-inherit font-bold color-gray"}>{appName}</div>
      </Link>
      <section
        className={"block every:d-block|pad-4|radius|decoration-none|color-initial hover:every:bg-light dark:every:color-whitesmoke dark:hover:every:bg-222425"}>
        {
          navLinks.map((eachNavLink, index) => {
            if (pageName !== eachNavLink) {
              return (
                <Link
                  // to={`${window.location.pathname.split("/").slice(0, window.location.pathname.split("/").length - 1).join("/")}/${eachNavLink.toLowerCase()}`}
                  to={eachNavLink.toLowerCase()}
                  className={"block p-8 rounded-xl decoration-0 hover:bg-base-200 dark:bg-base-100"}
                >
                  {eachNavLink.replace("-", " ")}
                </Link>
              )
            }
          })
        }
        {/*<Link
                    to={`${window.location.pathname.split("/").slice(0, window.location.pathname.split("/").length - 1).join("/")}/screenshots`}>Basic info</Link>
                <Link
                    to={`${window.location.pathname.split("/").slice(0, window.location.pathname.split("/").length - 1).join("/")}/screenshots`}>Screenshots</Link>
                <Link
                    to={`${window.location.pathname.split("/").slice(0, window.location.pathname.split("/").length - 1).join("/")}/category`}>Category</Link>
                <Link
                    to={`${window.location.pathname.split("/").slice(0, window.location.pathname.split("/").length - 1).join("/")}/download-links`}>Download
                    links</Link>*/}
      </section>
    </section>
  )
}
const UpdateAppDetail = () => {
  const size = useDeviceSize();

  return (
    <section className="flex flex-col lg:flex-row">
      {
        size.windowWidth >= deviceWidthEnum.laptop
        && <AppDetailLeftNav appName={"Nine"} />
      }
      {/* <UpdateAppsGroups /> */}
      <Outlet />
    </section>
  )
}
export default UpdateAppDetail;