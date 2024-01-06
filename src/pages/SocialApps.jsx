import { NavBar } from "./Base";
import { useParams } from "react-router-dom";
import useFetch from "../hooks/useFetch";
import { AppBoxes } from "./AppBoxes";
import React from "react";
import useTokenData from "../helpers/tokenData";
import { getSocialAccountHandle } from "../helpers/utils";

const SocialApps = () => {
    const { id } = useParams();
    const { rawToken, isLoggedIn, tokenData } = useTokenData();
    const [data] = useFetch(`${process.env.REACT_APP_BASE_URL}/user/${id}/`);
    const [socialSitesList] = useFetch(`${process.env.REACT_APP_BASE_URL}/app/social_list/`);

    return (
        <section>
            <NavBar />
            <section className={"pct:w-100 mg-x-auto lg:pct:w-80"}>
                <header
                    className={"relative pct:w-100 font-15 pad-x2 pad-y2 font-medium radius decoration-none color-initial hover:bg-lighter lg:font-18|pad-y4"}>
                    {id === tokenData?.user_id ? "Your social accounts" : `${data?.results[0]?.owner?.firstname} social accounts`}
                </header>
                <section
                    className={"flex flex-row flex-wrap justify-start align-items-start pct:w-100 pad-x2 overflow-x-auto"}>
                    {
                        socialSitesList?.map((socialSite, index) => {
                            if (data?.social_account_dict[socialSite]) {
                                return (
                                    <div key={index} className={""}>
                                        <span className={""}>
                                            <span
                                                className={`fab fa-${socialSite} square-4 lh-4 text-center color-999`}></span>
                                            {socialSite}:
                                        </span>
                                        <a
                                            href={data?.social_account_dict[socialSite]}
                                            target={"_blank"}
                                            rel={"noreferrer"}
                                            className={"pad-l4 pad-y1 font-semibold color-initial"}>@{getSocialAccountHandle(data?.social_account_dict[socialSite])}</a>
                                    </div>
                                )
                            }
                        })
                    }
                </section>
            </section>
        </section>
    )
}

export default SocialApps;