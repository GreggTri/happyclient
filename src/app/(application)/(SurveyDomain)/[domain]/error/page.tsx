import React from 'react'

ErrorPage.getLayout = function getLayout(ErrorPage: Iterable<React.ReactNode> | React.ReactPortal | Promise<React.AwaitedReactNode> | null | undefined) {
    return <div>{ErrorPage}</div>;
  }

function ErrorPage() {
  return (
    <div className='flex flex-col items-center justify-center h-screen space-y-4'>
      <h1 className='text-red-500 text-xl'>404 Error - Could not find token in URL</h1>
      <span className='text-white/50'>Please look back at your email to find correct the URL, if there is no token reach out to your firm and let them know.</span>
    </div>
  )
}

export default ErrorPage;