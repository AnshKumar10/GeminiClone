import { useState, useEffect } from "react";

export interface Country {
  name: { common: string };
  cca2: string;
  idd: { root: string; suffixes?: string[] };
  flag: string;
}

export const useCountries = () => {
  const [countries, setCountries] = useState<Country[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          "https://restcountries.com/v3.1/all?fields=name,cca2,idd,flag"
        );

        if (!response.ok) {
          throw new Error("Failed to fetch countries");
        }

        const data = await response.json();

        const formattedCountries: Country[] = data
          .filter((country) => country.idd?.root && country.idd?.suffixes?.[0])
          .map((country) => ({
            name: { common: country.name.common },
            cca2: country.cca2,
            idd: {
              root: country.idd.root,
              suffixes: country.idd.suffixes,
            },
            flag: country.flag,
          }))
          .sort((a: Country, b: Country) =>
            a.name.common.localeCompare(b.name.common)
          );

        setCountries(formattedCountries);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
        // Fallback data
        setCountries([
          {
            name: { common: "United States" },
            cca2: "US",
            idd: { root: "+1", suffixes: [""] },
            flag: "🇺🇸",
          },
          {
            name: { common: "United Kingdom" },
            cca2: "GB",
            idd: { root: "+44", suffixes: [""] },
            flag: "🇬🇧",
          },
          {
            name: { common: "India" },
            cca2: "IN",
            idd: { root: "+91", suffixes: [""] },
            flag: "🇮🇳",
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCountries();
  }, []);

  return { countries, isLoading, error };
};
