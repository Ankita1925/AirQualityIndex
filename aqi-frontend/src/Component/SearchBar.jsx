import React, { useState } from "react";
import Autosuggest from "react-autosuggest";
import "../Css/AqiStyle.css";

// Example list of cities (you can expand this or fetch from API)
const cityList = ["Delhi", "Mumbai", "Bengaluru", "Pune", "Chennai", "Kolkata"];

const SearchBar = ({ onSearch }) => {
  const [value, setValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  const getSuggestions = (input) =>
    cityList.filter((city) => city.toLowerCase().includes(input.toLowerCase()));

  const onSuggestionsFetchRequested = ({ value }) => {
    setSuggestions(getSuggestions(value));
  };

  const onSuggestionsClearRequested = () => {
    setSuggestions([]);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (value.trim()) onSearch(value.trim());
  };

  const inputProps = {
    placeholder: "Enter a city (e.g., Delhi)",
    value,
    onChange: (_, { newValue }) => setValue(newValue),
  };

  return (
    <form className="search-box" onSubmit={onSubmit}>
      <Autosuggest
        suggestions={suggestions}
        onSuggestionsFetchRequested={onSuggestionsFetchRequested}
        onSuggestionsClearRequested={onSuggestionsClearRequested}
        getSuggestionValue={(suggestion) => suggestion}
        renderSuggestion={(suggestion) => <div>{suggestion}</div>}
        inputProps={inputProps}
      />
      <button className="search-btn" type="submit">
        Search
      </button>
    </form>
  );
};

export default SearchBar;
