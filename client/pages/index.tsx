import React, { useEffect, useState } from 'react'

function index() {
  const [message, setMessage] = useState('Loading')

  useEffect(() => {
    fetch("http://172.16.5.4:8080/heyreact")
      .then((response) => response.json())
      .then((data) => {
          setMessage(data.message);
      });
  }, []);

  return (
    <div>{message}</div>
  )
}

export default index