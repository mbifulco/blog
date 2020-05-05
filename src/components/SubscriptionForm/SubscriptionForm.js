import React, { useState } from 'react';
import { useStaticQuery, graphql } from 'gatsby';

const SubscriptionForm = () => {
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

  const STATUS = {
    SUCCESS: 'success',
    ERROR: 'error',
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData(e.target);

    try {
      const response = await fetch(FORM_URL, {
        method: 'post',
        body: data,
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
    <form onSubmit={handleSubmit} action={FORM_URL} method="post">
      <input
        type="text"
        aria-label="Your name"
        name="fields[first_name]"
        placeholder="Your name"
        required
      />
      <input
        type="email"
        aria-label="Your email"
        name="email_address"
        placeholder="Your email address"
        required
      />

      {allTags.map((tagName) => (
        <input
          key={tagMap[tagName]}
          id={`tag-${SUBFORM_ID}-${tagMap[tagName]}`}
          type="checkbox"
          style={{ display: 'none' }}
          checked
          name="tags[]"
          value={tagMap[tagName]}
        />
      ))}

      <button type="submit">Subscribe</button>
      {status === 'SUCCESS' && (
        <p>Check your inbox to confirm your subscription!</p>
      )}
      {status === 'ERROR' && <p>Something went wrong, please try again.</p>}
    </form>
  );
};

export default SubscriptionForm;
