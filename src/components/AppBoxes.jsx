import { Link } from "react-router-dom";
import React from "react";
import { deviceWidthEnum, truncateLetters } from "../helpers/utils";
import { useWindowSize } from "@uidotdev/usehooks";
import useTokenData from "../hooks/useTokenData";
import { Avatar } from "./Elements";

export const SearchAppBoxes = (props) => {
    const { rawToken, isLoggedIn, tokenData } = useTokenData();
    const size = useWindowSize();

    return (
        <section
            key={props.name}
            className="relative w-full rounded-3xl hover:bg-base-200 transition-colors p-4 hover:cursor-pointer border:0px_solid_BBB dark:bg-222425|color-whitesmoke|pad-2 dark:radius-unset dark:lg:bg-111314">
            <Link to={`/app/${props.name_id}`} state={{ appName: props.name, appNameId: props.name_id }}
                className="relative flex flex-row justify-start items-center gap-4 w-full decoration-none color-initial font-16">
                {/* {
                    props.logo
                        ? <img
                            src={props.logo}
                            alt={props.name[0]}
                            aria-details={`${props.name} logo`}
                            width={"64"}
                            height={"64"}
                            className={`avatar min-w-[64px] max-w-[64px] h-[64px] leading-[4rem] bg-base-100 rounded-full object-cover object-center text-center`} />
                        : <div className="min-w-[64px] max-w-[64px] h-[64px] leading-[4rem] font-16 font-bold bg-lighter color-gray rounded-full object-cover object-center text-center dark:bg-111314BB dark:color-darkgray">
                            {props.name[0]}
                        </div>
                } */}
                <Avatar
                    src={props.logo}
                    alt={props.name[0]}
                    aria-details={`${props.name} logo`}
                    width={props.imageSize}
                    classes={""}
                >
                    {
                        !props.logo
                        && <div className="font-16 font-bold bg-lighter color-gray rounded-full object-cover object-center text-center dark:bg-111314BB dark:color-darkgray">
                            {props.name[0]}
                        </div>
                    }
                </Avatar>
                <section className={"dark:color-whitesmoke"}>
                    <div className="pad-l2 font-bold dark:color-darkgray">{props.name}</div>
                    {
                        size.width < deviceWidthEnum.laptop
                            ? <div
                                className="pad-l2">{props.truncateDescription ? truncateLetters(props.description, 0, props.charsLength || 80) : props.description}</div>
                            : <div
                                className="pad-l2">{props.truncateDescription ? truncateLetters(props.description, 0, props.charsLength || 160) : props.description}</div>
                    }
                    {/*<div className="d-block pad-y-3 pad-x1 bg-lighter white-space-nowrap overflow-x-hidden">
                        {props.category.split(',').map((each_app_category, index) => {
                            return (
                                <span key={index}
                                      className="d-inline-block pad-x2 h-4 lh-4 mg-x1-smt mg-y1-smt radius-round border:1px_solid_BBB bg-lighter font-normal font-11">
                        {each_app_category}
                    </span>
                            )
                        })}
                    </div>*/}
                    {/*<Link to={props.owner.id === tokenData?.user_id ? "/profile" : `/user/${props.owner.id}`}*/}
                    {/*      className="flex flex-row justify-start align-items-center pad-x1 mg-x2 border:0px_solid_lightgray em:border-t-0.05 decoration-none color-initial">*/}
                    {/*    /!*<img src={props.owner.dp} alt="" width={"24px"} height={"24px"} className="square-3 lh-3 radius-circle bg-lighter"/>*!/*/}
                    {/*    <div className="pad-x1 font-medium">{props.owner.firstname} {props.owner.lastname}</div>*/}
                    {/*</Link>*/}
                </section>
            </Link>
            {props.children}
        </section>
    )
}

