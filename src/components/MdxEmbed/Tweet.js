import { GeneralObserver } from './general-observer';
import { createScriptTag } from './utils';

const twttrEmbedScript = `
!function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0],p=/^http:/.test(d.location)?'http':'https';if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src=p+"://platform.twitter.com/widgets.js";fjs.parentNode.insertBefore(js,fjs);}}(document,"script","twitter-wjs")
`;

const twttrLoad = () => {
  if (
    typeof window.twttr !== `undefined` &&
    window.twttr.widgets &&
    typeof window.twttr.widgets.load === `function`
  ) {
    window.twttr.widgets.load(document.getElementsByClassName(`mdx-embed`));
  }
};

export const handleTwttrLoad = () => {
  if (!window.twttr) {
    createScriptTag(null, twttrEmbedScript);
    return {
      status: 'createScriptTag',
    };
  } else {
    twttrLoad();
    return {
      status: 'twttrLoad',
    };
  }
};

export const Tweet = ({
  tweetLink,
  theme = 'light',
  align = 'left',
  hideConversation = false,
}) => (
  <GeneralObserver onEnter={() => handleTwttrLoad()}>
    <div
      data-testid="twitter-tweet"
      className="twitter-tweet-mdx-embed"
      style={{ overflow: 'auto' }}
    >
      <blockquote
        className="twitter-tweet"
        data-theme={theme}
        data-align={align}
        data-conversation={hideConversation ? 'none' : ''}
      >
        <a href={`https://twitter.com/${tweetLink}?ref_src=twsrc%5Etfw`}>
          {typeof window !== 'undefined' && !window.twttr ? 'Loading' : ''}
        </a>
      </blockquote>
    </div>
  </GeneralObserver>
);

export default Tweet;
