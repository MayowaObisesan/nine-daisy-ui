import { Link, useNavigate, useRouteLoaderData } from "react-router-dom";
import useTokenData from "../hooks/useTokenData";
import { deleteUserTokens, deviceWidthEnum } from "../helpers/utils";
import { useDeviceSize } from "../hooks/useDeviceSize";
import { Avatar } from "./Elements";

const NavBar = ({ header, showAddAppButton = false, hideSearch = false, hideProfile = false, hideVerifiedButton, children }) => {
    // const isLoggedIn = false;
    const { me } = useRouteLoaderData("root");
    console.log(me);
    const tokenData = useTokenData();
    const accessToken = window.localStorage.getItem('nine_login');
    const size = useDeviceSize();

    const navigate = useNavigate();
    console.log(tokenData);

    const logout = () => {
        deleteUserTokens()
        // Refresh the page to delete stale states and data
        navigate(0);
    }

    return (
        <section className="navbar sticky top-0 z-[100] h-20 bg-white dark:bg-base-300">
            <div className="flex-1">
                <Link to={"/"} className="btn btn-ghost normal-case text-xl">{header || "Nine"}</Link>
            </div>
            <div className="flex-none gap-2">
                {/*<div className="form-control">*/}
                {/*    <input type="text" placeholder="Search" className="input input-bordered w-24 md:w-auto" />*/}
                {/*</div>*/}
                {
                    !hideSearch
                    && <Link to={"/search"} className="btn btn-ghost btn-circle">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                    </Link>
                }

                <div className="dropdown dropdown-end">
                    {/* <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
                        <div className="w-10 rounded-full">
                            {
                                tokenData?.isLoggedIn
                                    ? <img src="/images/stock/photo-1534528741775-53994a69daeb.jpg" />
                                    : <div className={"btn btn-circle"}></div>
                            }
                        </div>
                    </label> */}
                    {
                        !hideProfile &&
                        <label tabIndex={0} htmlFor="profile-dropdown" className={"flex flex-row items-center"}>
                            <Avatar
                                src={tokenData?.dp}
                                alt={""}
                                width={"12"}
                                classes={"btn p-1 w-full *:rounded-full leading-[48px] border-0 bg-neutral hover:bg-accent transition-colors"}
                            >
                                {
                                    !tokenData?.dp && (
                                        me.data?.firstname
                                            ? <div className={"font-bold text-lg"}>{me.data && me.data?.firstname.split("")[0].toUpperCase()}</div>
                                            : <div className={""}></div>
                                    )
                                }
                            </Avatar>
                        </label>
                    }
                    <ul id="profile-dropdown" tabIndex={0} className="mt-3 z-[1] p-2 menu menu-sm dropdown-content bg-white/85 backdrop-blur-md lg:backdrop-blur-xl dark:bg-base-200 rounded-box w-56">
                        {
                            tokenData?.isLoggedIn
                                ? <>
                                    <li>
                                        <Link to={"/profile"} className="justify-between p-4">
                                            Profile
                                            <span className="badge">New</span>
                                        </Link>
                                        <Link to={"/"} className="justify-between p-4" onClick={logout}>Logout</Link>
                                    </li>
                                </>
                                : <>
                                    <li>
                                        <Link to={"/signup"} className="justify-start space-x-3 p-4">Signup</Link>
                                        {/* <div className={"divider divider-base-300"}></div> */}
                                        <Link to={"/login"} className="justify-start space-x-3 p-4">Login</Link>
                                    </li>
                                </>
                        }
                        <div className={"divider my-1 after:h-px before:h-px"}></div>
                        <li><Link to={"/about"} className={"p-4"}>About</Link></li>
                        <li><Link to={"/terms"} className={"p-4"}>Terms of Service</Link></li>
                        <li><Link to={"/privacy"} className={"p-4"}>Privacy</Link></li>
                        <div className={"divider my-1 after:h-px before:h-px"}></div>
                        <li className={"font-bold text-error hover:bg-error/30 rounded-xl transition-colors"}>
                            <Link to={"/"} className="justify-start p-4" onClick={logout}>Logout</Link>
                        </li>
                    </ul>
                </div>
                {
                    showAddAppButton
                    && (
                        size.windowWidth >= deviceWidthEnum.laptop
                            ? <>
                                <div className="divider divider-horizontal"></div>
                                <Link to={"/new"} className="btn btn-primary">List your App</Link>
                            </>
                            : <Link to={"/new"} className="fixed right-8 top-initial bottom-8 z-100 h-8 line-height-8 radius2 cursor-pointer font-semibold shadow:0px-0px-16px-4px-73C088 decoration-none dark:shadow-unset btn btn-primary">List your Apps</Link>
                    )
                }
                {children}
            </div>
        </section>
    )
}

export default NavBar;