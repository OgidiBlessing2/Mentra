import Card from "../common/Card";
import Button from "../common/Button";
import ProgressBar from "../common/ProgressBar";

export default function HeroBanner({
  title,
  progress,
}) {
  return (
    <Card>
      <h1 className="text-4xl font-bold">
        {title}
      </h1>

      <ProgressBar value={progress} />

      <p>{progress}% Complete</p>
    </Card>
  );
}