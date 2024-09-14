import React, { useState } from "react";

const App = () => {
  const [video, setvideo] = useState(null);
  const [videoUrl, setVideoUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Loading state

  const handleFileChange = (event) => {
    setvideo(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (video) {
      const formData = new FormData();
      formData.append("video", video);

      setIsLoading(true); // Set loading state to true

      try {
        // Simulating backend request to upload the file and return video URL
        const response = await fetch(
          "http://localhost:8000/api/v1/video/compress-video",
          {
            method: "POST",
            body: formData,
            credentials: "include"
          }
        );
        const data = await response.json();
        console.log(data.data);
        if (data.data) {
          setVideoUrl(data.data); // Backend returns the video URL
        }
      } catch (error) {
        console.error("Error uploading the file:", error);
      } finally {
        setIsLoading(false); // Reset loading state
      }
    } else {
      console.log("No file selected.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg w-full">
        <h1 className="text-4xl font-semibold text-center mb-6 text-gray-800">
          Upload Your File
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col items-center">
          <label className="w-full text-left mb-2 text-gray-700 font-medium">
            Select File:
          </label>
          <input
            type="file"
            onChange={handleFileChange}
            className="border border-gray-300 rounded-lg p-2 w-full mb-6 focus:outline-none focus:border-blue-500"
          />

          <button
            type="submit"
            className={`w-full bg-blue-500 text-white font-semibold py-3 rounded-lg hover:bg-blue-600 transition duration-300 flex items-center justify-center ${
              isLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={isLoading} // Disable button during loading
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 mr-3 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  ></path>
                </svg>
                Compressing...
              </>
            ) : (
              "Submit"
            )}
          </button>
        </form>

        {video && (
          <div className="mt-6 text-center text-gray-700">
            Selected file: <strong>{video.name}</strong>
          </div>
        )}

        {/* Show the video and download option after the URL is received */}
        {videoUrl && (
          <div className="mt-8">
            <h2 className="text-2xl font-medium text-gray-800 mb-4">
              Video Preview:
            </h2>

            <video
              controls
              src={videoUrl}
              className="w-full rounded-lg mb-4"
            ></video>

            <a
              href={`${videoUrl}?download=true`} // Append query parameter for download
              download="video.mp4"
              className="inline-block bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition duration-300"
            >
              Download Video
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
