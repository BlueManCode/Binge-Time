import React from 'react';
import ShowCard from './ShowCard';
import './css/SuggestionPanel.css';

const SuggestionPanel = ({ title, data }) => {
  return (
    <div
      className="inner-container"
      style={{
        width: '100%',
        marginTop: '10px',
      }}>
      <span> {title} </span>{' '}
      <div className="showcase">
        {' '}
        {data.map((item, key) => (
          <ShowCard key={key} data={item} />
        ))}{' '}
      </div>{' '}
    </div>
  );
};

export default SuggestionPanel;
