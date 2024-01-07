import { Link } from "react-router-dom";

export const PasswordUpdateSuccessfulTemplate = ({ classes, type, children }) => {
    return (
        <div className={`${classes}`}>
            <div className={"text-3xl font-28 py-12"}>Your new password has been successfully <b>{type || "set"}</b>.</div>
            {/* <Link to={"/"} className={"font-medium font-16 pad-y2 color-initial"}>Click here to go the homepage.</Link>
            OR */}
            <Link to={"/login"} className={"btn btn-primary font-medium text-lg font-16 pad-y2 color-initial"}>Login with your new password. <div className={"badge badge-ghost"}>Recommended</div></Link>
            {children}
        </div>
    )
}

const SetPasswordSuccessful = () => {
    return (
        <section className={"card flex flex-col flex-nowrap justify-center items-center w-full h-dvh md:w-[560px] lg:w-[480px] pct:w-80 pct:h-100 lh-normal mx-auto text-center lg:pct:w-40"}>
            <PasswordUpdateSuccessfulTemplate />
        </section>
    )
}

export default SetPasswordSuccessful;