import "./searchbar-styles.css";

import { BiSearch } from "react-icons/bi";
function SearchBar(props) {

    const handleKeyPress = (event) => {
        if (event.key === "Enter") {
          props.search(); // Call the search function when Enter key is pressed
        }
      };

  return (
   
      <div className="form-group">
        <input
          className="search-bar"
          type="text"
          id="searchBar"
          placeholder="What do you want to listen to?"
          onKeyDown={handleKeyPress}
          onChange={props.searchInput}
        />
        <button onClick={props.search} className="btn">
          {" "}
          <BiSearch className="search-icon" />
        </button>
      </div>
 
  );
}

export default SearchBar;
