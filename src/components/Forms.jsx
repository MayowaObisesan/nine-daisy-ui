export const LabelField = ({ text, classes, children }) => {
    return (
        <>
            {
                children
                    ? <label className={`${classes}`}>
                        <span className={"h-10 leading-10"}>{text}</span>
                        {children}
                    </label>
                    : <label className={`label ${classes}`}>
                        <span>{text}</span>
                        {children}
                    </label>
            }
        </>
    )
}

export const FormField = ({ classes, children }) => {
    return (
        <div className={`my-4 ${classes}`}>
            {/* {
                !props.noLabel
                && (
                    <label
                        htmlFor={props.id}
                        className="pad-x1 pad-y1 focus:sibling-appname:color-blue"
                    >
                        {props.labelValue || "Label 1"}
                    </label>
                )
            } */}
            {children}
        </div>
    )
}