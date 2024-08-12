import React, { useRef, useState } from "react";

interface UrlData {
  url: string;
  type: string;
}

export default function UrlCheck() {
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const timer = useRef<NodeJS.Timeout>();
  const sampleApi = "https://mocki.io/v1/970d417e-eaee-4155-94d9-1598953bd36e"; //sample api generated using mocki.io

  const sampleURLs = [
    //same json used as response in mock api
    {
      url: "http://test.com",
      type: "file",
    },
    {
      url: "http://test1.com",
      type: "folder",
    },
    {
      url: "http://test2.com",
      type: "folder",
    },
    {
      url: "http://test3.com",
      type: "file",
    },
    {
      url: "http://test4.com",
      type: "file",
    },
    {
      url: "http://test5.com",
      type: "folder",
    },
  ];

  const checkUrlFormat = (value: string) => {
    setErrorMessage("");
    setSuccessMessage("");
    setLoading(true);
    const url = value.trim(); //trim unwanted spaces
    if (url) {
      //function to check url format using a regular expression
      const pattern = new RegExp(
        "^(https?:\\/\\/)?" +
          "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" +
          "((\\d{1,3}\\.){3}\\d{1,3}))" +
          "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" +
          "(\\?[;&a-z\\d%_.~+=-]*)?" +
          "(\\#[-a-z\\d_]*)?$",
        "i"
      );

      if (!pattern.test(url)) {
        setLoading(false);
        setSuccessMessage("");
        setErrorMessage("Invalid URL format");
        return;
      }

      //debouncing url existence check using a timeout of 500ms

      if (timer.current) {
        clearTimeout(timer.current);
      }
      timer.current = setTimeout(() => {
        checkURLExists(url);
      }, 500);
    } else {
      setLoading(false);
      setErrorMessage("");
      setSuccessMessage("");
    }
  };

  const checkURLExists = async (url: string) => {
    const apiResponse: UrlData[] = await fetch(sampleApi).then((response) =>
      response.json()
    );
    //added the api call to create a delay to mock real api call, it always returns same response
    const urlExists = apiResponse.find(
      (item: { url: string }) => item.url === url
    );

    if (urlExists) {
      setLoading(false);
      setSuccessMessage(urlExists.url + " exists, it is a " + urlExists.type);
      setErrorMessage("");
    } else {
      setLoading(false);
      setErrorMessage("Invalid URL, URL does not exist!");
      setSuccessMessage("");
    }
  };

  const ListOfUrls = () => {
    //listing sample urls
    return (
      <ul>
        {sampleURLs?.map((item: UrlData, index: number) => (
          <li key={index}>
            <label style={{ fontWeight: "bold" }}> URL : </label>
            <label>{item.url}</label>
            <label style={{ fontWeight: "bold" }}> Type : </label>
            <label>{item.type}</label>
          </li>
        ))}
      </ul>
    );
  };
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        backgroundImage:
          "url(https://static.vecteezy.com/system/resources/previews/006/464/869/original/light-blue-abstract-bright-template-vector.jpg)",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "40vh",
          width: "70vw",
          borderRadius: "20px",
          backgroundColor: "white",
          margin: "10px",
        }}
      >
        <h2>Check if the URL exists</h2>
        <div
          style={{
            width: "30vw",
            display: "flex",
            flexDirection: "column",
            padding: "10px",
          }}
        >
          <input
            type="text"
            id="url"
            defaultValue=""
            placeholder="Enter URL"
            onChange={(e) => {
              checkUrlFormat(e.target.value); //checks the url format every time the input value changes
            }}
            style={{
              width: "30vw",
              height: "30px",
              padding: "5px",
              borderRadius: "20px",
              borderWidth: "1px",
              outline: "none",
            }}
          />
           {loading && (
            <label
              style={{
                alignSelf: "flex-start",
                paddingLeft: "10px",
              }}
            >
              checking url....
            </label>
          )}
          {errorMessage && (
            <label
              style={{
                color: "red",
                alignSelf: "flex-start",
                paddingLeft: "10px",
              }}
            >
              {errorMessage}
            </label>
          )}
          {successMessage && (
            <label
              style={{
                color: "green",
                alignSelf: "flex-start",
                paddingLeft: "10px",
              }}
            >
              {successMessage}
            </label>
          )}
        </div>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          height: "40vh",
          backgroundColor: "white",
          margin: "10px",
          padding: "10px",
          width: "70vw",
          borderRadius: "20px",
        }}
      >
        <h4 style={{ marginLeft: "20px" }}>Available URLs</h4>
        <ListOfUrls />
      </div>
    </div>
  );
}