export const BasicGridAppBoxes = (props) => {
    const { rawToken, isLoggedIn, tokenData } = useTokenData();
    return (
        <section
            key={props.name}
            className="relative radius rounded-lg mx-1 p-2 bg-base-100 hover:bg-base-200 dark:bg-base-200 dark:hover:bg-base-100 border:0px_solid_BBB hover:bg-light|cursor-pointer lg:w-unset dark:bg-222324 dark:lg:bg-transparent dark:lg:hover:bg-333435">
            <Link to={`/app/${props.name_id}`} state={{ appName: props.name, appNameId: props.name_id }}
                className="relative flex flex-col justify-start items-start gap-2 w-full pct:w-100 decoration-none color-initial font-16 dark:color-whitesmoke">
                <img
                    src={props.logo}
                    alt={`${props.name} logo`}
                    width={"160"}
                    height={"240"}
                    className="align-self-center min-w-[160px] max-w-[160px] h-[240px] bg-lighter rounded-lg radius object-cover object-center lg:min-w-[240px] lg:max-w-[240px] lg:min-w-240|max-w-240 dark:bg-222425" />
                <section className={"py-2"}>
                    <div className={"pl-1 font-bold"}>{props.name}</div>
                    {/*<div className={"pad-l1 font-11"}><span className="fa fa-click"></span>{"14 clicks"}</div>*/}
                    {/*<div className="pad-l2">{props.truncateDescription ? truncateLetters(props.description, 0, 80) : props.description}</div>*/}
                    {/*<div className="d-block pad-y-3 pad-x1 bg-lighter white-space-nowrap overflow-x-hidden">
                        {props.category.split(',').map((each_app_category, index) => {
                            return (
                                <span key={index}
                                      className="d-inline-block pad-x2 h-4 lh-4 mg-x1-smt mg-y1-smt radius-round border:1px_solid_BBB bg-lighter font-normal font-11">
                        {each_app_category}
                    </span>
                            )
                        })}
                    </div>*/}
                    {/*<Link to={props.owner.id === tokenData?.user_id ? "/profile" : `/user/${props.owner.id}`}*/}
                    {/*      className="flex flex-row justify-start align-items-center pad-x1 mg-x2 border:0px_solid_lightgray em:border-t-0.05 decoration-none color-initial">*/}
                    {/*    /!*<img src={props.owner.dp} alt="" width={"24px"} height={"24px"} className="square-3 lh-3 radius-circle bg-lighter"/>*!/*/}
                    {/*    <div className="pad-x1 font-medium">{props.owner.firstname} {props.owner.lastname}</div>*/}
                    {/*</Link>*/}
                </section>
            </Link>
            {props.children}
        </section>
    )
}

export const GridAppBoxes = (props) => {
    const { rawToken, isLoggedIn, tokenData } = useTokenData();
    return (
        <section
            key={props.name}
            className="relative pct:w-100 radius hover:cursor-pointer border:0px_solid_BBB">
            <Link to={`/app/${props.name_id}`} state={{ appName: props.name, appNameId: props.name_id }}
                className="relative flex flex-column justify-start align-items-center pct:w-100 decoration-none color-initial font-16">
                <img
                    src={props.logo}
                    alt={`${props.name} logo`}
                    width={"160"}
                    height={"160"}
                    className="min-w-160 max-w-160 h-160 bg-navajowhite radius object-cover object-center" />
                <section className={""}>
                    <div className="pad-l2 font-bold">{props.name}</div>
                    <div
                        className="pad-l2">{props.truncateDescription ? truncateLetters(props.description, 0, 80) : props.description}</div>
                    {/*<div className="d-block pad-y-3 pad-x1 bg-lighter white-space-nowrap overflow-x-hidden">
                        {props.category.split(',').map((each_app_category, index) => {
                            return (
                                <span key={index}
                                      className="d-inline-block pad-x2 h-4 lh-4 mg-x1-smt mg-y1-smt radius-round border:1px_solid_BBB bg-lighter font-normal font-11">
                        {each_app_category}
                    </span>
                            )
                        })}
                    </div>*/}
                    {/*<Link to={props.owner.id === tokenData?.user_id ? "/profile" : `/user/${props.owner.id}`}*/}
                    {/*      className="flex flex-row justify-start align-items-center pad-x1 mg-x2 border:0px_solid_lightgray em:border-t-0.05 decoration-none color-initial">*/}
                    {/*    /!*<img src={props.owner.dp} alt="" width={"24px"} height={"24px"} className="square-3 lh-3 radius-circle bg-lighter"/>*!/*/}
                    {/*    <div className="pad-x1 font-medium">{props.owner.firstname} {props.owner.lastname}</div>*/}
                    {/*</Link>*/}
                </section>
            </Link>
            {props.children}
        </section>
    )
}

