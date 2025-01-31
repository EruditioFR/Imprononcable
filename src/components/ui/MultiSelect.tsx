import React, { useState, useRef, useEffect } from 'react';
import { X } from 'lucide-react';

interface Option {
  label: string;
  value: string;
}

interface MultiSelectProps {
  options: Option[];
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
}

export function MultiSelect({
  options,
  value,
  onChange,
  placeholder = 'Sélectionner...'
}: MultiSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSelect = (option: Option) => {
    if (!value.includes(option.value)) {
      onChange([...value, option.value]);
    }
    setIsOpen(false);
  };

  const handleRemove = (optionValue: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(value.filter(v => v !== optionValue));
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const availableOptions = options.filter(option => !value.includes(option.value));

  return (
    <div ref={containerRef} className="relative">
      <div 
        onClick={toggleDropdown}
        className="min-h-[38px] flex flex-wrap gap-2 p-2 border border-gray-300 rounded-md cursor-pointer"
      >
        {value.length === 0 && (
          <span className="text-gray-500">{placeholder}</span>
        )}
        {value.map((v) => {
          const option = options.find(o => o.value === v);
          if (!option) return null;
          
          return (
            <span
              key={v}
              className="inline-flex items-center gap-1 px-2 py-1 bg-primary-100 text-primary-800 rounded-md text-sm"
              onClick={(e) => e.stopPropagation()}
            >
              {option.label}
              <button
                onClick={(e) => handleRemove(v, e)}
                className="text-primary-600 hover:text-primary-800"
              >
                <X size={14} />
              </button>
            </span>
          );
        })}
      </div>
      
      {isOpen && availableOptions.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
          {availableOptions.map(option => (
            <button
              key={option.value}
              className="w-full px-4 py-2 text-left hover:bg-gray-100 text-sm"
              onClick={() => handleSelect(option)}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}