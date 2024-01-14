import React, { useCallback, useEffect, useState } from 'react';
import { Link, useLoaderData, useNavigation } from 'react-router-dom';
import { deviceWidthEnum, truncateLetters } from "../helpers/utils";
import Footer from "./Footer";
import { getApp } from './loaders/appLoaders';
import { Avatar, PageHeaderLink } from '../components/Elements';
import { useDeviceSize } from '../hooks/useDeviceSize';
import NavBar from '../components/NavBar';
import useTokenData from '../hooks/useTokenData';
import { BasicGridAppBoxes, SearchAppBoxes } from '../components/AppBoxes';
import useFetch from '../hooks/useFetch';


export async function loader({ params }) {
  const app = await getApp(params.appNameId);
  return { app };
}

const singleAppData = (app_name, state) => {
}

function AppDetailLoading(props) {
  return (
    <section>Loading...</section>
  )
}

const ExternalLink = ({ url, text, id, classes, children }) => {
  return (
    <a
      id={id}
      href={url}
      target={"_blank"}
      rel={"noreferrer"}
      className={`flex flex-row items-center lg:font-13 ${classes}`}>
      {/*<span className="fa-brands fa-google-play d-block font-30 pad-t4 pad-b2"></span>*/}
      {/* <img
        src="/static/playstore.png"
        alt={"playstore logo"}
        width={"32"}
        height={"32"}
        className={"mx-2"} /> */}
      {children}
      {text}
    </a>
  )
}

