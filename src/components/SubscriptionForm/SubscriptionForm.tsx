import Script from 'next/script';
import { Button, Input, SimpleGrid } from '@chakra-ui/react';

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
          <SimpleGrid
            columns={[1, 1, 3]}
            data-element="fields"
            data-stacked="false"
            className="seva-fields formkit-fields"
            flexDir={['column', 'column', 'row']}
            width="100%"
            alignItems={'center'}
            // border="1px solid #ED64A6"
            borderRadius="4px"
          >
            <Input
              className="formkit-input border-pink-400"
              backgroundColor="white"
              aria-label="First Name"
              name="fields[first_name]"
              required
              placeholder="First Name"
              type="text"
              border={`1px solid`}
              borderRadius={[
                '4px 4px 0px 0px',
                '4px 4px 0px 0px',
                '4px 0px 0px 4px',
              ]}
              borderBottomWidth={[0, 0, '1px']}
              color="rgb(0, 0, 0)"
              fontWeight={400}
              padding="1ch 2ch"
              width="100%"
              flexGrow={1}
            />
            <Input
              className="formkit-input"
              backgroundColor="white"
              name="email_address"
              aria-label="Email Address"
              placeholder="Email Address"
              required
              type="email"
              color="rgb(0, 0, 0)"
              borderColor="rgb(237, 100, 166)"
              borderRadius="0"
              padding="1ch 2ch"
              fontWeight={400}
              width="100%"
              flexGrow={2}
            />
            <Button
              type="submit"
              data-element="submit"
              className="formkit-submit formkit-submit"
              borderRadius={['0 0 4px 4px', '0 0 4px 4px', '0px 4px 4px 0px']}
              style={{
                color: 'rgb(255, 255, 255)',
                backgroundColor: 'rgb(237, 100, 166)',

                padding: '1ch 2ch',
                fontWeight: 400,
                flexGrow: 1,
              }}
            >
              <div className="formkit-spinner">
                <div></div>
                <div></div>
                <div></div>
              </div>
              <span className="">💌 Subscribe</span>
            </Button>
          </SimpleGrid>
        </div>
      </form>
    </div>
  );
};

export default SubscriptionForm;
