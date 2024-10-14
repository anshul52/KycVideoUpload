import axios from "axios";

export const uploadChunks = async (blob) => {
  const CHUNK_SIZE = 1024 * 1024; // 1 MB per chunk
  let start = 0;
  let chunkIndex = 0;

  while (start < blob.size) {
    const end = start + CHUNK_SIZE;
    const chunk = blob.slice(start, end);

    // Create a FormData object to send the chunk
    const formData = new FormData();
    formData.append("chunk", chunk, `video_chunk_${chunkIndex}.webm`);

    try {
      await axios.post("http://localhost:5000/api/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log(`Chunk ${chunkIndex} uploaded successfully`);
    } catch (error) {
      console.error(`Error uploading chunk ${chunkIndex}:`, error);
    }

    chunkIndex++;
    start = end;
  }
};