function AppDetailContent(props) {
  const [appData, setAppData] = useState({
    appDetails: null,
    networkError: false,
    isAppsLoading: false,
    responseDetails: ''
  })
  const tokenData = useTokenData();
  // const { size.windowWidth, screenWidth, deviceWidthEnum } = useDeviceWidth();
  const size = useDeviceSize();
  const [userApps] = useFetch(`${process.env.REACT_APP_BASE_URL}/user/${props.owner.id}/apps/`);
  const [screenshotPreviewImage, setScreenshotPreviewImage] = useState("");
  const [counter, setCounter] = useState(0);

  useEffect(() => {
    setScreenshotPreviewImage(props.screenshot[0].image);
    const screenshotCount = props.screenshot?.length;
    if (screenshotCount && screenshotCount > 1) {
      let counter = 0;
      setInterval(() => {
        if (counter === screenshotCount) counter = 0;
        setScreenshotPreviewImage(props.screenshot[counter].image); counter++;
      }, 8000);
    }
  }, [props.screenshot[0].image]);

  // const changeAppBannerScreenshot = useCallback(() => {
  //   const screenshotCount = props.screenshot?.length;
  //   // let counter = 0;
  //   if (counter === screenshotCount) setCounter(0);
  //   setScreenshotPreviewImage(props.screenshot[counter].image);
  //   // counter++;
  //   setCounter((oldCounter) => oldCounter + 1);
  // }, []);

  // useEffect(() => {
  //   let interval;
  //   clearInterval(interval);
  //   // setScreenshotPreviewImage(props.screenshot[0].image);
  //   const screenshotCount = props.screenshot?.length;
  //   if (screenshotCount && screenshotCount > 1) {
  //     setInterval(changeAppBannerScreenshot, 8000);
  //   }
  // }, [props.screenshot[0].image, changeAppBannerScreenshot, counter]);

  const OwnerContact = () => {
    return (
      <section className={"block every:decoration-none|color-initial dark:every:color-whitesmoke"}>
        <Link to={props.owner.id === tokenData?.tokenData?.user_id ? "/profile" : `/user/${props.owner.id}`}
          className="flex flex-row justify-start items-center gap-x-2 p-4 my-1 decoration-none color-initial radius rounded-2xl bg-base-100 hover:bg-base-200 lg:bg-base-200 hover:bg-lighter dark:hover:bg-base-300">
          {/* <img src={props.owner.dp} alt="" width={"48"} height={"48"}
            className="square-6 lh-6 radius-circle bg-lighter dark:bg-222324" /> */}
          <Avatar
            src={props.owner.dp}
            alt={""}
            type={"rounded-full"}
            classes={"w-12 bg-base-300"}
          >
            <span className={"font-bold"}>
              {props.owner.firstname && props.owner.firstname[0].toUpperCase()}
              {props.owner.lastname && props.owner.lastname[0].toUpperCase()}
            </span>
          </Avatar>
          <div className="pad-x1 font-medium">{props.owner.firstname} {props.owner.lastname}</div>
        </Link>
        <a href={`mailto:${props.owner.email}`} id="id-app-owner-email"
          className="block pl-8 pr-4 py-4 rounded-2xl radius hover:bg-base-200 hover:decoration-2 hover:underline-offset-2 hover:underline dark:hover:bg-base-300">
          <span className="fa fa-envelope w-8 h-8 leading-8 square-4 lh-4 pr-2 text-gray-500 color-999"></span>
          <span className={"px-2"}>{props.owner.email}</span>
        </a>
        <a href={`tel:${props.owner.phone_no}`} id="id-app-owner-email"
          className="block pl-8 pr-4 py-4 rounded-2xl radius hover:bg-base-200 hover:decoration-2 hover:underline-offset-2 hover:underline dark:hover:bg-base-300">
          <span className="fa fa-phone w-8 h-8 leading-8 square-4 lh-4 pr-2 text-gray-500 color-999"></span>
          <span className={"px-2"}>{props.owner.phone_no || "-"}</span>
        </a>
        <div id="id-app-owner-email" className="pl-8 pr-4 py-4">
          <span className="fa fa-earth-africa w-8 h-8 leading-8 square-4 lh-4 pr-2 text-gray-500 color-999"></span>
          <span className={"px-2"}>{props.owner.address || '-'}</span>
        </div>
      </section>
    );
  }

  return (
    <section className={"flex flex-col"}>
      {/*<AppBoxesDetail
          key={props.id}
          id={props.id}
          name={props.name}
          description={props.description}
          category={props.category}
          {...props}
      />*/}

      {
        size.windowWidth < deviceWidthEnum.laptop
          // ? <div className={"fixed top-0 left-0 flex flex-row align-items-center pct:w-100 h-10 bg-white bg-mica z-2"}>
          //   <Link to="/"
          //     className="d-block square-8 lh-9 top-0 left-1 lg:top-4|left-4|square-8|lh-8 color-initial text-center z-10 decoration-none">
          //     <span className="fa fa-angle-left font-18 color-999"></span>
          //   </Link>
          //   {/*<header
          //          className={"d-block pct:w-100 h-10 lh-10 pad-x2 font-18 font-bold text-left color-444A44"}>
          //          {props.name}
          //      </header>*/}
          //   {
          //     props.owner.id === tokenData?.tokenData?.user_id
          //       ? <Link to={`/app/${props.name_id}/update`}
          //         className={"abs px:top-20 right-4 h-5 lh-5 bg-green radius pad-x2 decoration-none color-white"}>
          //         Edit
          //         <span className={"fa fa-pen pad-l1 color-white"}></span>
          //       </Link>
          //       : null
          //   }
          // </div>
          ? <PageHeaderLink fixTop={true}>
            {
              props.owner.id === tokenData?.tokenData?.user_id
                ? <Link to={`/app/${props.name_id}/update`}
                  className={"btn btn-primary absolute right-4 h-10 leading-10 rounded-xl px-4 decoration-none"}>
                  Edit
                  <span className={"fa fa-pen pl-1"}></span>
                </Link>
                : null
            }
          </PageHeaderLink>
          : <NavBar>
            {
              size.windowWidth >= deviceWidthEnum.laptop &&
              props.owner.id === tokenData?.tokenData?.user_id
              && <>
                <div className="divider divider-horizontal"></div>
                <Link to={`/app/${props.name_id}/update`}
                  className={"btn btn-primary h-6 leading-6 bg-green rounded-xl text-lg px-4 decoration-none"}>
                  Edit
                  <span className={"fa fa-pen pl-2 text-sm color-white"}></span>
                </Link>
              </>
            }
          </NavBar>
      }

      {/*<section
          className={"flex flex-row flex-nowrap pct:w-100 overflow-x-auto justify-start pad-x1 every:radius-sm"}>
        <img src={props.logo} alt={`${props.name} logo`} className="h-320 pct:w-88 bg-light gradient:to_top_right-lightgray-whitesmoke radius-top-left radius-top-right object-cover object-center" />
        {
          props.screenshot.map((image, index) => (
              <div className={"flex-grow flex-noshrink pct:w-48 h-320 bg-lighter pad-x-2 radius-inherit"}>
                <img key={index} src={image.image}
                     alt={`screenshot preview ${index}`} height={"100%"}
                     className={"pct:max-w-100 object-cover object-center radius-inherit"}/>
              </div>
          ))
        }
      </section>*/}
      {
        size.windowWidth < deviceWidthEnum.laptop &&
        <section
          className={"fixed top-20 flex flex-row flex-nowrap justify-around w-full h-[200px] z-0 every:text-center|h-240|radius-sm lg:relative lg:top-0 lg:h-[480px] lg:every:h-480"}>
          {
            props?.screenshot.length > 0
              ? props?.screenshot.map((image, index) => (
                <>
                  <div key={index} className={"w-full h-[240px] mx-auto px-4 rounded-lg lg:h-[480px] lg:px-2"}>
                    <img src={image.image}
                      alt={`screenshot preview ${index}`} height={""}
                      className={"max-w-full w-full h-full object-cover object-center rounded-lg"} />
                  </div>
                  <div className={"absolute bottom-0 w-full bg-transparent"}></div>
                </>
              ))
              : <div className={"relative flex flex-col justify-center items-center w-full leading-normal bg-lighter gradient:to_bottom-whitesmoke-lightgray color-lightgray font-64 font-bold text-center lg:items-start lg:h-[480px] lg:px-[400px] dark:gradient:to_bottom-111314-222425|color-darkgray dark:rounded-none"}>{props.name}</div>
          }
        </section>
      }
      {
        size.windowWidth >= deviceWidthEnum.laptop &&
        <section
          className={"fixed top-20 flex flex-row flex-nowrap items-center justify-around px-16 w-full h-[200px] z-0 every:text-center|h-240|radius-sm lg:relative lg:top-0 lg:h-[600px] lg:every:h-480"}>
          <section className={"w-[60%] h-[480px]"}>
            <section className={"relative flex flex-col justify-center bg-gray-10 bg-lighter px-0 py-0 rounded-2xl lg:p-2 lg:rounded-2xl dark:bg-base-200 dark:lg:mb-2"}>
              {/* {
              // For mobile, tablet and devices smaller than the laptop
              size.windowWidth < deviceWidthEnum.laptop
                ? <div className="relative flex flex-row justify-start items-center pt-4 pb-0 px-2 font-bold text-4xl font-21 text-center rounded-xl bg-inherit z-2 dark:color-whitesmoke dark:every:bg-333334|color-whitesmoke">
                  {
                    props.logo
                      ? <img src={props.logo} alt={`${props.name} logo`}
                        className="block mx-4 my-4 w-16 h-16 bg-light rounded-full radius-circle object-cover object-center dark:bg-333334" />
                      : <div
                        className={"relative block mx-4 w-16 h-16 leading-[64px] square-8 lh-8 rounded-full radius-circle border-0 border-DDD border-solid bg-light text-center font-bold cursor-pointer hover:shadow:inset-0px-0px-16px-0px-DDD transition:box-shadow_200ms_ease dark:bg-333334"}>
                        {props?.name?.split('')[0].toUpperCase().toString()}
                      </div>
                  }
                  {props.name}
                </div>
                : null
            } */}
              {
                /* For laptop and larger devices */
                size.windowWidth >= deviceWidthEnum.laptop
                  ? <div
                    className="relative flex flex-row items-center pt-8 pb-0 px-6 font-bold text-8xl rounded-2xl bg-inherit every:d-block|mg-x2|mg-y2|w-108|h-108|lh-108|radius-circle|bg-light dark:color-whitesmoke dark:every:bg-333334|color-whitesmoke">
                    {
                      props.logo
                        ? <img src={props.logo} alt={`${props.name} logo`}
                          className="block w-24 h-24 rounded-full mx-4 my-4 object-cover object-center dark:bg-lighter" />
                        :
                        <div
                          className={"relative border-0 border-DDD border-solid text-center font-bold cursor-pointer hover:shadow:inset-0px-0px-16px-0px-DDD transition:box-shadow_200ms_ease dark:hover:shadow:inset-0px-0px-8px-0px-222425"}>
                          {props?.name?.split('')[0].toUpperCase().toString()}
                        </div>
                    }
                    {props.name}
                  </div>
                  : null
              }
              <div className="px-7 pt-2 pb-4 bg-inherit rounded-b-lg lg:font-14 lg:leading-10 lg:px-6 lg:py-5 lg:bg-inherit dark:color-whitesmoke">
                {props.truncate_description ? truncateLetters(props.description, 0, 160) : props.description}
              </div>

              {
                size.windowWidth >= deviceWidthEnum.laptop &&
                  props.owner.id === tokenData?.tokenData?.user_id
                  ? <Link to={`/app/${props.name_id}/update`}
                    className={"hidden btn btn-primary absolute top-10 right-8 h-5 lh-5 bg-green rounded-xl px-4 decoration-none color-white"}>
                    Edit
                    <span className={"fa fa-pen pl-2 color-white"}></span>
                  </Link>
                  : null
              }

              <div className="flex flex-row flex-nowrap px-6 py-4 bg-base-100 rounded-xl radius overflow-x-auto lg:px-4 lg:py-2 lg:bg-inherit dark:bg-inherit">
                {
                  props.category && props.category.split(',').map((each_app_category, index) => {
                    return (
                      <span key={index}
                        className="inline-block px-4 h-10 leading-10 mx-1 rounded-lg border:1px_solid_DDD bg-base-300 font-normal font-11 lg:h-12 lg:leading-[48px] lg:border-0 lg:text-md dark:bg-111314BB|color-whitesmoke|border:1px_solid_222425">
                        {each_app_category}
                      </span>
                    )
                  })
                }
              </div>
            </section>
            <section className="app-download-details rounded-xl bg-base-10 pl-6 dark:bg-base-300 dark:p-0">
              {/*<header className={"font-medium"}>{"Download links".toUpperCase()}</header>*/}
              <section
                className={"flex flex-row justify-start gap-x-4 pt-5 pb-5 empty:pad-0 rounded-lg overflow-x-auto every:w-auto|h-64|radius|text-center|radius-inherit|decoration-none|bg-lighter|color-initial|mg-x1|pad-r4 hover:every:bg-E8E8E8|cursor-pointer dark:bg-inherit|pad-x2 dark:every:bg-333435|color-whitesmoke dark:hover:every:bg-333435"}>
                {
                  props.playstore_link !== ""
                    ? <ExternalLink
                      url={props.playstore_link}
                      // text={"Download from Play Store"}
                      classes={"flex-shrink-0 gap-4 w-auto h-16 rounded-2xl text-center decoration-none bg-base-200 mx-1 px-5 pr-8 hover:bg-base-300 dark:hover:bg-base-100 transition-colors"}
                    >
                      <Avatar
                        src={"/static/playstore.png"}
                        alt={"playstore logo"}
                        width={"0"}
                        classes={"w-8 rounded-none"}>
                      </Avatar>
                      <div className="leading-tight text-left">
                        <div className={"text-[15px]"}>Download from</div>
                        <div className={"font-semibold"}>{props.playstore_link ? "Google play store" : "-"}</div>
                      </div>
                      {/* {
                          size.windowWidth <= deviceWidthEnum.laptop
                            ? <span className={""}>Download</span>
                            : <span className={""}>Download from Play Store</span>
                        } */}
                    </ExternalLink>
                    : null
                }
                {
                  props.appstore_link !== ""
                    ? <ExternalLink
                      url={props.appstore_link}
                      id={"id-app-download-links"}
                      classes={"flex-shrink-0 gap-4 w-auto h-16 rounded-2xl text-center decoration-none bg-base-200 mx-1 px-5 pr-8 hover:bg-base-300 dark:hover:bg-base-100 transition-colors"}>
                      {/*<span className="fa-brands fa-app-store-ios d-block font-30 pad-t4 pad-b2"></span>*/}
                      <Avatar
                        src="/static/appstore.png"
                        alt={"appstore logo"}
                        width={"0"}
                        classes={"w-8 rounded-none"} />
                      {/* {
                          size.windowWidth <= deviceWidthEnum.laptop
                            ? "Download"
                            : "Download from AppStore"
                        } */}
                      <div className="leading-tight text-left">
                        <div className={"text-[15px]"}>Download from</div>
                        <div className={"font-semibold"}>{props.playstore_link ? "Apple AppStore" : "-"}</div>
                      </div>
                    </ExternalLink>
                    : null
                }
                {
                  props.external_link !== ""
                    ? <ExternalLink
                      url={props.external_link}
                      id="id-app-download-links"
                      classes={"flex-shrink-0 gap-4 w-auto h-16 rounded-2xl text-center decoration-none bg-base-200 mx-1 px-5 pr-8 hover:bg-base-300 dark:hover:bg-base-100 transition-colors"}>
                      {/*<span className="fa fa-download d-block font-30 pad-t4 pad-b2"></span>*/}
                      <Avatar
                        src={"/static/download.png"}
                        alt={"download logo"}
                        width={"32"}
                        classes={"w-8 rounded-none"} />
                      {
                        size.windowWidth <= deviceWidthEnum.laptop
                          ? "External Download"
                          : "External Download"
                      }
                    </ExternalLink>
                    : null
                }
                {/* {
                    props.playstore_link !== ""
                      ? <a href={props.playstore_link}
                        target={"_blank"}
                        rel={"noreferrer"}
                        id="id-app-download-links"
                        className={"flex flex-row items-center lg:font-13"}>
                        <span className="fa-brands fa-google-play d-block font-30 pad-t4 pad-b2"></span>
                        <img
                          src="/static/playstore.png"
                          alt={"playstore logo"}
                          width={"32"}
                          height={"32"}
                          className={"mx-2"} />
                        {"Play Store"}
                      </a>
                      : null
                  }
                  {
                    props.appstore_link !== ""
                      ? <a href={props.appstore_link}
                        target={"_blank"}
                        rel={"noreferrer"}
                        id="id-app-download-links"
                        className={"flex flex-row items-center lg:font-13"}>
                        <span className="fa-brands fa-app-store-ios d-block font-30 pad-t4 pad-b2"></span>
                        <img
                          src="/static/appstore.png"
                          alt={"appstore logo"}
                          width={"32"}
                          height={"32"}
                          className={"mx-2"} />
                        {"App Store"}
                      </a>
                      : null
                  }
                  {
                    props.external_link !== ""
                      ? <a href={props.external_link}
                        target={"_blank"}
                        rel={"noreferrer"}
                        id="id-app-download-links"
                        className={"flex flex-row items-center lg:font-13"}>
                        <span className="fa fa-download d-block font-30 pad-t4 pad-b2"></span>
                        <img
                          src="/static/download.png"
                          alt={"download logo"}
                          width={"32"}
                          height={"32"}
                          className={"mx-2"} />
                        {"Download"}
                      </a>
                      : null
                  } */}
              </section>
              {
                props.external_link
                  ? <div className={"px-4 pb-2 font-medium dark:color-whitesmoke"}>
                    {"** This app has an external download link."}
                  </div>
                  : null
              }
            </section>
          </section>
          <section className={"relative flex flex-row flex-nowrap justify-center items-center bg-green-30 gap-4 flex-grow-0 w-[40%] px-12"}>
            {/* <div aria-hidden="true" class="flex absolute -top-96 start-1/2 transform -translate-x-1/2 z-0">
            <div class="bg-gradient-to-r from-violet-300/50 to-purple-100 blur- w-[25rem] h-[44rem] rotate-[-60deg] transform -translate-x-[10rem] dark:from-violet-900/50 dark:to-purple-900"></div>
            <div class="bg-gradient-to-tl from-blue-50 via-blue-100 to-blue-50 blur- w-[90rem] h-[50rem] rounded-fulls origin-top-left -rotate-12 -translate-x-[15rem] dark:from-indigo-900/70 dark:via-indigo-900/70 dark:to-blue-900/70"></div>
          </div> */}
            <div className={"absolute w-64 h-72 rounded-xl bg-gradient-to-r from-violet-300/50 to-purple-100 dark:from-violet-900/50 dark:to-purple-900 blur-3xl"}></div>
            <div className={"flex flex-col bg-white z-[1] dark:bg-base-300"}>
              <div>
                <div className={"app-banner-screenshot-preview w-ful h-[240px] px-4 rounded-lg lg:h-[360px] lg:px-2 z-[1]"}>
                  <img
                    src={screenshotPreviewImage}
                    alt={`screenshot preview`}
                    height={""}
                    className={"max-w-full w-full h-full object-contain object-center rounded-lg"} />
                </div>
              </div>
              <div className={"flex flex-row justify-center items-center"}>
                {
                  props?.screenshot.length > 0
                    ? props?.screenshot.map((image, index) => (
                      <>
                        <div key={index} className={"h-[24px] px-4 rounded-lg lg:h-[36px] lg:px-2 z-[1]"}>
                          <img src={image.image}
                            alt={`screenshot preview ${index}`} height={""}
                            className={"max-w-full w-full h-full object-contain object-center rounded-lg"}
                            onClick={() => setScreenshotPreviewImage(image.image)}
                          />
                        </div>
                        <div className={"absolute bottom-0 w-full bg-transparent"}></div>
                      </>
                    ))
                    : <div className={"relative flex flex-col justify-center items-center w-full leading-normal bg-lighter gradient:to_bottom-whitesmoke-lightgray color-lightgray font-64 font-bold text-center lg:items-start lg:h-[480px] lg:px-[400px] dark:gradient:to_bottom-111314-222425|color-darkgray dark:rounded-none"}>{props.name}</div>
                }
              </div>
            </div>
          </section>
        </section>
      }
      <section className={"w-full mx-auto lg:flex lg:flex-row lg:justify-between lg:items-start lg:w-full lg:px-8 dark:bg-inherit bg-orange-30"}>
        <section
          className="app-banner-container relative top-[280px] w-full max-w-full overflow-y-auto m-auto bg-white backdrop-blur-md rounded-2xl z-1 shadow:0px--20px-80px-20px-FFFFFF88 lg:top-[40px] lg:neg:top-80 lg:w-[56%] lg:mx-8 lg:ml-aut lg:bg-initial dark:shadow:0px--20px-80px-20px-11131488 dark:bg-base-300 dark:backdrop-blur-0">
          {/*<img src="" alt="" id="id-app-banner-image" className="app-banner-image"/>*/}
          {/*<section className="app-primary-details">
            <div id="id-app-name" className="app-name">{props.name}</div>
            <div id="id-app-description" className="app-description">{props.description}</div>
            <div id="id-app-category" className="app-category">
              {props.category.split(',').map((each_app_category) => {
                return (<span
                  className="d-inline-block pad-x2 h-4 lh-4 mg-x1-smt radius-round bg-light font-normal font-10">{each_app_category}</span>)
              })}
            </div>
          </section>*/}

          <section className={"space-y-3 rounded-xl dark:bg-base-300"}>
            {
              size.windowWidth < deviceWidthEnum.laptop &&
              <section className={"relative bg-gray-100 bg-lighter px-0 py-0 rounded-2xl lg:p-2 lg:rounded-2xl dark:bg-base-200 dark:lg:mb-2"}>
                {
                  /* For mobile, tablet and devices smaller than the laptop */
                  size.windowWidth < deviceWidthEnum.laptop
                    ? <div className="relative flex flex-row justify-start items-center pt-4 pb-0 px-2 font-bold text-4xl font-21 text-center rounded-xl bg-inherit z-2 dark:color-whitesmoke dark:every:bg-333334|color-whitesmoke">
                      {
                        props.logo
                          ? <img src={props.logo} alt={`${props.name} logo`}
                            className="block mx-4 my-4 w-16 h-16 bg-light rounded-full radius-circle object-cover object-center dark:bg-333334" />
                          : <div
                            className={"relative block mx-4 w-16 h-16 leading-[64px] square-8 lh-8 rounded-full radius-circle border-0 border-DDD border-solid bg-light text-center font-bold cursor-pointer hover:shadow:inset-0px-0px-16px-0px-DDD transition:box-shadow_200ms_ease dark:bg-333334"}>
                            {props?.name?.split('')[0].toUpperCase().toString()}
                          </div>
                      }
                      {props.name}
                    </div>
                    : null
                }
                {
                  /* For laptop and larger devices */
                  size.windowWidth >= deviceWidthEnum.laptop
                    ? <div
                      className="relative flex flex-row items-center pt-8 pb-0 px-6 font-bold text-8xl rounded-2xl bg-inherit every:d-block|mg-x2|mg-y2|w-108|h-108|lh-108|radius-circle|bg-light dark:color-whitesmoke dark:every:bg-333334|color-whitesmoke">
                      {
                        props.logo
                          ? <img src={props.logo} alt={`${props.name} logo`}
                            className="block w-24 h-24 rounded-full mx-4 my-4 object-cover object-center dark:bg-lighter" />
                          :
                          <div
                            className={"relative border-0 border-DDD border-solid text-center font-bold cursor-pointer hover:shadow:inset-0px-0px-16px-0px-DDD transition:box-shadow_200ms_ease dark:hover:shadow:inset-0px-0px-8px-0px-222425"}>
                            {props?.name?.split('')[0].toUpperCase().toString()}
                          </div>
                      }
                      {props.name}
                    </div>
                    : null
                }
                <div className="px-7 pt-2 pb-4 bg-inherit rounded-b-lg lg:font-14 lg:leading-10 lg:px-6 lg:py-5 lg:bg-inherit dark:color-whitesmoke">
                  {props.truncate_description ? truncateLetters(props.description, 0, 160) : props.description}
                </div>

                {
                  size.windowWidth >= deviceWidthEnum.laptop &&
                    props.owner.id === tokenData?.tokenData?.user_id
                    ? <Link to={`/app/${props.name_id}/update`}
                      className={"hidden btn btn-primary absolute top-10 right-8 h-5 lh-5 bg-green rounded-xl px-4 decoration-none color-white"}>
                      Edit
                      <span className={"fa fa-pen pl-2 color-white"}></span>
                    </Link>
                    : null
                }

                <div className="flex flex-row flex-nowrap px-6 py-4 bg-base-100 rounded-xl radius overflow-x-auto lg:px-4 lg:py-2 lg:bg-inherit dark:bg-inherit">
                  {
                    props.category && props.category.split(',').map((each_app_category, index) => {
                      return (
                        <span key={index}
                          className="inline-block px-4 h-10 leading-10 mx-1 rounded-lg border:1px_solid_DDD bg-base-300 font-normal font-11 lg:h-12 lg:leading-[48px] lg:border-0 lg:text-md dark:bg-111314BB|color-whitesmoke|border:1px_solid_222425">
                          {each_app_category}
                        </span>
                      )
                    })
                  }
                </div>
              </section>
            }

            {
              size.windowWidth < deviceWidthEnum.laptop &&
              <section className="app-download-details rounded-xl bg-base-100 pl-6 dark:bg-base-300 dark:p-0">
                {/*<header className={"font-medium"}>{"Download links".toUpperCase()}</header>*/}
                <section
                  className={"flex flex-row justify-start gap-x-4 pt-5 pb-5 empty:pad-0 rounded-lg overflow-x-auto every:w-auto|h-64|radius|text-center|radius-inherit|decoration-none|bg-lighter|color-initial|mg-x1|pad-r4 hover:every:bg-E8E8E8|cursor-pointer dark:bg-inherit|pad-x2 dark:every:bg-333435|color-whitesmoke dark:hover:every:bg-333435"}>
                  {
                    props.playstore_link !== ""
                      ? <ExternalLink
                        url={props.playstore_link}
                        // text={"Download from Play Store"}
                        classes={"flex-shrink-0 gap-4 w-auto h-16 rounded-2xl text-center decoration-none bg-base-200 mx-1 px-5 pr-8 hover:bg-base-300 dark:hover:bg-base-100 transition-colors"}
                      >
                        <Avatar
                          src={"/static/playstore.png"}
                          alt={"playstore logo"}
                          width={"0"}
                          classes={"w-8 rounded-none"}>
                        </Avatar>
                        <div className="leading-tight text-left">
                          <div className={"text-[15px]"}>Download from</div>
                          <div className={"font-semibold"}>{props.playstore_link ? "Google play store" : "-"}</div>
                        </div>
                        {/* {
                        size.windowWidth <= deviceWidthEnum.laptop
                          ? <span className={""}>Download</span>
                          : <span className={""}>Download from Play Store</span>
                      } */}
                      </ExternalLink>
                      : null
                  }
                  {
                    props.appstore_link !== ""
                      ? <ExternalLink
                        url={props.appstore_link}
                        id={"id-app-download-links"}
                        classes={"flex-shrink-0 gap-4 w-auto h-16 rounded-2xl text-center decoration-none bg-base-200 mx-1 px-5 pr-8 hover:bg-base-300 dark:hover:bg-base-100 transition-colors"}>
                        {/*<span className="fa-brands fa-app-store-ios d-block font-30 pad-t4 pad-b2"></span>*/}
                        <Avatar
                          src="/static/appstore.png"
                          alt={"appstore logo"}
                          width={"0"}
                          classes={"w-8 rounded-none"} />
                        {/* {
                        size.windowWidth <= deviceWidthEnum.laptop
                          ? "Download"
                          : "Download from AppStore"
                      } */}
                        <div className="leading-tight text-left">
                          <div className={"text-[15px]"}>Download from</div>
                          <div className={"font-semibold"}>{props.playstore_link ? "Apple AppStore" : "-"}</div>
                        </div>
                      </ExternalLink>
                      : null
                  }
                  {
                    props.external_link !== ""
                      ? <ExternalLink
                        url={props.external_link}
                        id="id-app-download-links"
                        classes={"flex-shrink-0 gap-4 w-auto h-16 rounded-2xl text-center decoration-none bg-base-200 mx-1 px-5 pr-8 hover:bg-base-300 dark:hover:bg-base-100 transition-colors"}>
                        {/*<span className="fa fa-download d-block font-30 pad-t4 pad-b2"></span>*/}
                        <Avatar
                          src={"/static/download.png"}
                          alt={"download logo"}
                          width={"32"}
                          classes={"w-8 rounded-none"} />
                        {
                          size.windowWidth <= deviceWidthEnum.laptop
                            ? "External Download"
                            : "External Download"
                        }
                      </ExternalLink>
                      : null
                  }
                  {/* {
                  props.playstore_link !== ""
                    ? <a href={props.playstore_link}
                      target={"_blank"}
                      rel={"noreferrer"}
                      id="id-app-download-links"
                      className={"flex flex-row items-center lg:font-13"}>
                      <span className="fa-brands fa-google-play d-block font-30 pad-t4 pad-b2"></span>
                      <img
                        src="/static/playstore.png"
                        alt={"playstore logo"}
                        width={"32"}
                        height={"32"}
                        className={"mx-2"} />
                      {"Play Store"}
                    </a>
                    : null
                }
                {
                  props.appstore_link !== ""
                    ? <a href={props.appstore_link}
                      target={"_blank"}
                      rel={"noreferrer"}
                      id="id-app-download-links"
                      className={"flex flex-row items-center lg:font-13"}>
                      <span className="fa-brands fa-app-store-ios d-block font-30 pad-t4 pad-b2"></span>
                      <img
                        src="/static/appstore.png"
                        alt={"appstore logo"}
                        width={"32"}
                        height={"32"}
                        className={"mx-2"} />
                      {"App Store"}
                    </a>
                    : null
                }
                {
                  props.external_link !== ""
                    ? <a href={props.external_link}
                      target={"_blank"}
                      rel={"noreferrer"}
                      id="id-app-download-links"
                      className={"flex flex-row items-center lg:font-13"}>
                      <span className="fa fa-download d-block font-30 pad-t4 pad-b2"></span>
                      <img
                        src="/static/download.png"
                        alt={"download logo"}
                        width={"32"}
                        height={"32"}
                        className={"mx-2"} />
                      {"Download"}
                    </a>
                    : null
                } */}
                </section>
                {
                  props.external_link
                    ? <div className={"px-4 pb-2 font-medium dark:color-whitesmoke"}>
                      {"** This app has an external download link."}
                    </div>
                    : null
                }
              </section>
            }

            <section className={"space-y-10 rounded-xl lg:bg-base-100 dark:bg-base-300"}>
              <section className={"space-y-8 p-8 bg-base-10 rounded-xl dark:bg-base-200"}>
                <header className={"font-semibold text-3xl"}>App Details</header>
                <section className={"space-y-8"}>
                  <div className={"space-y-2"}>
                    <div>Version: </div>
                    <kbd className="kbd kbd-lg font-semibold">1.0</kbd>
                  </div>
                  <div className={"space-y-2"}>
                    <div>Status:</div>
                    <span className="inline-flex items-center gap-x-1.5 py-1.5 px-3 rounded-full text-md font-medium bg-blue-100 text-blue-800 dark:bg-blue-800/30 dark:text-blue-500">
                      <span className="w-1.5 h-1.5 inline-block rounded-full bg-blue-800 dark:bg-blue-500"></span>
                      Active Development
                    </span>
                  </div>
                  <div className={"space-y-2"}>
                    <div>Phase:</div>
                    <span className="inline-flex items-center gap-x-1.5 py-1.5 px-3 rounded-full text-md font-medium bg-red-100 text-red-800 dark:bg-red-800/30 dark:text-red-500">
                      <span className="w-1.5 h-1.5 inline-block rounded-full bg-red-800 dark:bg-red-500"></span>
                      Beta
                    </span>
                  </div>
                  <div className="space-y-2 first:mt-0">
                    <div>Release date: </div>
                    <kbd className="kbd kbd-lg">
                      Dec 31, 2023
                    </kbd>
                  </div>
                  <div className={"space-y-2"}>
                    <span>Website: </span>
                    {
                      props.website
                      && <ExternalLink url={props.website} classes={"font-semibold text-xl hover:underline hover:decoration-2"}>{props.website} </ExternalLink>
                    }
                  </div>
                  {/* <div>
                  <span>Collaborators: </span>
                  <div>5 collaborators</div>
                </div> */}
                </section>
              </section>

              <section className={"space-y-2 p-8 rounded-xl dark:bg-base-200"}>
                <header className={"font-semibold text-3xl py-4"}>
                  Latest Features
                </header>
                {/* <span>Supports markdown</span> */}
                <div className={"px-4"}>
                  <ul className={"list-disc leading-10"}>
                    <li>You can now pin messages in groups for all current members.</li>
                    <li>You can now check your connection health during a video call by long pressing on your tile.</li>

                    <li>Added a 'view once' option to voice messages.</li>

                    <li>These features will roll out over the coming weeks.</li>
                  </ul>
                </div>
              </section>

              <section className={"app-download-details flex flex-col mg-t-2 p-8 bg-white-solid rounded-xl dark:bg-base-200"}>
                <header className={"radius text-3xl font-semibold py-4 lg:text-3xl lg:py-4 dark:color-whitesmoke"}>{"Download links"}</header>
                <section className={"flex flex-col gap-5 py-5 every:d-block|decoration-none|pad-x2|pad-y3"}>
                  <ExternalLink
                    url={props.playstore_link}
                    classes={"gap-6 w-auto h-16 rounded-2xl text-center decoration-none bg-base-200 px-5 pr-8 hover:bg-base-300 dark:bg-base-100 dark:hover:bg-base-300"}
                  >
                    <Avatar
                      src={"/static/playstore.png"}
                      alt={"playstore"}
                      width={"0"}
                      classes={"w-6 rounded-none"}>
                    </Avatar>
                    <span className={"pad-x1 lg:font-13 dark:color-whitesmoke"}>{props.playstore_link ? "Download from Google play store" : "-"}</span>
                  </ExternalLink>

                  <ExternalLink
                    url={props.appstore_link}
                    classes={"gap-6 w-auto h-16 rounded-2xl text-center decoration-none bg-base-200 px-5 pr-8 hover:bg-base-300 dark:bg-base-100 dark:hover:bg-base-300"}
                  >
                    <Avatar
                      src={"/static/appstore.png"}
                      alt={"appstore"}
                      width={"0"}
                      classes={"w-6 rounded-none"}>
                    </Avatar>
                    <span className={"pad-x1 lg:font-13 dark:color-whitesmoke"}>{props.appstore_link ? "Download from Apple AppStore" : "-"}</span>
                  </ExternalLink>

                  <ExternalLink
                    url={props.external_link}
                    classes={"gap-6 w-auto h-16 rounded-2xl text-center decoration-none bg-base-200 px-5 pr-8 hover:bg-base-300 dark:bg-base-100 dark:hover:bg-base-300"}
                  >
                    <Avatar
                      src={"/static/download.png"}
                      alt={"external"}
                      width={"0"}
                      classes={"w-6 rounded-none"}>
                    </Avatar>
                    <span className={"pad-x1 lg:font-13 dark:color-whitesmoke"}>{props.external_link ? "External Download" : "-"}</span>
                  </ExternalLink>
                  {/* <a href={props.playstore_link || void (0)} target={"_blank"} rel={"noreferrer"} id="id-app-download-links"
                  className={"color-initial radius dark:hover:bg-111314BB"}>
                  <span className="fab fa-google-play square-4 lh-4 pad-r1 color-999 lg:font-13"></span>
                  <span className={"pad-x1 lg:font-13 dark:color-whitesmoke"}>{props.playstore_link ? "Download from Google play store" : "-"}</span>
                </a>
                <a href={props.appstore_link || void (0)} target={"_blank"} rel={"noreferrer"} id="id-app-download-links"
                  className={"color-initial radius dark:hover:bg-111314BB"}>
                  <span className="fab fa-app-store-ios square-4 lh-4 pad-r1 color-999 lg:font-13"></span>
                  <span className={"pad-x1 lg:font-13 dark:color-whitesmoke"}>{props.appstore_link ? "Download from Apple AppStore" : "-"}</span>
                </a>
                <a href={props.external_link || void (0)} target={"_blank"} rel={"noreferrer"} id="id-app-download-links"
                  className={"color-initial radius dark:hover:bg-111314BB"}>
                  <span className="fa fa-link square-4 lh-4 pad-r1 color-999 lg:font-13"></span>
                  <span className={"pad-x1 lg:font-13 dark:color-whitesmoke"}>{props.external_link ? "External Download" : "-"}</span>
                </a> */}
                </section>
              </section>
            </section>
          </section>

          {
            size.windowWidth < deviceWidthEnum.laptop
              ? <section className={"app-owner-details flex flex-col space-y-4 mg-t-2 py-8 bg-white-solid every:pad-y1 dark:bg-222425"}>
                <Link to={props.owner.id === tokenData?.tokenData?.user_id ? "/profile" : `/user/${props.owner.id}`}
                  className={"radius px-8 py-4 font-14 font-semibold text-3xl decoration-none color-initial dark:color-whitesmoke"}>
                  {"Owner details"}
                  {/* <span className={"fa fa-angle-right absolute right-4 font-18"}></span> */}
                </Link>
                <section className={"px-4"}>
                  <OwnerContact />
                </section>
              </section>
              : null
          }

          {
            size.windowWidth < deviceWidthEnum.laptop
            && <section className={"app-download-details flex flex-col mt-4 py-8 bg-white dark:bg-222425"}>
              <header className={"radius text-3xl font-semibold px-8 py-4 lg:text-3xl lg:px-4 lg:py-4 dark:color-whitesmoke"}>{`More Apps by ${props.owner.firstname}`}</header>
              <section className={"flex flex-row gap-5 px-4 py-5 every:d-block|decoration-none|pad-x2|pad-y3 overflow-x-auto"}>
                {
                  userApps?.results?.length > 0
                    ? userApps?.results.filter(t => t.id !== props.id).map((eachUserApps, index) => {
                      return (
                        index < 5 ? <BasicGridAppBoxes key={eachUserApps.id} {...eachUserApps} /> : null
                      )
                    })
                    : <div className={"mg-x-auto mg-y1 pad-2 font-14 text-center color-gray"}>No apps yet</div>
                }
              </section>
            </section>
          }
        </section>
        {
          size.windowWidth >= deviceWidthEnum.laptop
            ? <section className={"app-owner-details relative top-[40px] flex flex-col justify-start items-start bg-gray-100/40 p-2 rounded-xl mx-auto px:top-400 w-[400px] max-w-[480px] pct:w-32 dark:bg-base-300"}>
              <section className={"space-y-4 w-[100%] pct:w-80 mr-auto px-4 py-8 rounded-xl radius2 shadow lg:shadow-none bg-base-100 every:pad-y1 dark:bg-base-200"}>
                <Link to={props.owner.id === tokenData?.tokenData?.user_id ? "/profile" : `/user/${props.owner.id}`}
                  className={"radius px-6 font-14 font-semibold text-2xl decoration-none color-initial dark:color-whitesmoke"}>
                  {"Owner details"}
                  {/*<span className={"fa fa-angle-right abs right-4 font-18"}></span>*/}
                </Link>
                <OwnerContact />
              </section>

              <section className={"app-download-details flex flex-col mt-12 pad-y4 bg-white-solid dark:bg-222425 dark:bg-base-300"}>
                <header className={"radius px-4 text-3xl font-semibold py-4 lg:text-2xl lg:py-4 dark:color-whitesmoke"}>{`Other apps from ${props.owner.firstname}`}</header>
                <section className={"flex flex-col gap-6 px-4 py-5 every:d-block|decoration-none|pad-x2|pad-y3 overflow-x-auto"}>
                  {
                    userApps?.results?.length > 0
                      ? userApps?.results.filter(t => t.id !== props.id).map((eachUserApps, index) => {
                        return (
                          index < 3 ? <SearchAppBoxes key={eachUserApps.id} imageSize={"16"} truncateDescription={true} charsLength={48} {...eachUserApps} /> : null
                        )
                      })
                      : <div className={"w-full mx-auto my-2 p-8 text-lg font-14 text-center rounded-xl bg-base-100 color-gray"}>No apps yet</div>
                  }
                </section>
              </section>
            </section>
            : null
        }
      </section>
    </section>
  )
}

