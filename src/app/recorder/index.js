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

          // Convert to Base64 for localStorage
          const reader = new FileReader();
          reader.readAsDataURL(audioBlob);
          reader.onloadend = () => {
            localStorage.setItem("voiceRecording", reader.result); // Save as Base64 string
          };

          audioChunksRef.current = []; // Clear chunks after saving
        };
      })
      .catch((err) => setError("Microphone access denied. Please enable permissions."));
  }, []);

  const startRecording = () => {
    if (!mediaRecorderRef.current) return;
    setIsRecording(true);
    audioChunksRef.current = []; // Reset chunks for a new recording
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
      {error && <p className="text-2xl text-red-400">{error}</p>}

      {isRecording ? (
        <StopIcon
          onClick={stopRecording}
          className="text-3xl text-red-400 cursor-pointer"
        />
      ) : (
        <RecordIcon
          onClick={startRecording}
          className="text-3xl text-gray-700 cursor-pointer"
        />
      )}

      {audioUrl && (
        <div style={{ marginTop: "20px" }}>
          <h3>Playback:</h3>
          <audio controls src={audioUrl} />
        </div>
      )}
    </div>
  );
}
