import React from "react";

export const loginToken = () => {
    return localStorage.getItem("nine_login");
}

export const deleteUserTokens = () => {
    localStorage.removeItem("nine_login");
    localStorage.removeItem("nine_refresh");
}

export const deviceWidthEnum = {
    "desktop": 1200,
    "laptop": 992,
    "tablet": 768,
    "phone": 600
}

/*export const Logout = () => {
    const navigate = useNavigate();

    const logout = () => {
        localStorage.removeItem("nine_login");
        localStorage.removeItem("nine_refresh");
    }
    // setIsLoggedIn(false);
    // Refresh the page to delete stale states and data
    logout()
    navigate(0);
}*/


export function truncateLetters(text, start, stop) {
    try {
        // consoler.innerHTML += "truncate_letters";
        start = Number(start);
        stop = Number(stop);
        text = text?.toString();
        let text_split = text?.split('');
        /*
        * Don't use splice in the below scenario, use slice instead.
        * Splice changes text_split.length to the text_split.length - stop which if;
        * text_split.length == 118 and stop = 80, text_split.splice(start, stop) changes the value to 38 when
        * subtracting the stop value from the text_split.length value below. */
        // let text_split_splice = text_split?.splice(start, stop)
        let text_split_splice = text_split?.slice(start, stop)
        // let text_split_splice_string = text_split_splice.toString();
        let truncated_letters = text_split_splice?.join('')
        // consoler.innerHTML += " Word Truncated :" + truncated_letters;
        return (text_split?.length > stop) ? truncated_letters + '...' : truncated_letters;
    } catch (err) {
        alert('TRUNCATE LETTERS ERROR:' + err)
    }
}

function truncate_words(text, start, stop) {
    try {
        // consoler.innerHTML += "truncate_words";
        start = Number(start)
        stop = Number(stop)
        text = text?.toString();
        let text_split = text.split(' ')
        let text_split_splice = text_split.splice(start, stop)
        // let text_split_splice_string = text_split_splice.toString();
        let truncated_words = text_split_splice.join(' ')
        // consoler.innerHTML += " Word Truncated :" + truncated_words;
        return Number(text_split.length) > stop ? truncated_words + '...' : truncated_words
    } catch (err) {
        alert('TRUNCATE WORDS ERROR:' + err)
    }
}

export function NotDefined({ text }) {
    return (
        <span className={"font-italic color-gray"}>{text || "Not defined"}</span>
    )
}

export const getSocialAccountHandle = (socialAccountLink) => {
    const splittedLink = socialAccountLink.split("/");
    return splittedLink[splittedLink.length - 1];
};

export const isValidURL = (url) => {
    // const urlData = URL(url);
    // ["http:", "https:"].includes(urlData.protocol)
    return (url !== null || undefined) ? url?.startsWith("http") : false
}

export const refreshLogin = () => {
    const refreshTokenURL = `${process.env.REACT_APP_BASE_URL}/token/refresh`;
    const headers = {
        'Accept': '*/*',
        // 'Origin': '*',
    };
    const fetchInit = {
        method: 'POST',
        headers: headers,
        mode: 'cors',
        body: { 'refresh': localStorage.getItem('nine_refresh') },
        cache: 'default',
    };
    // event.preventDefault();

    fetch(refreshTokenURL, fetchInit)
        .then(response => {
            if (response.status !== 200) {
                throw response;
            }
            return response.json();
        })
        .then((data) => {
            console.log(data);
            // Store the token from the login response
            localStorage.setItem('nine_login', data['access']);
        })
        .catch((error) => {
            let error_message;
            if (error.status === 401) {
                error_message = "Invalid login credentials"
            } else if (error.status === 400) {
                error_message = "Login credentials are not valid"
            } else if (error.status === 500) {
                error_message = "Check your internet connection"
            } else {
                // There is no network connection or the Server is not up.
                error_message = "Oops. Network Error"
            }
            // setVerifyUserResponseData({
            //     message: error_message,
            //     successful: false,
            //     error: true
            // });
        });
}

export const initiateLogin = (email, password) => {
    const loginURL = `${process.env.REACT_APP_BASE_URL}/token/`;
    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);
    const headers = {
        'Accept': '*/*',
        // 'Origin': '*',
    };
    const fetchInit = {
        method: 'POST',
        headers: headers,
        mode: 'cors',
        body: formData,
        cache: 'default',
    };

    fetch(loginURL, fetchInit)
        .then(response => {
            if (response.status !== 200) {
                throw response;
            }
            return response.json();
        })
        .then((data) => {
            // console.log(data);
            // Store the token from the login response
            localStorage.setItem('nine_login', data['access']);
            localStorage.setItem('nine_refresh', data['refresh']);

            // reset the login form
            // event.target.reset();
            // setEmail('');
            // setPassword('');
            // setLoginResponseData({
            //     message: "Login successful",
            //     successful: true,
            //     error: false
            // });
            // setTimeout(() => {
            //     navigate('/');
            // }, 800);
        })
        .catch((error) => {
            console.log(error);
            // let error_message;
            // if (error.status === 401) {
            //     error_message = "Invalid login credentials"
            // } else if (error.status === 400) {
            //     error_message = "Login credentials are not valid"
            // } else if (error.status === 500) {
            //     error_message = "Check your internet connection"
            // } else {
            //     // There is no network connection or the Server is not up.
            //     error_message = "Oops. Network Error"
            // }
            // setLoginResponseData({
            //     message: error_message,
            //     successful: false,
            //     error: true
            // });
            // // reset the isSubmit loader
            // setIsSubmit(false);
        });
}

export class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedFromError(error) {
        // Update state so the next render will show the fallback UI
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        // Error can be logged to an error reporting service
        console.log(error, errorInfo);
    }

    render() {
        // console.log(this.state);
        if (this.state.hasError) {
            // You can render any custom Fallback UI
            return <h1>Something went wrong</h1>
            // return <ErrorPage />
        }
        return this.props.children;
    }
}

export function ErrorFallback({ error, resetErrorBoundary }) {
    return (
        <div class="errorMessage">
            <h1>Something went wrong</h1>
            <button type={"button"} onClick={resetErrorBoundary}>Try again</button>
        </div>
    )
}
