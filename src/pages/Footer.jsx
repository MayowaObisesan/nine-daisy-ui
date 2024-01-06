import { Link } from "react-router-dom";

const Footer = ({ fixedBottom, noFix, miniDetails }) => {
    let relativeType = "sticky";
    let footerClass;
    footerClass = "class-footer-style:sticky|bottom-0|flex|flex-row|flex-wrap|justify-evenly|align-items-center"
    if (fixedBottom) {
        relativeType = "fixed";
        footerClass = "class-footer-style:fixed|bottom-0|flex|flex-row|flex-wrap|justify-evenly|align-items-center"
    } else if (noFix) {
        relativeType = "relative";
        footerClass = "class-footer-style:relative|bottom-0|flex|flex-row|flex-wrap|justify-evenly|align-items-center"
    }

    const FooterContent = () => {
        return (
            <>
                {
                    !miniDetails
                        ? <>
                            <div className={"flex flex-row flex-wrap justify-evenly pad-y2 dark:bg-111314|color-whitesmoke"}>
                                <span className={"opacity-40"}>Feedback</span>
                                <Link to={"/terms"} className={"decoration-none color-initial dark:color-whitesmoke"}>Terms of use</Link>
                                <span className={""}>Privacy Policy</span>
                            </div>
                            <div
                                className="lg:sep-solid sep-1 sep-EEE pct:w-80 lg:pct:w-32 mg-x-auto radius-circle"></div>
                        </>
                        : null
                }
                <div className={"flex flex-row flex-wrap justify-around pad-x4 pad-y2 dark:bg-111314|color-whitesmoke"}>
                    <span className={"text-left"}>About</span>
                    <div className="font-medium text-center">&copy; {new Date().getUTCFullYear()} Nine</div>
                    <span className={"text-right"}>English</span>
                </div>
            </>
        )
    }

    return (
        <section className={""}>
            {
                <div className={relativeType + " bottom-0 left-0 flex flex-column flex-wrap justify-start align-items-center pct:w-100 every:flex-grow|flex-no-shrink|pct:w-100|text-center|bg-lighter dark:every:bg-111314"}>
                    <FooterContent />
                </div>
            }
            <section className="footer flex flex-column justify-start text-center bg-lighter bg-floralwhite pad-t8 d-none">
                {/*<div className="font-48">👏🏼</div>
                <div className="font-15 font-medium pad-t2">You've reached the end of my page</div>*/}
                {/*<div className="font-21 pad-y12 d-none">
                    What should I improve?
                    <div className="">
                        <textarea
                            name="" id=""
                            className="pct:w-80 lg:w-600 h-128 border-0 outline-none bg-gold radius pad-4 font-16">
                        </textarea>
                    </div>
                </div>*/}
                {/*<div className="font-18 h-12 lh-12">Page made with ❤️</div>
                <div className="d-none flex flex-column lg:flex-row justify-around">
                    <div className="font-16 h-6 lh-6">Styled using <a href="https://www.github.com/BMayowa/EYE_CSS">Eye.css</a></div>
                    <div className="font-16 h-6 lh-6">Design by Mayowa Obisesan</div>
                    <div className="font-16 h-6 lh-6">Hosted by <a href="https://www.github.com/">Github</a></div>
                </div>*/}
                <div
                    className="sep-solid sep-1 sep-EEE mg-t10 mg-b4 pct:w-80 lg:pct:w-32 mg-x-auto radius-circle"></div>

                {/*<div className="pad-t6 pct:w-80 lg:w-400 mg-x-auto flex flex-row justify-around">
                    <a href="tel:+2348087989548" target="_blank" className="">
                        <img src="images/socials/smartphone.png"
                             alt="" className=""/>
                    </a>
                    <a href="mailto:mayowaobi74@gmail.com" target="_blank" className=""><img
                        src="images/socials/gmail.png" alt="" className=""/>
                    </a>
                    <a href="mailto:mayowaobi74@outlook.com" target="_blank" className=""><img
                        src="images/socials/outlook-2.png" alt="" className=""/>
                    </a>
                    <a href="https://github.com/BMayowa" target="_blank" className=""><img
                        src="images/socials/github.png" alt="" className=""/>
                    </a>
                    <a href="https://linkedin.com/in/mayowa-obisesan" target="_blank" className=""><img
                        src="images/socials/linkedin.png" alt="" className=""/>
                    </a>
                    <a href="https://twitter.com/blessed_mayowa" target="_blank" className=""><img
                        src="images/socials/twitter-1.png" alt="" className=""/>
                    </a>
                </div>*/}



                {/*<div
                    className="flex flex-column lg:flex-row lg:justify-center bg-white pad-y5 mg-t4 shadow:-8px-0px-16px-0px-DEDEDE">
                    <div
                        className="font-semibold order-1 lg:order-2 mg-y2 lg:mg-y-unset lg:pad-x4 lg:border-x-1 lg:border-y-0 lg:border-black lg:border-solid">
                        Design by Mayowa Obisesan
                    </div>
                    <div className="order-2 lg:order-1 mg-y2 lg:mg-y-unset lg:pad-x4">
                        Styled with
                        <a href="https://www.github.com/MayowaObisesan/EYE_CSS" className="color-black">Eye CSS</a>
                    </div>
                    <div className="order-3 mg-y2 lg:mg-y-unset lg:pad-x4">
                        Hosting by <a href="https://www.github.com/" className="color-black">Github</a>
                    </div>
                </div>*/}
                {/*<div class="font-18 h-12 lh-12">Page made with ❤️</div>*/}
            </section>
        </section>
    )
}

export default Footer;