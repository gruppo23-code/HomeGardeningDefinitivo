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
                <option value="Semi">Semi</option>
                <option value="Piante">Piante</option>
                <option value="Attrezzi">Attrezzi</option>
                <option value="Accessori">Accessori</option>
            </select>
        </div>
    );
};

export default SearchBar;

