import React from 'react';
import { Search } from 'lucide-react';

const SearchBar = ({ searchTerm, setSearchTerm, filterType, setFilterType }) => {
    return (
        <div className="search-bar">
            <div className="search-input-wrapper">
                <Search className="search-icon" size={20} />
                <input
                    type="text"
                    placeholder="Cerca prodotti..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
            >
                <option value="all">Tutti i prodotti</option>
                <option value="seeds">Semi</option>
                <option value="plant">Piante</option>
                <option value="tool">Attrezzi</option>
                <option value="accessory">Accessori</option>
            </select>
        </div>
    );
};

export default SearchBar;

