import { Link } from "react-router-dom";

const SetPasswordSuccessful = () => {
    return (
        <section className={"flex flex-column flex-nowrap justify-center align-items-center pct:w-80 pct:h-100 lh-normal mg-x-auto text-center lg:pct:w-40"}>
            <div className={"font-28 pad-y6"}>Your new password has been successfully <b>set</b>.</div>
            <Link to={"/"} className={"font-medium font-16 pad-y2 color-initial"}>Click here to go the homepage.</Link>
            OR
            <Link to={"/login"} className={"font-medium font-16 pad-y2 color-initial"}>Login with your new password. (Recommended)</Link>
        </section>
    )
}

export default SetPasswordSuccessful;