import RemotionVideo from "../app/dashboard/_components/RemotionVideo";
import { Composition } from "remotion";

const parseJsonArray = (value) => {
  if (Array.isArray(value)) return value;

  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  return [];
};

const calculateMetadata = ({ props }) => {
  const fps = 30;
  const captions = parseJsonArray(props?.captions);
  const lastEnd = captions[captions.length - 1]?.end;
  const durationInFrames =
    typeof lastEnd === "number" && Number.isFinite(lastEnd)
      ? Math.max(1, Math.ceil((lastEnd / 1000) * fps))
      : 120;

  return {
    durationInFrames,
    fps,
    width: 1080,
    height: 1920,
  };
};

const RemotionRoot = () => {
  return (
    <>
      <Composition
        id="Empty"
        component={RemotionVideo}
        durationInFrames={120}
        fps={30}
        width={1080}
        height={1920}
        calculateMetadata={calculateMetadata}
      />
    </>
  );
};

export default RemotionRoot;