export function AppBoxes(props) {
    const tokenData = useTokenData();
    return (
        <section key={props.name}
            // className="relative flex flex-column justify-center align-items-center lg:pct:w-16 pct:min-w-56 pct:max-w-16 sm:pct:max-w-56 text-center radius-sm shadow hover:shadow3 hover:cursor-pointer pad-top4 mg-x2 mg-y2">
            //        className="relative flex flex-column justify-center align-items-center vh:h-36 pct:w-45 max-w-320 mg-y4 gradient:to_bottom_right-#EEE-whitesmoke radius2 shadow:0px-0px-1px-2px-C8EAD1 text-center hover:cursor-pointer font-14"
            //        className="relative pct:w-100 gradient:to_bottom_right-lightgray-whitesmoke radius shadow:0px-0px-1px-2px-C8EAD1 hover:cursor-pointer font-14"
            className={"relative space-y-4 w-full m:w-[82%] p-2 rounded-xl hover:cursor-pointer mb-4 lg:border-0 border:0px_solid_BBB bg-base-100 lg:hover:bg-base-200 dark:bg-base-200 dark:lg:hover:bg-base-100 transition-colors"}
        >
            <Link to={`/app/${props.name_id}`} state={{ appName: props.name, appNameId: props.name_id }}
                className="relative flex flex-col justify-center gap-y-4 w-[full] decoration-none color-initial text-base font-14 dark:color-whitesmoke">
                {/*<div className="square-12 radius-circle bg-light mg-t3"></div>*/}
                <div className={"relative w-full h-[200px] bg-light gradient:to_top_right-lightgray-whitesmoke radius dark:gradient:to_top_right-111314-222425"}>
                    <img src={props.logo} alt={`${props.name} logo`}
                        className="w-full h-[200px] outline:0px_solid_lightgray outline-offset-2 bg-light gradient:to_top_right-lightgray-whitesmoke rounded-[0.65rem] object-cover lg:object-[unset] object-center shadow:0px--2px-8px-2px-FFFFFF88 dark:gradient:to_top_right-111314-222425|shadow-unset" />
                    {
                        props.screenshot?.length > 0
                            ? <span
                                className={"absolute left-2 bottom-2 text-sm font-10 h-6 leading-6 px-2 bg-base-100/40 dark:bg-base-300/60 text color-whitesmoke text-center rounded-badge"}>
                                {props.screenshot?.length}
                                {
                                    props.screenshot?.length > 1
                                        ? <span className={"fa fa-images text-sm font-10 pl-2"}></span>
                                        : <span className={"fa fa-image text-sm font-10 pl-2"}></span>
                                }
                            </span>
                            : null
                    }
                </div>
                <div className={"px-2"}>
                    <span className="font-semibold text-lg font-16">{props.name}</span>
                </div>
                <div className="px-2 text-[15px]">{props.truncate_description ? truncateLetters(props.description, 0, 80) : props.description}</div>
                {/*<div className="pad-t2 text-center font-semibold">{props.playstore_link}</div>*/}
                {/* <div className="w-[96%] mx-auto rounded space-x-1">
                    {props.category && props.category.split(',').map((each_app_category, index) => {
                        return (
                            each_app_category !== "" && <span key={index}
                                className="inline-block px-2 h-8 leading-8 rounded-md bg-base-300 font-normal text-sm">
                                {each_app_category}
                            </span>
                        )
                    })}
                </div> */}
            </Link>
            {
                props.hideUser !== true
                    ? <Link to={props.owner?.id === tokenData?.tokenData?.user_id ? "/profile" : `/user/${props.owner?.id}/`}
                        className={"flex flex-row justify-start items-center gap-1 px-4 py-1 decoration-none color-initial dark:color-whitesmoke"}>
                        <Avatar
                            src={props.owner?.dp}
                            width={"8"}
                        >
                            <span></span>
                        </Avatar>
                        <img src={props.owner?.dp} alt="" className="square-3 lh-3 radius-circle bg-lighter dark:bg-222324" />
                        <div className="pad-x1 font-12 font-normal">{props.owner?.firstname} {props.owner?.lastname}</div>
                    </Link>
                    : null
            }
            {props.children}
        </section>
    )
}

