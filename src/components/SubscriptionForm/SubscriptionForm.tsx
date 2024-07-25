import Script from 'next/script';

import Button from '@components/Button';

type SubscriptionFormProps = {
  tags?: string[];
};

const SubscriptionForm: React.FC<SubscriptionFormProps> = ({ tags: _ }) => {
  return (
    <div className="flex flex-col gap-2">
      <Script src="https://f.convertkit.com/ckjs/ck.5.js" />
      <form
        action="https://app.convertkit.com/forms/3923746/subscriptions"
        className="seva-form formkit-form"
        method="post"
        data-sv-form="3923746"
        data-uid="be6a97481a"
        data-format="inline"
        data-version="5"
        data-options={`{"settings":{"after_subscribe":{"action":"message","success_message":"Success! Now check your email to confirm your subscription.","redirect_url":""},"analytics":{"google":null,"fathom":"${process.env.NEXT_PUBLIC_FATHOM_ID}","facebook":null,"segment":null,"pinterest":null,"sparkloop":null,"googletagmanager":null},"modal":{"trigger":"timer","scroll_percentage":null,"timer":5,"devices":"all","show_once_every":15},"powered_by":{"show":true,"url":"https://convertkit.com/features/forms?utm_campaign=poweredby&amp;utm_content=form&amp;utm_medium=referral&amp;utm_source=dynamic"},"recaptcha":{"enabled":false},"return_visitor":{"action":"custom_content","custom_content":"Thanks for subscribing!"},"slide_in":{"display_in":"bottom_right","trigger":"timer","scroll_percentage":null,"timer":5,"devices":"all","show_once_every":15},"sticky_bar":{"display_in":"top","trigger":"timer","scroll_percentage":null,"timer":5,"devices":"all","show_once_every":15}},"version":"5"}`}
        min-width="400 500 600 700 800"
        style={{ width: '100%' }}
      >
        <div data-style="clean">
          <ul
            className="formkit-alert formkit-alert-error"
            data-element="errors"
            data-group="alert"
          ></ul>
          <div
            className="seva-fields formkit-fields grid w-full items-center rounded md:grid-cols-3"
            data-element="fields"
            data-stacked="false"
          >
            <input
              className="formkit-input h-10 w-full grow rounded-b-none rounded-t border border-b-0 border-solid border-pink-600 bg-white px-[2ch] py-[1ch] font-normal text-gray-950 md:rounded-l md:rounded-r-none md:border-b md:border-r-0"
              aria-label="First Name"
              name="fields[first_name]"
              required
              placeholder="First Name"
              type="text"
            />
            <input
              className="formkit-input h-10 w-full grow rounded-b-none border border-b-0 border-solid border-pink-600 bg-white px-[2ch] py-[1ch] font-normal text-gray-950 md:border-b"
              name="email_address"
              aria-label="Email Address"
              placeholder="Email Address"
              required
              type="email"
            />
            <Button
              type="submit"
              data-element="submit"
              className="formkit-submit formkit-submit padding-[1ch 2ch] h-10 grow rounded-b rounded-t-none font-normal md:rounded-l-none md:rounded-r"
            >
              <div className="formkit-spinner">
                <div></div>
                <div></div>
                <div></div>
              </div>
              <span>💌 Subscribe</span>
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default SubscriptionForm;
