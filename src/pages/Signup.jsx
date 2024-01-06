import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, NotifError, NotifSuccess, TextInput } from "../components/Elements";
import Footer from "./Footer";
import { StyleProcessor } from '../helpers/StyleProcessor';
import { useDeviceSize } from '../hooks/useDeviceSize';
import { deviceWidthEnum } from '../helpers/utils';
import { FormField, LabelField } from '../components/Forms';

const SignupForm = () => {
    const [signupData, setSignupData] = useState({});
    const [signupResponseData, setSignupResponseData] = useState({});
    const navigate = useNavigate();
    const inputFullnameField = useRef(null);
    const inputFirstnameField = useRef(null);
    const inputLastnameField = useRef(null);
    const inputEmailField = useRef(null);
    const inputPhoneField = useRef(null);
    const inputPasswordField = useRef(null);
    const inputConfirmPasswordField = useRef(null);
    const [isInputFullnameFocused, setInputFullnameFocused] = useState(false);
    const [isInputEmailFocused, setInputEmailFocused] = useState(false);
    const [isInputPhoneFocused, setInputPhoneFocused] = useState(false);
    const [isInputPasswordFocused, setInputPasswordFocused] = useState(false);
    const [isInputConfirmPasswordFocused, setInputConfirmPasswordFocused] = useState(false);
    const [isFormValid, setIsFormValid] = useState(false);
    const [isSubmit, setIsSubmit] = useState(false);
    let [isFirstnameValid, setIsFirstnameValid] = useState(false);
    let [isLastnameValid, setIsLastnameValid] = useState(false);
    let [isEmailValid, setIsEmailValid] = useState(false);
    let [isPasswordValid, setIsPasswordValid] = useState(false);

    const toggleShowPassword = (e) => {
        inputPasswordField.current.getAttribute("type") === "password"
            ? inputPasswordField.current.setAttribute("type", "text")
            : inputPasswordField.current.setAttribute("type", "password")
        new StyleProcessor(e.target).toggleClass('fa-eye').toggleClass('fa-eye-slash')
    }

    const validateFormFields = (name, value) => {
        // validate the fields
        if (value === "") {
            setIsFormValid(false);
            return;
        }

        if (name === "firstname" || name === "lastname") {
            const digitRegex = /\d/g;
            // const myString = "Hello, 123!";
            const digitMatches = value.match(digitRegex); // ["1", "2", "3"]
            if (!digitMatches) {
                if (name === "firstname") {
                    setIsFirstnameValid(true);
                } else if (name === "lastname") {
                    setIsLastnameValid(true);
                }
            }
        }
        if (name === "email") {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            setIsEmailValid(emailRegex.test(value)); // true
        }
        if (name === "password") {
            // Validate that email does not exist already
            const passwordRegex = /^.{8,}$/;
            setIsPasswordValid(passwordRegex.test(value));
            /*if (value.length >= 8) {
                setIsPasswordValid(true);
            } else {
                setIsPasswordValid(false);
            }*/
        }
        // console.log(isFirstnameValid + "--" + isLastnameValid + "--" + isPasswordValid + "--" + isEmailValid);
        setIsFormValid(isFirstnameValid && isLastnameValid && isEmailValid && isPasswordValid);
    }
    const handleKeyUp = (event) => {
        const name = event.target.name;
        const value = event.target.value;

        // Acts a debouncer
        setIsFormValid(isFirstnameValid && isLastnameValid && isEmailValid && isPasswordValid);
    }
    const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;

        validateFormFields(name, value);

        setSignupData(values => (
            { ...values, [name]: value }
        ));
    }

    useEffect(
        () => {
        }, []
    );

    const showLoadingState = (e) => {
        setIsSubmit(true);
    };

    const handleSignup = (event) => {
        // const signupURL = "http://localhost:8000/signup/";
        // const signupURL = "https://blessedmayowa.pythonanywhere.com/signup/";
        const signupURL = `${process.env.REACT_APP_BASE_URL}/user/`;
        const headers = {
            'Accept': '*/*',
            // 'Origin': '*',
        };
        const fetchInit = {
            method: 'POST',
            headers: headers,
            mode: 'cors',
            body: new FormData(event.target),
            cache: 'default',
        };
        event.preventDefault();

        fetch(signupURL, fetchInit)
            .then(response => {
                if (!response.ok) {
                    // throw response;
                    setSignupResponseData({
                        message: "Error occurred creating your account",
                        successful: false,
                        error: true
                    });
                }
                return response.json();
            })
            .then((data) => {
                // reset the signup form
                event.target.reset();
                setIsSubmit(false);
                //setSignupData({})
                setSignupResponseData({
                    message: "Signup successful",
                    successful: true,
                    error: false
                });
                setTimeout(() => {
                    navigate('/verify-user');
                }, 800);

            })
            .catch((error) => {
                let error_message;
                if (error.status === 401) {
                    error_message = "Invalid signup details"
                } else if (error.status === 400) {
                    error_message = "Signup data is not valid"
                } else if (error.status === 500) {
                    error_message = "Check your internet connection"
                } else {
                    // error_message = error;
                }
                setSignupResponseData({
                    message: error_message,
                    successful: false,
                    error: true
                });
                // reset the isSubmit loader
                setIsSubmit(false);
            });
    }

    return (
        <>
            <form onSubmit={handleSignup}
                className="relative flex flex-col gap-12 mx-auto px-1 w-[96%] lg:w-[480] lg:shadow2">
                {signupResponseData?.successful ? <NotifSuccess message={signupResponseData.message} /> : null}
                {signupResponseData?.error ? <NotifError message={signupResponseData.message} /> : null}

                <div className={"flex flex-col"}>
                    <div className={"flex flex-row flex-nowrap justify-between gap-4"}>
                        <FormField classes={"flex-grow"}>
                            <LabelField>
                                Firstname
                                <TextInput
                                    type="text"
                                    name="firstname"
                                    value={signupData?.firstname || ""}
                                    placeholder="Your firstname"
                                    onChange={handleChange}
                                    onKeyUp={handleKeyUp}
                                    onFocus={(e) => {
                                        setInputFullnameFocused(true)
                                    }}
                                    onBlur={(e) => {
                                        setInputFullnameFocused(false)
                                    }}
                                // ref={inputFirstnameField}
                                />
                            </LabelField>
                        </FormField>
                        <FormField classes={"flex-grow"}>
                            <LabelField>
                                Lastname
                                <TextInput
                                    type="text"
                                    name="lastname"
                                    value={signupData?.lastname || ""}
                                    placeholder="Your lastname"
                                    onChange={handleChange}
                                    onKeyUp={handleKeyUp}
                                    onFocus={(e) => {
                                        setInputFullnameFocused(true)
                                    }}
                                    onBlur={(e) => {
                                        setInputFullnameFocused(false)
                                    }}
                                // ref={inputLastnameField}
                                />
                            </LabelField>
                        </FormField>
                        {/* <label className="d-block pct:w-48">
                            Firstname
                            <input
                                type="text"
                                name="firstname"
                                value={signupData?.firstname || ""}
                                placeholder="Your firstname"
                                onChange={handleChange}
                                onKeyUp={handleKeyUp}
                                onFocus={(e) => {
                                    setInputFullnameFocused(true)
                                }}
                                onBlur={(e) => {
                                    setInputFullnameFocused(false)
                                }}
                                ref={inputFirstnameField}
                                className="pct:w-100 h-8 lh-8 pad-x2 mg-y1 outline:1px_solid_transparent border:1px_solid_lightgray outline-offset-2 focus:outline:2px_solid_gray transition:outline_80ms_ease radius-sm font-12 placeholder:font-regular dark:bg-222425|border:1px_solid_000304|color-whitesmoke dark:focus:outline:3px_solid_444445|bg-333435"
                            />
                        </label>
                        <label className="d-block pct:w-48">
                            Lastname
                            <input
                                type="text"
                                name="lastname"
                                value={signupData?.lastname || ""}
                                placeholder="Your lastname"
                                onChange={handleChange}
                                onKeyUp={handleKeyUp}
                                onFocus={(e) => {
                                    setInputFullnameFocused(true)
                                }}
                                onBlur={(e) => {
                                    setInputFullnameFocused(false)
                                }}
                                ref={inputLastnameField}
                                className="pct:w-100 h-8 lh-8 pad-x2 mg-y1 outline:1px_solid_transparent border:1px_solid_lightgray outline-offset-2 focus:outline:2px_solid_gray transition:outline_80ms_ease radius-sm font-12 placeholder:font-regular dark:bg-222425|border:1px_solid_000304|color-whitesmoke dark:focus:outline:3px_solid_444445|bg-333435"
                            />
                        </label> */}
                    </div>
                    <FormField>
                        <LabelField>
                            Email
                            <TextInput
                                type="email"
                                name="email"
                                value={signupData?.email || ""}
                                placeholder="Enter your active email"
                                onChange={handleChange}
                                onKeyUp={handleKeyUp}
                                onFocus={(e) => {
                                    setInputEmailFocused(true)
                                }}
                                onBlur={(e) => {
                                    setInputEmailFocused(false)
                                }}
                            // ref={inputEmailField}
                            />
                        </LabelField>
                    </FormField>
                    <FormField>
                        <LabelField>
                            Password
                            <div className={"relative flex flex-row align-items-center"}>
                                <TextInput
                                    type="password"
                                    name="password"
                                    value={signupData?.password || ""}
                                    placeholder="Password must be 8 characters or more"
                                    onChange={handleChange}
                                    onKeyUp={handleKeyUp}
                                    onFocus={(e) => {
                                        setInputPasswordFocused(true)
                                    }}
                                    onBlur={(e) => {
                                        setInputPasswordFocused(false)
                                    }}
                                // ref={inputPasswordField}
                                />
                                {signupData?.password?.length > 0 ? <span className={"fa fa-eye abs px:right-4 square-7 lh-7 radius text-center cursor-pointer dark:bg-11131488"} onClick={toggleShowPassword}></span> : null}
                            </div>
                        </LabelField>
                    </FormField>
                </div>
                <div className={"form-control"}>
                    <Button
                        type="submit"
                        disabled={!(isEmailValid && isPasswordValid) && (signupData?.firstname < 4 || signupData?.lastname < 4)}
                        onClick={(e) => showLoadingState(e)}
                    >
                        {isSubmit ? <span className='fa fa-spinner fa-spin'></span> : "Submit"}
                    </Button>
                    {/* <button type="submit"
                        className="d-block pct:w-64 h-7 lh-7 mg-x-auto text-center radius bg-green border-0 color-FFF font-14 font-medium cursor-pointer disabled:bg-blue-200 disabled:cursor-not-allowed"
                        disabled={!(isEmailValid && isPasswordValid) && (signupData?.firstname < 4 || signupData?.lastname < 4)}
                        onClick={(e) => showLoadingState(e)}
                    >
                        {isSubmit ? <span className='fa fa-spinner fa-spin'></span> : "Submit"}
                    </button> */}
                </div>
                {/* <label className="">
                    Email
                    <input
                        type="email"
                        name="email"
                        value={signupData?.email || ""}
                        placeholder="Enter your active email"
                        onChange={handleChange}
                        onKeyUp={handleKeyUp}
                        onFocus={(e) => {
                            setInputEmailFocused(true)
                        }}
                        onBlur={(e) => {
                            setInputEmailFocused(false)
                        }}
                        ref={inputEmailField}
                        className="pct:w-100 h-8 lh-8 pad-x2 mg-y1 outline:1px_solid_transparent border:1px_solid_lightgray outline-offset-2 focus:outline:2px_solid_gray transition:outline_80ms_ease radius-sm font-12 placeholder:font-regular dark:bg-222425|border:1px_solid_000304|color-whitesmoke dark:focus:outline:3px_solid_444445|bg-333435"
                    />
                </label> */}

                {/*<label>
                Gender
                <select
                    name="gender" value={signupData.gender || ""} onChange={handleChange}
                    className="pct:w-100 h-8 lh-8 pad-x2 mg-y1 outline:1px_solid_transparent border:1px_solid_lightgray outline-offset-2 focus:outline:2px_solid_gray transition:outline_80ms_ease radius-sm font-12"
                    >
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                </select>
            </label>
            <label className="">
                Phone no
                <input
                    type="tel"
                    name="phone_no"
                    value={signupData.phone_no || ""}
                    placeholder="Enter your active mobile no"
                    onChange={handleChange}
                    onFocus={(e) => {setInputPhoneFocused(true)}}
                    onBlur={(e) => {setInputPhoneFocused(false)}}
                    ref={inputPhoneField}
                    className="pct:w-100 h-8 lh-8 pad-x2 mg-y1 outline:1px_solid_transparent border:1px_solid_lightgray outline-offset-2 focus:outline:2px_solid_gray transition:outline_80ms_ease radius-sm font-12"
                />
            </label>
            <label>
                Country
                <select
                    name="country" value={signupData.country || ""} onChange={handleChange}
                    className="pct:w-100 h-8 lh-8 pad-x2 mg-y1 outline:1px_solid_transparent border:1px_solid_lightgray outline-offset-2 focus:outline:2px_solid_gray transition:outline_80ms_ease radius-sm font-12"
                    >
                    <option value="United States">United States</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="Nigeria">Nigeria</option>
                    <option value="Canada">Canada</option>
                    <option value="Uganda">Uganda</option>
                    <option value="Kenya">Kenya</option>

                </select>
            </label>*/}
                {/* <label className="">
                    Password
                    <div className={"relative flex flex-row align-items-center"}>
                        <input
                            type="password"
                            name="password"
                            value={signupData?.password || ""}
                            placeholder="Password must be 8 characters or more"
                            onChange={handleChange}
                            onKeyUp={handleKeyUp}
                            onFocus={(e) => {
                                setInputPasswordFocused(true)
                            }}
                            onBlur={(e) => {
                                setInputPasswordFocused(false)
                            }}
                            ref={inputPasswordField}
                            className="pct:w-100 h-8 lh-8 pad-x2 mg-y1 outline:1px_solid_transparent border:1px_solid_lightgray outline-offset-2 focus:outline:2px_solid_gray transition:outline_80ms_ease radius-sm font-12 placeholder:font-regular dark:bg-222425|border:1px_solid_000304|color-whitesmoke dark:focus:outline:3px_solid_444445|bg-333435"
                        />
                        {signupData?.password?.length > 0 ? <span className={"fa fa-eye abs px:right-4 square-7 lh-7 radius text-center cursor-pointer dark:bg-11131488"} onClick={toggleShowPassword}></span> : null}
                    </div>
                </label> */}
                {/*<label className="">
                    Confirm Password
                    <input
                        type="password"
                        name="confirm_password"
                        value={signupData.confirm_password || ""}
                        placeholder="Password must be 8 characters or more"
                        onChange={handleChange}
                        onFocus={(e) => {
                            setInputConfirmPasswordFocused(true)
                        }}
                        onBlur={(e) => {
                            setInputConfirmPasswordFocused(false)
                        }}
                        ref={inputConfirmPasswordField}
                        className="pct:w-100 h-8 lh-8 pad-x2 mg-y1 outline:1px_solid_transparent border:1px_solid_lightgray outline-offset-2 focus:outline:2px_solid_gray transition:outline_80ms_ease radius-sm font-12"
                    />
                </label>*/}
            </form>
            <div className={"d-block pct:w-72 mg-x-auto mg-y4 border:0px_solid_BBB em:border-t-0.05 lg:w-320|mg-y8|border-DDD dark:border:0px_solid_444445 dark:em:border-t-0.05"}></div>
            <div
                className={"pct:w-96 mg-x-auto text-center lg:w-400"}>
                Already have an account?
                <Link to={"/login"} className={"font-bold pad-y2 pad-x1 color-initial dark:color-whitesmoke"}>Login</Link>
            </div>
        </>
    )
}


