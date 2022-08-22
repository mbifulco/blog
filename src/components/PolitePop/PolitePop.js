import Script from 'next/script';

const PolitePopEmbed = ({ debug = false }) => (
  <Script
    src="https://cdn.politepop.com/polite-pop-v1.4.17/polite-pop.min.js"
    strategy="lazyOnload"
    onLoad={() => {
      PolitePop({
        styles: {
          popRoundedCorners: `8px`,
          popYesButtonTextColor: `#ffffff`,
          popYesButtonHoverTextColor: `#ffffff`,
          popYesButtonBackgroundColor: `#fe5186`,
          popYesButtonHoverBackgroundColor: `#fe4156`,
          modalBackgroundColor: `#222222`,
          modalBorder: `5px solid #ef0247`,
        },
        politePopHtml: `<p>Hey there - I put out an occasional newsletter with product and software development tips. Interested in subscribing?</p>`,
        politePopYesText: `Sounds great!`,
        exitIntentPopHtml: `<p>Interested in occasional updates on my writing and other work?</p>`,
        modalHtml: `<h2>Product strategies for Indie Hackers, react devs, and creators</h2><p>I write about building products, finding an audience, and useful tools for getting your work done. Typically 1-2 emails a month, straight from my brain to your inbox.&nbsp;😘</p><p>Unsubscribe any time.</p>`,
        character: `none`,
        signupFormAction: `https://app.convertkit.com/forms/1368838/subscriptions`,
        debug: debug,
      });
    }}
  />
);

export default PolitePopEmbed;
