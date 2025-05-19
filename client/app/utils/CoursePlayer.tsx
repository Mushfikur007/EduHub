import React, { FC, useEffect, useState } from "react";
import axios from "axios";

type Props = {
  videoUrl: string;
  title?: string;
};

const CoursePlayer: FC<Props> = ({ videoUrl, title }) => {
  const serverUri = process.env.NEXT_PUBLIC_SERVER_URI || 'http://localhost:8000/api/v1/';
  const serverBaseUrl = serverUri.replace('/api/v1/', '');
  
  // Normalize the URL to handle both relative and absolute paths
  const getFullVideoUrl = (url: string) => {
    if (!url) return '';
    
    // If it's already a full URL, return it
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    
    // If it's a relative path starting with /uploads, add the server base URL
    if (url.startsWith('/uploads')) {
      return `${serverBaseUrl}${url}`;
    }
    
    // Default case
    return url;
  };
  
  const normalizedVideoUrl = getFullVideoUrl(videoUrl);
  
  const isLocalVideo = normalizedVideoUrl && (
    normalizedVideoUrl.includes('localhost') || 
    normalizedVideoUrl.includes('/uploads/videos/') ||
    normalizedVideoUrl.includes('/uploads/thumbnails/')
  );

  console.log("Original Video URL:", videoUrl);
  console.log("Normalized Video URL:", normalizedVideoUrl);
  console.log("Is local video:", isLocalVideo);

  if (isLocalVideo) {
    return (
      <div style={{ position: "relative", paddingTop: "56.25%", overflow: "hidden" }}>
        <video
          src={normalizedVideoUrl}
          controls
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            border: 0,
          }}
          title={title || "Course Video"}
          onError={(e) => console.error("Video failed to load:", e)}
        />
      </div>
    );
  }

  // For external videos (like VdoCipher), keep the existing implementation
  const [videoData, setVideoData] = useState({
    otp: "",
    playbackInfo: "",
  });

  useEffect(() => {
    try {
      axios
        .post(`${process.env.NEXT_PUBLIC_SERVER_URI}getVdoCipherOTP`, {
          videoId: normalizedVideoUrl,
      })
      .then((res) => {
        setVideoData(res.data);
      });
    } catch (error) {
      console.log(error);
    }
  }, [normalizedVideoUrl]);

  return (
    <div
      style={{ position: "relative", paddingTop: "56.25%", overflow: "hidden" }}
    >
      {videoData.otp && videoData.playbackInfo !== "" && (
        <iframe
          src={`https://player.vdocipher.com/v2/?otp=${videoData?.otp}&playbackInfo=${videoData.playbackInfo}&player=3thUX4gz2Z2U5DvN`}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            border: 0,
          }}
          allowFullScreen={true}
          allow="encrypted-media"
        ></iframe>
      )}
    </div>
  );
};

export default CoursePlayer;
