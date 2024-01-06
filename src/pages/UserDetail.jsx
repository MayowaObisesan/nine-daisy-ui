import React, { useContext } from "react";
import { Link, useLoaderData, useNavigate, useParams } from "react-router-dom";
import useUserData from "../hooks/useUserData";
import { tokenState, UserContext } from "./Home";
// import { useRecoilValue } from "recoil";
// import { useAtomValue } from "jotai";
import useFetch from "../hooks/useFetch";
import { NotDefined } from "../helpers/utils";
import { UserPageComponent } from "./Profile";
import { getUser } from "./loaders/appLoaders";

export async function loader({ params }) {
    const user = await getUser(params.id);
    return { user };
}

const UserDetail = () => {
    const { user } = useLoaderData();
    // const {rawToken, isLoggedIn, tokenData} = useTokenData();
    // const {rawToken, isLoggedIn, tokenData} = useRecoilValue(tokenState);
    // const { rawToken, isLoggedIn, tokenData } = useAtomValue(tokenState);
    // const { userDataResults, isError, isLoading, responseDetails } = useUserData();
    // const navigate = useNavigate();
    // const user = useContext(UserContext);
    // const { id } = useParams();
    // const [data] = useFetch(`${process.env.REACT_APP_BASE_URL}/user/${id}/`);

    return (
        <UserPageComponent userId={user.userData?.id} userData={user.userData} />
        /*<section className={"profile-container"}>
            <Link to="/" className="fixed top-4 left-4 square-4 lh-4 lg:top-4|left-4|square-8|lh-8 color-initial text-center font-14 radius-circle bg-light z-10"><span className="fa fa-arrow-left"></span></Link>
            {/!*UserDetail Page*!/}
            <div className={"relative flex flex-column justify-center align-items-center flex-basis flex-grow pad-t8 pad-b4"}>
                {
                    isLoggedIn
                    ? <div
                        className={"sibling-user relative square-12 lh-12 radius-circle bg-lighter border-0 border-DDD border-solid bg-green-inverse text-center font-bold cursor-pointer hover:shadow:inset-0px-0px-16px-0px-DDD transition:box-shadow_200ms_ease"}>
                        {data?.firstname?.split('')[0].toUpperCase() + data?.lastname?.split('')[0].toUpperCase()}
                    </div>
                    : <img alt=""
                           className="sibling-user relative square-12 lh-12 radius-circle bg-lighter border-0 border-DDD border-solid bg-green-inverse cursor-pointer hover:shadow:inset-0px-0px-16px-0px-DDD transition:box-shadow_200ms_ease"
                           src={""}
                    />
                }
                <div className={"font-24 pad-t2 pad-b1"}>{data?.firstname} {data?.lastname}</div>
                <div className={"font-15 font-light"}>{data?.email || data?.phone_no}</div>
                {
                    id === tokenData?.user_id
                        ? <Link
                            to={"/profile/update"}
                            className={"h-5 lh-5 border:1px_solid_gray bg-lighter radius-sm pad-x2 mg-t2 decoration-none color-initial"}>
                            Edit <span className={"fa fa-pen pad-l1"}></span>
                        </Link>
                        : null
                }
            </div>
            <section className={"mg-t8 pad-x2"}>
                <header className={"font-15 pad-x2 pad-b2"}>{"Personal details".toUpperCase()}</header>
                {/!*{JSON.stringify(data)}*!/}
                <section className={"every:flex|flex-column|mg-y1|pad-2|font-semibold|font-14"}>
                    <div className={""}>
                        <span className={""}><span className={"fa fa-phone pad-r1"}></span> Mobile: </span>
                        <span className={"pad-l4 pad-y1"}>{data?.phone_no || <NotDefined />}</span>
                    </div>
                    <div className={""}>
                        <span className={""}><span className={"fa fa-flag pad-r1"}></span> Country: </span>
                        <span className={"pad-l4 pad-y1"}>{data?.country || <NotDefined />}</span>
                    </div>
                    <div className={""}>
                        <span className={""}><span className="fa fa-map pad-r1"></span> Address: </span>
                        <span className={"pad-l4 pad-y1"}>{data?.address || <NotDefined />}</span>
                    </div>
                    <div className={""}>
                        <span className={""}><span className="fa fa-calendar-plus pad-r1"></span>Date Joined: </span>
                        <span className={"pad-l4 pad-y1"}>{new Date(data?.date_joined).toLocaleDateString() || <NotDefined />}</span>
                    </div>
                </section>
            </section>
        </section>*/
    );
}

export default UserDetail;