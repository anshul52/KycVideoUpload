import React, { useEffect, useRef, useState } from "react";
import { uploadChunks } from "../utils/uploadChunks";

const VideoRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [randomAlphabet, setRandomAlphabet] = useState("");
  const [chunks, setChunks] = useState([]);
  const [timer, setTimer] = useState(10); // Timer state
  const [showRestart, setShowRestart] = useState(false); // To show "Restart Recording" button
  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const streamRef = useRef(null); // To store the media stream

  // Function to generate a random string of 5 alphabets
  const getRandomAlphabet = () => {
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let result = "";
    for (let i = 0; i < 5; i++) {
      result += alphabet[Math.floor(Math.random() * alphabet.length)];
    }
    return result;
  };

  useEffect(() => {
    let countdown;
    if (isRecording && timer > 0) {
      countdown = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else if (timer === 0) {
      stopRecording();
      setShowRestart(true); // Show the restart button after recording stops
    }

    return () => clearInterval(countdown);
  }, [isRecording, timer]);

  const startRecording = async () => {
    try {
      // Request access to video and audio
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      videoRef.current.srcObject = stream;
      streamRef.current = stream; // Store the stream

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (e) => {
        setChunks((prev) => [...prev, e.data]);
      };

      mediaRecorder.start(); // Start recording
      setIsRecording(true);
      setTimer(10); // Reset the timer to 10 seconds
      setShowRestart(false); // Hide the restart button while recording
      setRandomAlphabet(getRandomAlphabet()); // Generate and set a random 5-letter alphabet string
    } catch (err) {
      console.error("Error accessing camera or microphone:", err);
    }
  };

  const stopCamera = () => {
    const stream = streamRef.current;
    if (stream) {
      // Stop all tracks (video and audio)
      stream.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current.stop();
    setIsRecording(false);
    stopCamera(); // Stop the camera and microphone when manually stopping the recording
  };

  const handleUpload = async () => {
    const fullVideoBlob = new Blob(chunks, { type: "video/webm" });
    await uploadChunks(fullVideoBlob);
  };

  return (
    <div className="video-recorder p-5 bg-gray-900 text-gray-200 min-h-screen">
      {isRecording ? (
        <h2 className="text-2xl mb-4">
          Read this Sentence: <br /> I am registering on coinspe.com on
          14-10-2024 and my code is
          <span className="font-bold text-yellow-400"> {randomAlphabet}</span>
        </h2>
      ) : (
        <>
          <h2 className="text-2xl mb-4">
            When the recording start you have to read a sentence
          </h2>
        </>
      )}

      <div className="video-frame mb-4 border border-gray-700 rounded w-full h-100 flex items-center justify-center bg-black">
        <video
          ref={videoRef}
          autoPlay
          muted
          className="w-full h-full object-cover"
        />
      </div>

      {isRecording && (
        <div className="text-red-400 mb-4">
          Recording... Time left: {timer}s
        </div>
      )}

      <div className="buttons">
        {!isRecording && !showRestart && (
          <button
            onClick={startRecording}
            className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded transition"
          >
            Start Recording
          </button>
        )}
        {isRecording && (
          <button
            onClick={stopRecording}
            className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded transition"
          >
            Stop Recording
          </button>
        )}
        {showRestart && (
          <button
            onClick={startRecording}
            className="bg-yellow-500 hover:bg-yellow-400 text-white px-4 py-2 rounded transition"
          >
            Restart Recording
          </button>
        )}
        {!isRecording && chunks.length > 0 && (
          <button
            onClick={handleUpload}
            className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded transition"
          >
            Upload Video
          </button>
        )}
      </div>
    </div>
  );
};

export default VideoRecorder;
