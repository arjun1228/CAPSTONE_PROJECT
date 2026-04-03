import { useAuth } from '../store/authStore'
import { Navigate, useLocation } from 'react-router'

function ProtectedRoute({children , allowedRoles}) {
  const location = useLocation()
    //get the login status from store
  const { loading, isAuthChecked, currentUser, isAuthenticated } = useAuth()

    //loading state
    if (!isAuthChecked || loading) {
        return (
          <div className='flex min-h-[40vh] items-center justify-center'>
            <p className='rounded-md bg-slate-800 px-4 py-2 text-sm font-medium text-white shadow'>Checking access...</p>
          </div>
        )
    }
    //if the user is not loggedIn
    if(!isAuthenticated) {
        //redirect to the login page
      return <Navigate to="/login" replace state={{ from: location }} />
    }
    //check roles
    if(allowedRoles && !allowedRoles.includes(currentUser?.role)) {
        //redirect unauthorized users to a dedicated unauthorized page
        return <Navigate to="/unauthorized" replace state={{ redirectTo: '/' }} />
    }

  return (
    children
  )
}

export default ProtectedRoute