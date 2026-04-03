import { useRouteError } from "react-router"

function ErrorBoundary() {
     console.log(useRouteError)
    const {data,status,statusText} = useRouteError();
   
  return (
    <div>
        <p className="flex items-center justify-center text-3xl p-10 text-red-500">{data}</p>
        <p className="flex items-center justify-center text-3xl p-10 text-red-500">
            {status}-{statusText}
        </p>
    </div>
  )
}

export default ErrorBoundary

