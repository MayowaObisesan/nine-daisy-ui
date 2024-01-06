const NoPage = () => {
  return (
    <div className={"flex flex-column align-items-center justify-center pct:w-100 pct:h-100 dark:color-whitesmoke"}>
      <div id={"id-page-error-status"} className={"d-block font-40 font-bold lh-normal pad-y4 lg:font-80 dark:color-darkgray"}>
        404
      </div>
      <header className={"font-14 lg:font-18 lh-50 text-center"}>
        {/* Something went wrong,  */}
        Nine cannot find this page.
        <br /> Try going back one step
      </header>
    </div>
  )
}

export default NoPage