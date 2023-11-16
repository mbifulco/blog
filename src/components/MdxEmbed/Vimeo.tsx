import { getPadding } from './utils';
import { GeneralObserver } from './general-observer';

type VimeoProps = {
  vimeoId: string;
  autoPlay?: boolean;
  skipTo?: {
    h: number;
    m: number;
    s: number;
  };
};

export const Vimeo: React.FC<VimeoProps> = ({
  vimeoId,
  autoPlay = false,
  skipTo = { h: 0, m: 0, s: 0 },
}) => {
  const { h, m, s } = skipTo;

  return (
    <GeneralObserver>
      <div
        data-testid="vimeo"
        className="vimeo-mdx-embed"
        style={{
          position: 'relative',
          width: '100%',
          paddingTop: getPadding('16:9'),
        }}
      >
        <iframe
          title={`vimeo-${vimeoId}`}
          src={`https://player.vimeo.com/video/${vimeoId}?autoplay=${autoPlay}#t=${h}h${m}m${s}s`}
          frameBorder="0"
          allow="autoplay; fullscreen"
          allowFullScreen
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
          }}
        />
      </div>
    </GeneralObserver>
  );
};

export default Vimeo;
