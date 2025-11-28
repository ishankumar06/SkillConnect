import React, { useState } from "react";
import Input from "./ui/Input";
import Button from "./ui/Button";
import { Search } from "lucide-react";

export default function SearchBar({ onSearch }) {
  const [query, setQuery] = useState("");

  const handleSearch = () => {
    if (onSearch) {
      onSearch(query);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="w-full flex gap-2 mb-4 rounded-lg p-2 shadow-md">
      <Input
        placeholder="Search by location , skill , job"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        className="flex-grow w-full bg-[#403d41]" // make input take full width within flex container
      />
      <Button onClick={handleSearch} aria-label="Search">
        <Search size={20} />
      </Button>
    </div>
  );
}
