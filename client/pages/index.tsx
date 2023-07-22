import React, { useEffect, useState } from 'react'

function index() {
  const [message, setMessage] = useState('Loading')

  useEffect(() => {
    fetch("http://172.16.5.4:8080/home")
      .then((response) => response.json())
      .then((data) => {
          console.log(data);
      });
  }, []);

  return (
    <div>index</div>
  )
}

export default index