const Signup = () => {
    const size = useDeviceSize();

    return (
        <section className={"flex flex-row items-center h-screen bg-base-300"}>
            <div className="bg-base-300 relative flex flex-col gap-4 w-full h-full mx-auto py-8 md:justify-center md:items-center md:w-[560px] lg:w-[540px]">
                {/*<Link to="/" className="fixed top-2 left-1 square-6 lh-6 lg:top-4|left-4|square-8|lh-8 color-initial text-center font-16 radius-circle z-10"><span className="fa fa-times"></span></Link>*/}
                <div className={"self-start md:self-center lg:self-start mb-8 md:mb-10"}>
                    <Link to={"/"} className="block text-left md:text-center lg:text-left text-xl md:text-2xl font-medium md:font-medium px-4">Nine</Link>
                    <div className="relative text-3xl md:text-4xl font-black lh-normal pl-4 mg:p-0 decoration-none color-initial md:text-center lg:text-left">Create Account</div>
                </div>
                <SignupForm />
                {/* <Footer miniDetails={true} /> */}
            </div>
            {
                size.windowWidth >= deviceWidthEnum.laptop
                && <div className={"hidden flex-1 lg:flex flex-col justify-center items-center h-full bg-base-200"}>
                    Nine.
                    Signup to your account
                </div>
            }
        </section>
    );
};

export default Signup;