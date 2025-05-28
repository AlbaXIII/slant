import React from "react";
import Spinner from "react-bootstrap/Spinner";

const Asset = ({ spinner, src, message }) => {
  return (
    <div className="p-4">
        {spinner &&  <Spinner animation="grow" variant="dark" />}
        {src && <img src={src} alt={message} />}
        {message && <p className="mt-4">{message}</p>}
    </div>
  );
};

export default Asset;