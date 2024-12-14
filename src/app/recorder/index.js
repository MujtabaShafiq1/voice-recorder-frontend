"use client";
import { useState, useEffect, useRef } from "react";
import { FaMicrophone as RecordIcon } from "react-icons/fa";
import { FaStopCircle as StopIcon } from "react-icons/fa";

export default function VoiceRecorder() {
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const [error, setError] = useState(null);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  useEffect(() => {
    // Request microphone permissions
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        mediaRecorderRef.current = new MediaRecorder(stream);

        mediaRecorderRef.current.ondataavailable = (e) => {
          audioChunksRef.current.push(e.data);
        };

        mediaRecorderRef.current.onstop = () => {
          const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
          const audioUrl = URL.createObjectURL(audioBlob);
          setAudioUrl(audioUrl);

          audioChunksRef.current = [];
        };
      })
      .catch((err) => setError("Microphone Access Denied."));
  }, []);

  const startRecording = () => {
    if (!mediaRecorderRef.current) return;
    setIsRecording(true);
    audioChunksRef.current = [];
    mediaRecorderRef.current.start();
  };

  const stopRecording = () => {
    if (!mediaRecorderRef.current) return;
    setIsRecording(false);
    mediaRecorderRef.current.stop();
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <p className="text-2xl mb-3">Start Recording</p>
      {error && <p className="text-2xl text-red-200 mb-2">{error}</p>}

      {isRecording ? (
        <StopIcon
          onClick={stopRecording}
          className="text-4xl text-red-400 cursor-pointer"
        />
      ) : (
        <RecordIcon
          onClick={startRecording}
          className="text-4xl text-gray-700 cursor-pointer"
        />
      )}

      {audioUrl && (
        <div className="mt-4">
          <audio controls src={audioUrl} />
        </div>
      )}
    </div>
  );
}
