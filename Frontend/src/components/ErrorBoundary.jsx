import { useRouteError, Link } from 'react-router-dom';
 
export function ErrorBoundary() {
    const error = useRouteError();
   
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Oops!</h1>
          <div className="mb-4">
            {error.status === 404 ? (
              <>
                <p className="text-xl font-semibold mb-2">Page Not Found</p>
                <p className="text-gray-600">The page you're looking for doesn't exist.</p>
              </>
            ) : (
              <>
                <p className="text-xl font-semibold mb-2">Something went wrong</p>
                <p className="text-gray-600">We encountered an error while loading this page.</p>
              </>
            )}
          </div>
          <Link to="/" className="inline-block bg-black text-white py-2 px-4 rounded hover:bg-gray-800">
            Go back to Home
          </Link>
        </div>
      </div>
    );
  }