import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from "react-router-dom";


import Home, { appLoader } from './pages/Home';
import Root, { loader as meLoader } from "./pages/Root";
import ErrorPage from "./pages/ErrorPage";
import Search from "./pages/Search";
import CreatePage from './pages/CreatePage';
import AppDetail, { loader as appDetailLoader } from './pages/AppDetail';
import DeleteApp from "./pages/DeleteApp";
import UpdateAppDetail, { UpdateAppsGroups } from "./pages/UpdateAppDetail";
import UpdateAppLogo from "./pages/UpdateAppLogo";
import UpdateAppBasicInfo from "./pages/UpdateAppBasicInfo";
import UpdateAppScreenshot, { UpdateAppScreenshotIndex } from "./pages/UpdateAppScreenshot";
import UpdateAppScreenshotNew from "./pages/UpdateAppScreenshotNew";
import UpdateAppScreenshotView from "./pages/UpdateAppScreenshotView";
import UpdateAppScreenshotReplace from "./pages/UpdateAppScreenshotReplace";
import UpdateAppScreenshotDelete from "./pages/UpdateAppScreenshotDelete";
import UpdateAppCategory from "./pages/UpdateAppCategory";
import UpdateAppDownloadLinks from "./pages/UpdateAppDownloadLinks";
import Signup from "./pages/Signup";
import VerifyUser from "./pages/VerifyUser";
import Login from "./pages/Login";
import PasswordReset from "./pages/PasswordReset";
import VerifyPasswordReset from "./pages/VerifyPasswordReset";
import SetPassword from "./pages/SetPassword";
import SetPasswordSuccessful from "./pages/SetPasswordSuccessful";
import ChangePassword from "./pages/ChangePassword";
import ChangePasswordSuccessful from "./pages/ChangePasswordSuccessful";
import ProfileView, { ProfileViewIndex } from "./pages/ProfileView";
import UpdateProfilePicture from "./pages/UpdateProfilePicture";
import UpdateProfileBasicInfo from "./pages/UpdateProfileBasicInfo";
import UpdateProfileSocialInfo from "./pages/UpdateProfileSocialInfo";
import UserDetail, { loader as userDetailLoader } from "./pages/UserDetail";
import UserApps, { loader as userAppsLoader } from "./pages/UserApps";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import Profile, { loader as profileLoader } from "./pages/Profile";
import About from "./pages/About";
import NoPage from "./pages/NoPage";
import { ErrorBoundary, ErrorFallback } from "./helpers/utils";

