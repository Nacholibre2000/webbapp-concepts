import React, { useEffect, useState } from "react";

function index() {
  const [message, setMessage] = useState("Loading");
  //const [people, setPeople] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8080/api/home")
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        // message = 'Loading'
        // once data is retrieved
        // message = data.message
        // setMessage(data.message);
        // setPeople(data.people);
      });
  }, []);

  return <div>Index</div>;
}

export default index;