import { Search } from 'lucide-react';
import React from 'react'

const SearchBar = ({ hundle ,searchTerm}) => {
  return (
    <div className="relative max-w-2xl">
      <Search
        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400"
        size={20}
      />
      <input
        type="text"
        placeholder="البحث برقم الشاسيه، نوع السيارة، اسم المالك أو رقم الهاتف..."
        value={searchTerm}
        onChange={(e) => hundle(e.target.value)}
        className="w-full pr-12 pl-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
      />
    </div>
  );
};

export default SearchBar
