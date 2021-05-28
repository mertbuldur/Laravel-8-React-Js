import React from 'react';

export default ({ data , field = "text" }) => <div dangerouslySetInnerHTML={{ __html: data[field] }}/>;