/*const withRouter = WrappedComponent => props => {
  const params = useParams();
  // etc... other react-router-dom v6 hooks

  return (
    <WrappedComponent
      {...props}
      params={params}
      // etc...
    />
  );
};*/

// export function withRouter(Children) {
//   return (props) => {

//     const match = { params: useParams() }
//     const location = useLocation()
//     return <Children {...props} match={match} location={location} />
//   }
// }

// class AppDetail extends React.Component {
//   constructor(props) {
//     super(props)
//     this.state = {
//       appDetails: null,
//       networkError: false,
//       isAppsLoading: false,
//       responseDetails: ''
//     }
//   }

//   componentDidMount() {
//     const fetch_headers = {
//       method: 'GET',
//       headers: {
//         'Accept': 'application/json',
//         // 'Origin': '*',
//       },
//       modes: 'cors',  // options: cors, no-cors, same-origin
//       cache: 'default',   // options: default, no-store, reload, no-cache, force-cache, only-if-cached
//     }
//     fetch(`${process.env.REACT_APP_BASE_URL}/app/${this.props.match.params.id}/`, fetch_headers)
//       .then(response => {
//         if (response.status > 400) {
//           return this.setState({
//             responseDetails: 'Error fetching apps. Try again.'
//           })
//         }
//         console.log(response)
//         return response.json()
//       })
//       .then(data => {
//         console.log(data)
//         this.setState({
//           appDetails: data
//         })
//       }).catch(err => {
//         console.log('Error fetch latest apps: ' + err)
//         this.setState({
//           appDetails: null,
//           responseDetails: 'Error fetching Latest Apps.',
//           networkError: true,
//           isAppsLoading: false
//         })
//       })
//   }

