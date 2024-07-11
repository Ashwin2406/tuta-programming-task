import React, { useEffect, useState } from "react";

interface UrlData {
  url: string;
  type: string;
}

export default function UrlCheck() {
  const [url, setUrl] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [urlList, setUrlList] = useState<UrlData[]>([]);
  const sampleApi = "https://mocki.io/v1/ef956329-cea3-4f6c-94bb-dd42b3bed68c"; //sample api generated using mocki.io

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

  const checkUrlFormat = () => {
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
    return pattern.test(url);
  };

  const checkURLExists = () => {
    //function to check if the url exists in the api response
    const urlExists = urlList?.find((item) => item.url === url);
    return urlExists;
  };

  const throttleUrlCheck = async () => {
    const response = await checkURLExists(); //returns url details if url exist else undefined
    if (response) {
      setSuccessMessage(response.url + " exists, it is a " + response.type);
      setErrorMessage("");
    } else {
      setErrorMessage("Invalid URL, URL does not exist!");
      setSuccessMessage("");
    }
  };

  useEffect(() => {
    if (url) {
      if (!checkUrlFormat()) {
        setSuccessMessage("");
        setErrorMessage("Invalid URL format");
        return;
      }

      const timer = setTimeout(() => {
        throttleUrlCheck();
      }, 1000);

      return () => clearTimeout(timer);

    } else {
      setErrorMessage("");
      setSuccessMessage("");
    }
  }, [url]); //checks the url format every time the input value changes

  const getSampleUrls = () => {
    fetch(sampleApi)
      .then((response) => response.json())
      .then((data) => setUrlList(data))
      .catch((error) => console.error(error));
  };

  useEffect(() => {
    getSampleUrls(); //getting a json data with some sample urls with a mock api
  }, []);

  const handleInputChange = (value: string) => {
    const trimmedUrl = value.trim(); //trim unwanted spaces
    setUrl(trimmedUrl);
  };

  const ListOfUrls = () => {
    return (
      <ul>
        {urlList?.map((item: UrlData, index: number) => {
          return (
            <li key={index}>
              <label style={{ fontWeight: "bold" }}> URL : </label>
              <label>{item.url}</label>
              <label style={{ fontWeight: "bold" }}> Type : </label>
              <label>{item.type}</label>
            </li>
          );
        })}
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
        <h2 style={{}}>Check if the URL exists</h2>
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
            value={url}
            onChange={(e) => {
              handleInputChange(e.target.value);
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
          {url && errorMessage && (
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
        {urlList.length > 0 && <ListOfUrls />}
      </div>
    </div>
  );
}
