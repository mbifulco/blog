import PropTypes from 'prop-types';
import Script from 'next/script';
import { Flex } from '@chakra-ui/react';

const SubscriptionForm = ({ tags }) => {
  return (
    <Flex>
      <Script src="https://f.convertkit.com/ckjs/ck.5.js" />
      <form
        action="https://app.convertkit.com/forms/3923746/subscriptions"
        className="seva-form formkit-form"
        method="post"
        data-sv-form="3923746"
        data-uid="be6a97481a"
        data-format="inline"
        data-version="5"
        data-options='{"settings":{"after_subscribe":{"action":"message","success_message":"Success! Now check your email to confirm your subscription.","redirect_url":""},"analytics":{"google":null,"fathom":null,"facebook":null,"segment":null,"pinterest":null,"sparkloop":null,"googletagmanager":null},"modal":{"trigger":"timer","scroll_percentage":null,"timer":5,"devices":"all","show_once_every":15},"powered_by":{"show":true,"url":"https://convertkit.com/features/forms?utm_campaign=poweredby&amp;utm_content=form&amp;utm_medium=referral&amp;utm_source=dynamic"},"recaptcha":{"enabled":false},"return_visitor":{"action":"custom_content","custom_content":"Thanks for subscribing!"},"slide_in":{"display_in":"bottom_right","trigger":"timer","scroll_percentage":null,"timer":5,"devices":"all","show_once_every":15},"sticky_bar":{"display_in":"top","trigger":"timer","scroll_percentage":null,"timer":5,"devices":"all","show_once_every":15}},"version":"5"}'
        min-width="400 500 600 700 800"
      >
        <div data-style="clean">
          <ul
            className="formkit-alert formkit-alert-error"
            data-element="errors"
            data-group="alert"
          ></ul>
          <div
            data-element="fields"
            data-stacked="false"
            className="seva-fields formkit-fields"
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              width: '100%',
              maxWidth: '100%',
              margin: '0px',
              padding: '0px',
              alignItems: 'center',
              border: '1px solid #ED64A6',
              borderRadius: '4px',
            }}
          >
            <div className="formkit-field">
              <input
                className="formkit-input"
                aria-label="First Name"
                name="fields[first_name]"
                required=""
                placeholder="First Name"
                type="text"
                style={{
                  color: 'rgb(0, 0, 0)',
                  borderColor: 'rgb(237, 100, 166)',
                  borderRight: '1px solid #ED64A6',
                  fontWeight: 400,
                  padding: '1ch 2ch',
                  borderRadius: '4px 0px 0px 4px',
                  width: '100%',
                }}
              />
            </div>
            <div className="formkit-field" style={{ borderRadius: 0 }}>
              <input
                className="formkit-input"
                name="email_address"
                aria-label="Email Address"
                placeholder="Email Address"
                required=""
                type="email"
                style={{
                  color: 'rgb(0, 0, 0)',
                  borderColor: 'rgb(237, 100, 166)',
                  borderRadius: '0',
                  padding: '1ch 2ch',
                  fontWeight: 400,
                  minWidth: '30ch',
                }}
              />
            </div>
            <button
              data-element="submit"
              className="formkit-submit formkit-submit"
              style={{
                color: 'rgb(255, 255, 255)',
                backgroundColor: 'rgb(237, 100, 166)',
                borderRadius: '0px',
                padding: '1ch 8ch',
                fontWeight: 400,
              }}
            >
              <div className="formkit-spinner">
                <div></div>
                <div></div>
                <div></div>
              </div>
              <span className="">I&apos;m in!</span>
            </button>
          </div>
        </div>
      </form>
    </Flex>
  );
};

SubscriptionForm.propTypes = {
  tags: PropTypes.arrayOf(
    PropTypes.oneOfType([PropTypes.shape({}), PropTypes.string])
  ),
};

export default SubscriptionForm;
