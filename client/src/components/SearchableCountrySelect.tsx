import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search, Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const COUNTRIES = [
  "United States", "United Kingdom", "Canada", "Australia", "Germany", "France", "Italy", "Spain",
  "Netherlands", "Belgium", "Switzerland", "Austria", "Sweden", "Norway", "Denmark", "Finland",
  "Poland", "Portugal", "Greece", "Ireland", "Czech Republic", "Romania", "Hungary", "Bulgaria",
  "Croatia", "Slovakia", "Slovenia", "Estonia", "Latvia", "Lithuania", "Luxembourg", "Malta",
  "Cyprus", "Japan", "China", "India", "South Korea", "Singapore", "Malaysia", "Thailand",
  "Indonesia", "Philippines", "Vietnam", "Hong Kong", "Taiwan", "New Zealand", "South Africa",
  "Egypt", "Nigeria", "Kenya", "Morocco", "Ghana", "United Arab Emirates", "Saudi Arabia",
  "Israel", "Turkey", "Brazil", "Mexico", "Argentina", "Chile", "Colombia", "Peru", "Venezuela",
  "Russia", "Ukraine", "Kazakhstan", "Belarus", "Georgia", "Armenia", "Azerbaijan", "Bangladesh",
  "Pakistan", "Sri Lanka", "Nepal", "Myanmar", "Cambodia", "Laos", "Mongolia", "Afghanistan",
  "Iraq", "Iran", "Jordan", "Lebanon", "Qatar", "Kuwait", "Bahrain", "Oman", "Yemen",
  "Tunisia", "Algeria", "Libya", "Sudan", "Ethiopia", "Tanzania", "Uganda", "Rwanda",
  "Zimbabwe", "Botswana", "Namibia", "Mozambique", "Angola", "Zambia", "Malawi", "Madagascar",
  "Mauritius", "Seychelles", "Other"
].sort();

interface SearchableCountrySelectProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  id?: string;
}

export default function SearchableCountrySelect({
  value,
  onChange,
  placeholder = "Search your country...",
  disabled = false,
  className,
  id,
}: SearchableCountrySelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCountries = useMemo(() => {
    if (!searchTerm) return COUNTRIES;
    const search = searchTerm.toLowerCase();
    return COUNTRIES.filter((country) =>
      country.toLowerCase().includes(search)
    );
  }, [searchTerm]);

  const selectedCountry = COUNTRIES.find((c) => c === value);

  return (
    <div className="relative">
      <button
        type="button"
        id={id}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={cn(
          "flex h-10 w-full items-center justify-between rounded-md border border-primary/20 bg-black/40 px-3 py-2 text-sm text-foreground ring-offset-background transition-all",
          "focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "hover:border-primary/30",
          className
        )}
      >
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <Search className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
          <span className={cn(
            "truncate",
            !selectedCountry && "text-muted-foreground"
          )}>
            {selectedCountry || placeholder}
          </span>
        </div>
        <ChevronDown className={cn(
          "h-4 w-4 shrink-0 text-muted-foreground transition-transform",
          isOpen && "rotate-180"
        )} />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute z-50 mt-1 w-full rounded-md border border-primary/20 bg-black/95 shadow-lg backdrop-blur-xl">
            <div className="p-2 border-b border-primary/10">
              <Input
                type="text"
                placeholder="Type to search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-8 bg-black/40 border-primary/20 text-sm"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === "Escape") {
                    setIsOpen(false);
                    setSearchTerm("");
                  }
                }}
              />
            </div>
            <div className="max-h-[300px] overflow-y-auto p-1">
              {filteredCountries.length === 0 ? (
                <div className="px-3 py-2 text-sm text-muted-foreground text-center">
                  No countries found
                </div>
              ) : (
                filteredCountries.map((country) => (
                  <button
                    key={country}
                    type="button"
                    onClick={() => {
                      onChange(country);
                      setIsOpen(false);
                      setSearchTerm("");
                    }}
                    className={cn(
                      "w-full flex items-center gap-2 px-3 py-2 rounded-sm text-sm text-left transition-colors",
                      "hover:bg-primary/20 hover:text-primary",
                      "focus:bg-primary/20 focus:text-primary focus:outline-none",
                      value === country && "bg-primary/10 text-primary"
                    )}
                  >
                    {value === country && (
                      <Check className="h-4 w-4 shrink-0" />
                    )}
                    <span className={cn(
                      value === country && "font-semibold"
                    )}>
                      {country}
                    </span>
                  </button>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

