import React from 'react'
import { Spinner } from 'react-bootstrap'

const Loading = ({size=100}) => {
  return (
    <div>
    <Spinner animation="border" role="status">
      <span className="visually-hidden"></span>
    </Spinner>
    </div>
  )
}

export default Loading;
