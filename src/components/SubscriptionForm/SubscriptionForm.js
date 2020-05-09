import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useStaticQuery, graphql } from 'gatsby';

import { useAnalytics } from '../../utils/analytics';
import ACTIONS from '../../utils/analytics-actions';

import classes from './SubscriptionForm.module.css';

const SubscriptionForm = ({ tags }) => {
  const trackAction = useAnalytics();

  const [status, setStatus] = useState(null);
  const FORM_ID = '1368838';
  const SUBFORM_ID = '8939';
  const FORM_URL = `https://app.convertkit.com/forms/${FORM_ID}/subscriptions`;

  const data = useStaticQuery(graphql`
    query {
      allConvertkitTagYaml {
        nodes {
          name
          id
        }
      }
    }
  `);

  const allTags = data.allConvertkitTagYaml.nodes;
  const tagMap = allTags.reduce((result, tag) => {
    result[tag.name] = tag.id;
    return result;
  }, {});

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    try {
      trackAction(ACTIONS.NEWSLETTER_SUBSCRIPTION);
      const response = await fetch(FORM_URL, {
        method: 'post',
        body: formData,
        headers: {
          accept: 'application/json',
        },
      });

      const json = await response.json();

      if (json.status === 'success') {
        setStatus('SUCCESS');
        return;
      }

      setStatus('ERROR');
    } catch (err) {
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
      <input
        type="text"
        aria-label="Your first name"
        name="fields[first_name]"
        placeholder="First name"
        required
      />
      <input
        type="email"
        aria-label="Your email"
        name="email_address"
        placeholder="Your email address"
        required
      />

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
              name="tags[]"
              value={tagMap[tagName]}
            />
          );
        })}

      <button type="submit">I'm in!</button>
      {status === 'SUCCESS' && (
        <p>Check your inbox to confirm your subscription!</p>
      )}
      {status === 'ERROR' && <p>Something went wrong, please try again.</p>}
    </form>
  );
};

SubscriptionForm.propTypes = {
  tags: PropTypes.arrayOf(PropTypes.shape({})),
};

export default SubscriptionForm;
