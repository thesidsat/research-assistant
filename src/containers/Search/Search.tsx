import React, { useState } from 'react';
import styles from './Search.module.css';
import { screenState } from '../../recoils';
import { useRecoilState } from "recoil";
import { useNavigate } from 'react-router-dom';
import { useFetchResearchPapersData } from "../../hooks/useFetchResearchPapersData";

const Search: React.FC = () => {
    const [isFocused, setIsFocused] = useState(false);
    const [screen, setScreen] = useRecoilState(screenState);
    const [searchTerm, setSearchTerm] = useState('');
    const [shouldFetch, setShouldFetch] = useState(false);

    const { data, loading, error } = useFetchResearchPapersData(searchTerm, shouldFetch);
    const navigate = useNavigate();

    const handleClick = (e: React.MouseEvent) => {
        e.stopPropagation();
    };

    const handleBrowse = () => {
        if (!searchTerm.trim()) return;

        setScreen('searching');
        setShouldFetch(true); // Trigger fetching data
        console.log('Searching for:', searchTerm);
        navigate('/searching', { state: { searchTerm } });
    };

    console.log("Loading:", loading);
    console.log("Error:", error);
    console.log("Data:", data);

    return (
        <div onClick={handleClick}>
            <div className={styles.searchBarContainer}>
                {!isFocused && (
                    <label htmlFor="search" className={styles.searchLabel}>
                        <i className="fa fa-search icon" aria-hidden="true"></i>
                        What is in your mind?
                    </label>
                )}
                <input
                    type="text"
                    id="search"
                    className={styles.searchBar}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button className={styles.searchButton} onClick={handleBrowse}>
                    Browse for me
                </button>
            </div>
            {error && <p>Error: {error}</p>}
        </div>
    );
};

export default Search;
