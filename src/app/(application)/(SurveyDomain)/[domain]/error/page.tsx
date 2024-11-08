import React from 'react'

ErrorPage.getLayout = function getLayout(ErrorPage: Iterable<React.ReactNode> | React.ReactPortal | Promise<React.AwaitedReactNode> | null | undefined) {
    return <div>{ErrorPage}</div>;
  }

function ErrorPage() {
  return (
    <div>ErrorPage</div>
  )
}

export default ErrorPage;