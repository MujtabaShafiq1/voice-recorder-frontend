import VoiceRecorder from "./recorder";

export default function Home() {
  return (
    <div className="h-screen w-screen flex items-center justify-center bg-gradient-to-br from-white to-gray-900">
      <VoiceRecorder />
    </div>
  );
}