const router = createBrowserRouter(
    createRoutesFromElements(
        <Route id={"root"} path="/" element={<Root />} errorElement={<ErrorPage />} loader={meLoader}>
            <Route index element={<Home />} loader={appLoader} />
            <Route id={"createApp"} path="new" element={<CreatePage />} />
            <Route id={"appDetail"} path="app/:appNameId" element={<AppDetail />} render={props => <AppDetail {...props.match.params} />} loader={appDetailLoader} errorElement={<ErrorPage />} />
            <Route id={"deleteApp"} path="app/:appNameId/delete" element={<DeleteApp />} render={props => <DeleteApp {...props.match.params} />} loader={appDetailLoader} errorElement={<ErrorPage />} />
            <Route id={"updateApp"} path="app/:appNameId/update" element={<UpdateAppDetail />} render={props => <UpdateAppDetail {...props.match.params} />} loader={appDetailLoader} errorElement={<ErrorPage />}>
                <Route index id={"updateAppDetail"} element={<UpdateAppsGroups />} render={props => <UpdateAppDetail {...props.match.params} />} loader={appDetailLoader} errorElement={<ErrorPage />} />
                <Route id={"updateAppLogo"} path={"logo"} element={<UpdateAppLogo />} render={props => <UpdateAppLogo {...props.match.params} />} loader={appDetailLoader} errorElement={<ErrorPage />}></Route>
                <Route id={"updateAppBasicInfo"} path={"basic-info"} element={<UpdateAppBasicInfo />} render={props => <UpdateAppBasicInfo {...props.match.params} />} loader={appDetailLoader} errorElement={<ErrorPage />}></Route>
                <Route id={"updateAppScreenshot"} path={"screenshots"} element={<UpdateAppScreenshot />} render={props => <UpdateAppScreenshot {...props.match.params} />} loader={appDetailLoader} errorElement={<ErrorPage />}>
                    <Route index id={"updateAppScreenshotIndex"} element={<UpdateAppScreenshotIndex />} render={props => <UpdateAppScreenshotIndex {...props.match.params} />} loader={appDetailLoader} errorElement={<ErrorPage />} />
                    <Route id={"updateAppNewScreenshot"} path={"new"} element={<UpdateAppScreenshotNew />} render={props => <UpdateAppScreenshotNew />} loader={appDetailLoader} errorElement={<ErrorPage />}></Route>
                    <Route id={"updateAppScreenshotId"} path={":screenshotId"} element={<UpdateAppScreenshotView />} render={props => <UpdateAppScreenshotView {...props.match.params} />} loader={appDetailLoader} errorElement={<ErrorPage />}></Route>
                    <Route id={"updateAppScreenshotReplace"} path={":screenshotId/replace"} element={<UpdateAppScreenshotReplace />} render={props => <UpdateAppScreenshotReplace {...props.match.params} />} loader={appDetailLoader} errorElement={<ErrorPage />}></Route>
                    <Route id={"updateAppScreenshotDelete"} path={":screenshotId/delete"} element={<UpdateAppScreenshotDelete />} render={props => <UpdateAppScreenshotDelete {...props.match.params} />} loader={appDetailLoader}></Route>
                </Route>
                <Route id={"updateAppCategory"} path={"category"} element={<UpdateAppCategory />} render={<UpdateAppCategory />} loader={appDetailLoader}></Route>
                <Route id={"updateAppDownloadLinks"} path={"download-links"} element={<UpdateAppDownloadLinks />} render={props => <UpdateAppDownloadLinks {...props.match.params} />} loader={appDetailLoader}></Route>
            </Route>
            <Route id={"signup"} path="signup" element={<Signup />} />
            <Route id={"verifyUser"} path="verify-user" element={<VerifyUser />} />
            <Route id={"login"} path="login" element={<Login />} />
            <Route id={"forgotPassword"} path="forgot-password" element={<PasswordReset />} />
            <Route id={"verifyPasswordReset"} path="verify-password-reset" element={<VerifyPasswordReset />} />
            <Route id={"setPassword"} path="set-password" element={<SetPassword />} />
            <Route id={"setPasswordSuccess"} path="set-password/success" element={<SetPasswordSuccessful />} />
            <Route id={"changePassword"} path="change-password" element={<ChangePassword />} render={props => <ChangePassword id={props.match.params.id} />} />
            <Route id={"changePasswordSuccessful"} path="change-password/success" element={<ChangePasswordSuccessful />} />
            <Route id={"search"} path="search" element={<Search />} />
            <Route id={"profile"} path="profile" element={<Profile />} loader={profileLoader} />
            {/*{/*<Route path="profile/update" element={<UpdateProfile/>}/>*/}
            <Route id={"profileView"} path="profile/update" element={<ProfileView />} loader={profileLoader}>
                <Route index id={"profileViewIndex"} element={<ProfileViewIndex />} loader={profileLoader} />
                <Route id={"updateProfilePicture"} path={"picture"} element={<UpdateProfilePicture />} loader={meLoader} />
                <Route id={"updateProfileBasicInfo"} path={"basic-info"} element={<UpdateProfileBasicInfo />} loader={meLoader} />
                <Route id={"updateProfileSocialInfo"} path={"social-info"} element={<UpdateProfileSocialInfo />} loader={meLoader} />
            </Route>
            <Route id={"userDetail"} path="user/:id" element={<UserDetail />} render={props => <UserDetail {...props.match.params} />} loader={userDetailLoader} />
            <Route id={"userApps"} path="user/:id/apps" element={<UserApps />} render={props => <UserApps {...props.match.params} />} loader={userAppsLoader} />
            <Route id={"terms"} path={"terms"} element={<Terms />} />
            <Route id={"privacy"} path={"privacy"} element={<Privacy />} />
            <Route id={"about"} path={"about"} element={<About />} />
            <Route id={"noPage"} path="*" element={<NoPage />} />
        </Route>
    )
)

export default function NineRoutes() {
    return (
        <ErrorBoundary fallbackComponent={ErrorFallback}>
            <RouterProvider router={router} />
        </ErrorBoundary>
    )
}