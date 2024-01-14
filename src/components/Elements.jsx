import React, { forwardRef, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { StyleProcessor } from "../helpers/StyleProcessor";

export const GenerateStrongPasswordButton = ({ text, classes, onClick, children }) => {
    return (
        <Button
            className={`btn btn-sm btn-ghost rounded-lg dark:hover:bg-base-100 mt-1 ${classes}`}
            onClick={onClick}
        >
            {text || "Generate strong password?"}
            {children}
        </Button>
    )
}

export const RevealPasswordButton = ({ classes, onClick }) => {
    return (
        <button
            type={"button"}
            className={`fa fa-eye absolute right-1 size-14 leading-[56px] rounded-xl hover:bg-base-200 text-center cursor-pointer ${classes}`}
            onClick={onClick}
        >
        </button>
    )
}

export const LoadingButton = ({ children }) => {
    return (
        <>
            <span className="loading loading-spinner"></span>
            {children}
        </>
    )
}

export const AvatarRound = () => {
    return (
        <div className="avatar">
            <div className="w-24 rounded-full">
                <img src="https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg" />
            </div>
        </div>
    )
}

export const Avatar = ({ type, badge, width, src, alt, classes = "", children }) => {
    // width is tailwind's width classes.
    let defaultClasses;
    let badgeClassName;
    if (!width) width = 16
    switch (type) {
        case "rounded":
            defaultClasses = `w-${width} rounded-xl ${classes}`;
            break;
        case "ring":
            defaultClasses = `w-${width} rounded-full ring ring-primary ring-offset-base-100 ring-offset-2 ${classes}`;
            break;
        case "maskSquircle":
            defaultClasses = `w-${width} mask mask-squircle ${classes}`;
            break;
        case "maskHexagon":
            defaultClasses = `w-${width} mask mask-hexagon ${classes}`;
            break;
        case "maskTriangle":
            defaultClasses = `w-${width} mask mask-triangle ${classes}`;
            break;
        default:
            defaultClasses = `w-${width} rounded-full ${classes}`;
    }
    // console.log(classes);

    switch (badge) {
        case "offline":
            badgeClassName = "offline";
            break;
        case "online":
            badgeClassName = "online";
            break;
        default:
            badgeClassName = ""
    }

    return (
        <div className={`avatar ${badgeClassName} ${children && "placeholder"}`}>
            {
                children
                    ? <div className={`bg-neutral hover:bg-accent text-accent-content rounded-full ${defaultClasses}`}>
                        {children}
                    </div>
                    : <div className={`${defaultClasses} w-full`}>
                        <img src={src} alt={alt || ""} className="" />
                    </div>
            }
        </div>
    )
}

export const ButtonUpdateSubmit = (props) => {
    return <Button {...props} classes={"btn-wide block mx-auto"}></Button>
}

export const Button = forwardRef((props, ref) => {
    return (
        <button
            type={props.type || "button"}
            name={props.name || ""}
            value={props.value || ""}
            disabled={props.disabled}
            onChange={props.onChange}
            onClick={props.onClick}
            className={`btn btn-primary transition:outline_80ms_ease|width_800ms_ease disabled:bg-accent disabled:text-primary disabled:opacity-50 disabled:cursor-not-allowed dark:disabled:bg-primary dark:disabled:text-primary-content dark:disabled:opacity-25 ${props.classes}`}
            tabIndex={props.tabIndex}
            ref={ref}
            {...props}
        >
            {props.value}
            {props.children}
        </button>
    )
});

export const TextInput = forwardRef((props, ref) => {
    return (
        <input
            id={props.id}
            type={props.type || "text"}
            name={props.name}
            defaultValue={props?.defaultValue}
            placeholder={props?.placeholder}
            onChange={props.onChange}
            onFocus={props.onFocus}
            onBlur={props.onBlur}
            ref={ref}
            className={`${props.classes + " "}input w-full h-16 focus:outline-primary focus:border-transparent`}
            {...props}
        />
    )
});

export const PasswordInput = forwardRef((props, ref) => {
    // const inputPasswordField = useRef(null);

    const toggleShowPassword = (e) => {
        ref.current.getAttribute("type") === "password"
            ? ref.current.setAttribute("type", "text")
            : ref.current.setAttribute("type", "password")
        new StyleProcessor(e.target).toggleClass('fa-eye').toggleClass('fa-eye-slash')
    }

    return (
        <div className={"relative flex flex-row items-center"}>
            <TextInput {...props} ref={ref} />
            {props.passwordLength > 0 ? <RevealPasswordButton onClick={toggleShowPassword} /> : null}
        </div>
    )
});

export const TextArea = forwardRef((props, ref) => {
    return (
        <textarea
            id={props.id}
            name={props.name}
            defaultValue={props?.defaultValue}
            placeholder={props?.placeholder}
            onChange={props.onChange}
            onFocus={props.onFocus}
            onBlur={props.onBlur}
            ref={ref}
            className={`${props.classes + " "}textarea resize-none w-full h-28 py-4 focus:outline-primary focus:border-transparent`}
            {...props}
        />
    )
});

export function FormInput(props) {
    // const handleChange = (event) => {
    //   const name = event.target.name;
    //   const value = event.target.value;
    //   setSignupData(values => (
    //       {...values, [name]: value}
    //   ));
    // }

    return (
        <>
            {
                props.hideLabel
                    ? null
                    : <label htmlFor={props.id}
                        className="pad-x1 pad-y1 focus:sibling-appname:color-blue">{props.labelValue}</label>
            }
            <input
                id={props.id}
                type={props.type || "text"}
                name={props.name}
                placeholder={props.placeholder}
                onChange={props.onChange || null}
                onFocus={props.onFocus || null}
                onBlur={props.onBlur || null}
                ref={props.reff}
                className={`${props.className + " "}sibling-appname pct:w-100 h-8 lh-8 pad-x2 mg-y1 outline:1px_solid_transparent border:1px_solid_BBB outline-offset-2 focus:outline:2px_solid_gray transition:outline_80ms_ease radius-sm font-12`}
            />
            <span></span>
            {props.children}
        </>
    )
}

export const HeaderLink = ({ headerTitle, showArrow, linkUrl, classes, headerClasses }) => {
    return (
        <Link to={linkUrl} className={`flex flex-row items-center d-inline-block v-align-middle w-full pct:w-100 decoration-none color-initial dark:color-whitesmoke ${classes}`}>
            <header className={`inline-block w-[80%] h-16 leading-[64px] pct:w-80 font-semibold px-4 lg:text-xl lg:leading-[64px] lg:font-18 ${headerClasses}`}>{headerTitle}</header>
            {
                showArrow
                    ? <div className={"inline-block w-[20%] pct:w-20 text-right"}>
                        <span
                            className={"fa fa-angle-right w-16 h-16 leading-[64px] square-8 lh-8 color-initial text-center decoration-none dark:color-whitesmoke"}></span>
                    </div>
                    : null
            }
        </Link>
    )
}

export const PageHeaderLink = ({ headerTitle, showArrow, linkUrl, fixTop, noFix, children }) => {
    const navigate = useNavigate();

    let relativeType = "sticky";
    if (fixTop) {
        relativeType = "fixed";
    } else if (noFix) {
        relativeType = "relative";
    }
    return (
        <div
            className={`${relativeType} top-0 left-0 flex flex-row justify-start items-center w-full pct:w-100 h-20 bg-white bg-mica z-10 dark:bg-base-200`}>
            {
                showArrow !== false
                    ? (
                        linkUrl === undefined || linkUrl === ""
                            ? <button type={"button"}
                                className="block w-16 h-16 square-8 lh-9 border-0 bg-initial color-initial text-center z-10 decoration-none dark:color-whitesmoke"
                                // onClick={() => window.history.back()}
                                onClick={() => navigate(-1)}
                            >
                                <span className="fa fa-angle-left text-xl font-18 color-999"></span>
                            </button>
                            : <Link to={linkUrl}
                                className="block w-16 h-16 square-8 lh-9 border-0 bg-initial color-initial text-center z-10 decoration-none dark:color-whitesmoke">
                                <span className="fa fa-angle-left text-xl font-18 color-999"></span>
                            </Link>
                    )
                    : null
            }
            <header
                className={"block w-full pct:w-100 h-20 leading-[80px] px-4 font-18 font-bold text-left color-444A44 dark:color-whitesmoke"}>
                {headerTitle}
            </header>
            {children}
        </div>
    );
}

export const NotifTemplate = ({ title = "Successful", noTitle = false, message, type, children }) => {
    let bColor;
    let icon;
    switch (type.toLowerCase()) {
        case "success":
            bColor = "emerald";
            icon = <svg className="flex-shrink-0 w-4 h-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" /><path d="m9 12 2 2 4-4" /></svg>;
            break;
        case "error":
            bColor = "red";
            icon = <svg class="flex-shrink-0 w-4 h-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
            // icon = <svg class="flex-shrink-0 h-4 w-4 mt-0.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg>
            break;
        case "warning":
            bColor = "yellow";
            icon = <svg class="flex-shrink-0 h-4 w-4 mt-0.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" /><path d="M12 9v4" /><path d="M12 17h.01" /></svg>
            break;
        case "info":
            bColor = "blue";
            icon = <svg class="flex-shrink-0 h-4 w-4 text-blue-600 mt-1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M12 16v-4" /><path d="M12 8h.01" /></svg>
            break;
        default:
            bColor = "gray"
            icon = <svg class="flex-shrink-0 h-4 w-4 mt-0.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M12 16v-4" /><path d="M12 8h.01" /></svg>
    }
    return (
        // <div
        //     className="relative mx-auto text-center w-[64%] px-2 py-2 rounded-xl radius-md bg-success/25 text-success">
        //     <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        //     {message}
        //     {children}
        // </div>
        <div className={`w-[80%] mx-auto bg-${bColor}-50 border-2 dark:border-0 dark:border-t-2 border-${bColor}-500 rounded-xl my-4 p-4 dark:bg-${bColor}-800/30`} role="alert">
            <div className={`flex ${noTitle || !title ? "items-center" : "items-start"}`}>
                <div className="flex-shrink-0">
                    <span className={`inline-flex justify-center items-center w-8 h-8 rounded-full border-4 border-${bColor}-100 bg-${bColor}-200 text-${bColor}-800 dark:border-${bColor}-900 dark:bg-${bColor}-800 dark:text-${bColor}-400`}>
                        {icon}
                    </span>
                </div>
                <div className="ms-3">
                    {
                        !noTitle
                        && <h3 className="text-gray-800 font-semibold dark:text-white">
                            {title}
                        </h3>
                    }
                    <div className="text-sm text-gray-700 dark:text-gray-400">
                        {message}
                        {children}
                    </div>
                </div>
            </div>
        </div>
    )
}

export const NotifSuccess = ({ title = "Successful", noTitle = false, message, children }) => {
    return (
        // <div
        //     className="relative mx-auto text-center w-[64%] px-2 py-2 rounded-xl radius-md bg-success/25 text-success">
        //     <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        //     {message}
        //     {children}
        // </div>
        <div className="w-[80%] mx-auto bg-emerald-50 border-2 dark:border-0 dark:border-t-2 border-emerald-500 rounded-xl my-4 p-4 dark:bg-emerald-800/30" role="alert">
            <div className={`flex ${noTitle || !title ? "items-center" : "items-start"}`}>
                <div className="flex-shrink-0">
                    <span className="inline-flex justify-center items-center w-8 h-8 rounded-full border-4 border-emerald-100 bg-emerald-200 text-emerald-800 dark:border-emerald-900 dark:bg-emerald-800 dark:text-emerald-400">
                        <svg className="flex-shrink-0 w-4 h-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" /><path d="m9 12 2 2 4-4" /></svg>
                    </span>
                </div>
                <div className="ms-3">
                    {
                        !noTitle
                        && <h3 className="text-gray-800 font-semibold dark:text-white">
                            {title}
                        </h3>
                    }
                    <div className="text-sm text-gray-700 dark:text-gray-400">
                        {message}
                        {children}
                    </div>
                </div>
            </div>
        </div>
    )
}

export const NotifError = ({ title = "Error", noTitle = false, message, children }) => {
    return (
        // <div
        //     className="relative mx-auto text-center w-[64%] px-2 py-2 rounded-md bg-error/25 text-error">
        //     {message}
        //     {children}
        // </div>
        <div className="w-[80%] mx-auto bg-red-50 border-2 dark:border-0 dark:border-t-2 border-red-500 rounded-xl my-4 p-4 dark:bg-red-800/30" role="alert">
            <div className={`flex ${noTitle || !title ? "items-center" : "items-start"}`}>
                <div className="flex-shrink-0">
                    <span className="inline-flex justify-center items-center w-8 h-8 rounded-full border-4 border-red-100 bg-red-200 text-red-800 dark:border-red-900 dark:bg-red-800 dark:text-red-400">
                        <svg class="flex-shrink-0 w-4 h-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                    </span>
                </div>
                <div className="ms-3">
                    {
                        !noTitle
                        && <h3 className="text-gray-800 font-semibold dark:text-white">
                            {title}
                        </h3>
                    }
                    <div className="text-sm text-gray-700 dark:text-gray-400">
                        {message}
                        {children}
                    </div>
                </div>
            </div>
        </div>
    )
}

export const NotifWarning = ({ title = "Warning", noTitle = false, message, children }) => {
    return (
        <div className="w-[80%] mx-auto bg-yellow-50 border-2 dark:border-0 dark:border-t-2 border-yellow-500 rounded-xl my-4 p-4 dark:bg-yellow-800/30" role="alert">
            <div className={`flex ${noTitle || !title ? "items-center" : "items-start"}`}>
                <div className="flex-shrink-0">
                    <span className="inline-flex justify-center items-center w-8 h-8 rounded-full border-4 border-yellow-100 bg-yellow-200 text-yellow-800 dark:border-yellow-900 dark:bg-yellow-800 dark:text-yellow-400">
                        <svg class="flex-shrink-0 h-4 w-4 mt-0.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" /><path d="M12 9v4" /><path d="M12 17h.01" /></svg>
                    </span>
                </div>
                <div className="ms-3">
                    {
                        !noTitle
                        && <h3 className="text-gray-800 font-semibold dark:text-white">
                            {title}
                        </h3>
                    }
                    <div className="text-sm text-gray-700 dark:text-gray-400">
                        {message}
                        {children}
                    </div>
                </div>
            </div>
        </div>
    )
}

export const NotifInfo = ({ title = "Info", noTitle = false, message, children }) => {
    return (
        <div className="w-[80%] mx-auto bg-blue-50 border-2 dark:border-0 dark:border-t-2 border-blue-500 rounded-xl my-4 p-4 dark:bg-blue-800/30" role="alert">
            <div className={`flex ${noTitle || !title ? "items-center" : "items-start"}`}>
                <div className="flex-shrink-0">
                    <span className="inline-flex justify-center items-center w-8 h-8 rounded-full border-4 border-blue-100 bg-blue-200 text-blue-800 dark:border-blue-900 dark:bg-blue-800 dark:text-blue-400">
                        <svg class="flex-shrink-0 h-4 w-4 text-blue-600 mt-1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M12 16v-4" /><path d="M12 8h.01" /></svg>
                    </span>
                </div>
                <div className="ms-3">
                    {
                        !noTitle
                        && <h3 className="text-gray-800 font-semibold dark:text-white">
                            {title}
                        </h3>
                    }
                    <div className="text-sm text-gray-700 dark:text-gray-400">
                        {message}
                        {children}
                    </div>
                </div>
            </div>
        </div>
    )
}

export const NotifDefault = ({ title = "Notice", noTitle = false, message, children }) => {
    return (
        <div className="w-[80%] mx-auto bg-red-50 border-2 dark:border-0 dark:border-t-2 border-red-500 rounded-xl my-4 p-4 dark:bg-red-800/30" role="alert">
            <div className={`flex ${noTitle || !title ? "items-center" : "items-start"}`}>
                <div className="flex-shrink-0">
                    <span className="inline-flex justify-center items-center w-8 h-8 rounded-full border-4 border-red-100 bg-red-200 text-red-800 dark:border-red-900 dark:bg-red-800 dark:text-red-400">
                        <svg class="flex-shrink-0 h-4 w-4 mt-0.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M12 16v-4" /><path d="M12 8h.01" /></svg>
                    </span>
                </div>
                <div className="ms-3">
                    {
                        !noTitle
                        && <h3 className="text-gray-800 font-semibold dark:text-white">
                            {title}
                        </h3>
                    }
                    <div className="text-sm text-gray-700 dark:text-gray-400">
                        {message}
                        {children}
                    </div>
                </div>
            </div>
        </div>
    )
}

export const TemporaryNotif = ({ time, classes, children }) => {
    const [hideChild, setHideChild] = useState(false);
    let timeout;

    useEffect(() => {
        return () => clearTimeout(timeout);
    }, [hideChild]);

    if (time < 1) return <></>;
    timeout = setTimeout(() => { console.log('timeout', time); setHideChild(true) }, time);

    return <section className={`${classes}`}>{!hideChild && children}</section>
}

export const PageLoader = () => {
    return (
        <div className={"next-page-animation"}></div>
    );
}

/* Copied from https://stackoverflow.com/posts/43020177/revisions */
function randPassword(letters, numbers, either) {
    var chars = [
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz", // letters
        "0123456789", // numbers
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789" // either
    ];

    function randInt(this_max) { // return int between 0 and this_max - 1
        let umax = Math.pow(2, 32);
        let max = umax - (umax % this_max);
        let r = new Uint32Array(1);
        do {
            crypto.getRandomValues(r);
        } while (r[0] > max);
        return r[0] % this_max;
    }

    function randCharFrom(chars) {
        return chars[randInt(chars.length)];
    }

    function shuffle(arr) { // https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle#The_modern_algorithm
        for (let i = 0, n = arr.length; i < n - 2; i++) {
            let j = randInt(n - i);
            [arr[j], arr[i]] = [arr[i], arr[j]];
        }
        return arr;
    }

    return shuffle([letters, numbers, either].map(function (len, i) {
        return Array(len).fill(chars[i]).map(x => randCharFrom(x)).join('');
    }).concat().join('').split('')).join('')
}