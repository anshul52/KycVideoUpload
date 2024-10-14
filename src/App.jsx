import React from "react";
import VideoRecorder from "./components/VideoRecorder";

const App = () => {
  return (
    <div className="App bg-[#001015] text-[#fff]">
      <h1 className="text-2xl text-[#fff] font-bold">
        Video Recording and Upload
      </h1>
      <VideoRecorder />
    </div>
  );
};

export default App;
