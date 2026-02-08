import { lyrics } from '../data/timeline';

export default function LyricsBackground() {
  return (
    <div className="lyrics-background">
      <div className="lyrics-text">
        {lyrics}
      </div>
    </div>
  );
}
