import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { Button, Flex, Input, useTheme } from '@chakra-ui/react';

import { useAnalytics } from '../../utils/analytics';
import ACTIONS from '../../utils/analytics-actions';

import * as classes from './SubscriptionForm.module.scss';

import convertKitTags from '../../data/ConvertKitTags';

const SubscriptionForm = ({ tags }) => {
  const trackAction = useAnalytics();
  const theme = useTheme();

  const [status, setStatus] = useState(null);
  const FORM_ID = '1368838';
  const SUBFORM_ID = '8939';
  const FORM_URL = `https://app.convertkit.com/forms/${FORM_ID}/subscriptions`;

  const tagMap = convertKitTags.reduce((result, tag) => {
    result[tag.name] = tag.id;
    return result;
  }, {});

  const logNewsletterEvent = ({ email, name, result, log }) => {
    // send a request to our serverless API to log the event
    fetch('/api/newsletterSignup', {
      method: 'POST',
      body: JSON.stringify({
        email,
        name,
        result,
        log,
      }),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    // get email address and first name from formData
    const email = formData.get('email_address');
    const name = formData.get('fields[first_name]');

    try {
      trackAction(ACTIONS.NEWSLETTER_SUBSCRIPTION);

      const response = await fetch(FORM_URL, {
        method: 'post',
        body: formData,
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const json = await response.json();

      if (json.status === 'success') {
        logNewsletterEvent({
          email,
          name,
          result: json.status,
          log: json,
        });
        setStatus('SUCCESS');
        return;
      }

      logNewsletterEvent({
        email,
        name,
        result: json.status,
        log: json,
      });
      setStatus('ERROR');
    } catch (err) {
      logNewsletterEvent({
        email,
        name,
        result: json.status,
        log: json,
      });
      setStatus('ERROR');
    }
  };

  return (
    <form
      className={classes.subscriptionFormEmbed}
      onSubmit={handleSubmit}
      action={FORM_URL}
      method="post"
    >
      <Flex>
        <Input
          type="text"
          aria-label="Your first name"
          name="fields[first_name]"
          placeholder="First name"
          required
          borderRadius="4px"
          borderColor={theme.colors.pink[400]}
          borderRight="0"
          borderRightRadius="0"
          flexGrow="1"
        />
        <Input
          type="email"
          aria-label="Your email"
          name="email_address"
          placeholder="Your email address"
          required
          borderColor={theme.colors.pink[400]}
          borderRadius="0"
          flexGrow="2"
        />
        <Button
          type="submit"
          flexGrow="2"
          borderLeftRadius="0"
          background="linear-gradient(180deg,#fe5186,#fe4156)"
          color={theme.colors.white}
          _hover={{
            color: theme.colors.black,
            background: theme.colors.gray[400],
          }}
          width="45%"
        >
          {"I'm in!"}
        </Button>
      </Flex>
      {tags &&
        tags.map((tag) => {
          const tagName = tag.name || tag;

          // if we don't have this tag in convertkit, do nothing
          if (!tagMap[tagName]) return null;

          return (
            <input
              data-tag-name={tagName}
              key={tagMap[tagName]}
              id={`tag-${SUBFORM_ID}-${tagMap[tagName]}`}
              type="checkbox"
              style={{ display: 'none' }}
              checked
              readOnly
              name="tags[]"
              value={tagMap[tagName]}
            />
          );
        })}

      {status === 'SUCCESS' && (
        <p>Check your inbox to confirm your subscription!</p>
      )}
      {status === 'ERROR' && <p>Something went wrong, please try again.</p>}
    </form>
  );
};

SubscriptionForm.propTypes = {
  tags: PropTypes.arrayOf(
    PropTypes.oneOfType([PropTypes.shape({}), PropTypes.string])
  ),
};

export default SubscriptionForm;
