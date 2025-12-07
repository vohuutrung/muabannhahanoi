import { useState, useRef, useEffect } from "react";
import { MapPin, Home, Building } from "lucide-react";
import { HANOI_DISTRICTS, PROPERTY_TYPES } from "@/types/property";
import { cn } from "@/lib/utils";

interface SearchAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  onSelect: (type: "district" | "propertyType", value: string) => void;
  onKeyDown?: (e: React.KeyboardEvent) => void;
  placeholder?: string;
  className?: string;
}

interface Suggestion {
  type: "district" | "propertyType";
  value: string;
  label: string;
}

export function SearchAutocomplete({
  value,
  onChange,
  onSelect,
  onKeyDown,
  placeholder,
  className,
}: SearchAutocompleteProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Filter suggestions based on input
  useEffect(() => {
    if (!value.trim()) {
      setSuggestions([]);
      setIsOpen(false);
      return;
    }

    const query = value.toLowerCase().trim();
    const filtered: Suggestion[] = [];

    // Filter districts (skip "all")
    HANOI_DISTRICTS.filter((d) => d.value !== "all").forEach((district) => {
      if (district.label.toLowerCase().includes(query)) {
        filtered.push({
          type: "district",
          value: district.value,
          label: district.label,
        });
      }
    });

    // Filter property types (skip "all")
    PROPERTY_TYPES.filter((p) => p.value !== "all").forEach((propType) => {
      if (propType.label.toLowerCase().includes(query)) {
        filtered.push({
          type: "propertyType",
          value: propType.value,
          label: propType.label,
        });
      }
    });

    setSuggestions(filtered.slice(0, 8));
    setIsOpen(filtered.length > 0);
    setActiveIndex(-1);
  }, [value]);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || suggestions.length === 0) {
      onKeyDown?.(e);
      return;
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setActiveIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : prev));
        break;
      case "ArrowUp":
        e.preventDefault();
        setActiveIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case "Enter":
        e.preventDefault();
        if (activeIndex >= 0 && suggestions[activeIndex]) {
          handleSelect(suggestions[activeIndex]);
        } else {
          onKeyDown?.(e);
        }
        break;
      case "Escape":
        setIsOpen(false);
        setActiveIndex(-1);
        break;
      default:
        onKeyDown?.(e);
    }
  };

  const handleSelect = (suggestion: Suggestion) => {
    onSelect(suggestion.type, suggestion.value);
    onChange("");
    setIsOpen(false);
    setActiveIndex(-1);
  };

  return (
    <div ref={wrapperRef} className="relative flex-1">
      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground z-10" />
      <input
        ref={inputRef}
        type="text"
        placeholder={placeholder}
        className={cn("input-search pl-10", className)}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        onFocus={() => value.trim() && suggestions.length > 0 && setIsOpen(true)}
      />
      
      {/* Autocomplete Dropdown */}
      {isOpen && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-lg shadow-lg z-50 overflow-hidden">
          <ul className="py-1 max-h-64 overflow-y-auto">
            {suggestions.map((suggestion, index) => (
              <li key={`${suggestion.type}-${suggestion.value}`}>
                <button
                  type="button"
                  className={cn(
                    "w-full px-4 py-2.5 flex items-center gap-3 text-left transition-colors",
                    "hover:bg-accent",
                    activeIndex === index && "bg-accent"
                  )}
                  onClick={() => handleSelect(suggestion)}
                  onMouseEnter={() => setActiveIndex(index)}
                >
                  {suggestion.type === "district" ? (
                    <MapPin className="w-4 h-4 text-muted-foreground shrink-0" />
                  ) : (
                    <Building className="w-4 h-4 text-muted-foreground shrink-0" />
                  )}
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-foreground">
                      {suggestion.label}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {suggestion.type === "district" ? "Quận/Huyện" : "Loại nhà đất"}
                    </span>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