//   componentWillUnmount() { }

//   render() {
//     console.log(this.props)
//     return (
//       <section id="id-app-details-fragment" className="app-details-container pct:h-100">
//         {/*<section id="id-app-details-navigation-container" className="modes-navigation-container">
//           <Link to="/" id="id-modes-navigation-close-trigger"
//                 className="fa fa-times fa-2x modes-navigation-close-trigger-right bg-green"
//                 onClick={new NEH().closeAppsDetailsTemplate}></Link>
//           <span className="modes-navigation-title">
//             <span className="fa fa-search fa-lg modes-navigation-icon"></span>
//             Search
//           </span>
//         </section>*/}
//         <section className="d-block pct:h-100 overflow-y-auto">
//           {/*<Link to="/" id="id-modes-navigation-close-trigger"
//                 className="fa fa-arrow-left font-18 d-block fixed top-1 left-2 z-100 square-8 lh-8 text-center radius-circle bg-light decoration-none color-initial"
//                 onClick={new NEH().closeAppsDetailsTemplate}></Link>*/}
//           {
//             this.state.appDetails !== null
//               ? <AppDetailsContent {...this.state.appDetails} />
//               : <div className={"loading-animation"}></div>
//           }
//         </section>
//         <Footer miniDetails={""} noFix={true} />
//       </section>
//     )
//   }
// }

// const AppDetailWithRouter = withRouter(AppDetail)
// export default withRouter(AppDetail)


function AppDetail() {
  const { app } = useLoaderData();
  const navigation = useNavigation();

  return (
    <section id="id-app-details-fragment" className={"app-details-container h-full"}>
      {/* <ErrorBoundary fallbackComponent={ErrorFallback}> */}
      <section className={"block h-full overflow-y-auto" + navigation.state === "idle" ? "opacity-40 next-page-animation" : ""}>
        {
          app?.data !== null && <AppDetailContent {...app?.data} />
          // : <div className={"loading-animation"}>ABC</div> || <NoPage />
        }
        {/* {
          navigation.state === "loading"
            ? <AppDetailLoading />
            : <AppDetailContent {...app?.appDetail} />
        } */}
      </section>
      {/* </ErrorBoundary> */}
      {/* <Footer miniDetails={""} noFix={true} /> */}
    </section>
  )
}

export default AppDetail;