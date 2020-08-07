import React from 'react';
import { IonInput } from '@ionic/react';
import './css/SearchBar.css';

const SearchBar = ({ fetchShows, searchTerm, setSearchTerm }) => {
  return (
    <IonInput
      value={searchTerm}
      placeholder="🔍 Search..."
      className="searchBar"
      onIonChange={(e) => {
        setSearchTerm(e.detail.value);
        fetchShows();
      }}>
      {' '}
    </IonInput>
  );
};

export default SearchBar;