export function AppBoxesDetail(props) {
    // const { rawToken, isLoggedIn, tokenData } = useTokenData();
    return (
        <section key={props.name}
            // className="relative flex flex-column justify-center align-items-center lg:pct:w-16 pct:min-w-56 pct:max-w-16 sm:pct:max-w-56 text-center radius-sm shadow hover:shadow3 hover:cursor-pointer pad-top4 mg-x2 mg-y2">
            //        className="relative flex flex-column justify-center align-items-center vh:h-36 pct:w-45 max-w-320 mg-y4 gradient:to_bottom_right-#EEE-whitesmoke radius2 shadow:0px-0px-1px-2px-C8EAD1 text-center hover:cursor-pointer font-14"
            //        className="relative pct:w-100 gradient:to_bottom_right-lightgray-whitesmoke radius shadow:0px-0px-1px-2px-C8EAD1 hover:cursor-pointer font-14"
            className="relative pct:w-100 radius hover:cursor-pointer">
            <section
                className="relative flex flex-column justify-center pct:w-100 decoration-none color-initial font-14">
                {/*<div className="square-12 radius-circle bg-light mg-t3"></div>*/}
                {/*<img src={props.logo} alt={`${props.name} logo`} className="h-280 pct:w-100 bg-light gradient:to_top_right-lightgray-whitesmoke radius-top-left radius-top-right object-cover object-center" />*/}
                <section
                    className={"sticky top-0 flex flex-row flex-nowrap justify-start pad-x1 z-0 bg-green every:bg-lighter|radius-sm"}>
                    {
                        props.screenshot.map((image, index) => (
                            <div className={"pad-x-2 radius-inherit"}>
                                <img key={index} src={image.image}
                                    alt={`screenshot preview ${index}`} height={"100%"}
                                    className={"pct:max-w-100 object-cover object-center radius-inherit"} />
                            </div>
                        ))
                    }
                </section>
                <div className="align-self-center relative pad-t4 pad-b2 pad-x3 font-semibold font-21 text-center z-1">
                    <img src={props.logo} alt={`${props.name} logo`} className="d-block h-80 bg-light radius2 object-cover object-center" />
                    {props.name}
                </div>
                <div className="pad-x3 pad-y1 mg-b1">{props.truncate_description ? truncateLetters(props.description, 0, 160) : props.description}</div>
                {/*<div className="pad-t2 text-center font-semibold">{props.playstore_link}</div>*/}
                {/*<div className="pad-y3 pad-x1 bg-lighter">
          {props.category.split(',').map((each_app_category, index) => {
            return (
                <span key={index}
                      className="d-inline-block pad-x2 h-4 lh-4 mg-x1-smt mg-y1-smt radius-round border:1px_solid_BBB bg-lighter font-normal font-12">
                    {each_app_category}
                </span>
            )
          })}
        </div>*/}
            </section>
            {/*<Link to={props.owner.id === tokenData?.user_id ? "/profile" : `/user/${props.owner.id}`} className="flex flex-row justify-start align-items-center pad-x2 pad-y2 border:0px_solid_lightgray em:border-t-0.05 decoration-none color-initial">
        <img src="" alt="" className="square-4 lh-4 radius-circle bg-lighter"/>
        <div className="pad-x1 font-medium">{props.owner.firstname} {props.owner.lastname}</div>
      </Link>*/}
            {props.children}
        </section>
    )
}