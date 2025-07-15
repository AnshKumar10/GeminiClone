import { useState, useEffect } from "react";

export interface Country {
  name: {
    common: string;
    official: string;
    nativeName?: {
      [languageCode: string]: {
        official: string;
        common: string;
      };
    };
  };
  cca2: string;
  idd: {
    root: string;
    suffixes?: string[];
  };
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

        const data: Country[] = await response.json();

        const formattedCountries = data
          .filter(
            (country) => country.idd?.root && country.idd?.suffixes?.length
          )
          .sort((a, b) => a.name.common.localeCompare(b.name.common));

        setCountries(formattedCountries);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");

        // Fallback countries
        setCountries([
          {
            name: {
              common: "United States",
              official: "United States of America",
              nativeName: {
                eng: {
                  official: "United States of America",
                  common: "United States",
                },
              },
            },
            cca2: "US",
            idd: { root: "+1", suffixes: [""] },
            flag: "🇺🇸",
          },
          {
            name: {
              common: "United Kingdom",
              official: "United Kingdom of Great Britain and Northern Ireland",
              nativeName: {
                eng: {
                  official:
                    "United Kingdom of Great Britain and Northern Ireland",
                  common: "United Kingdom",
                },
              },
            },
            cca2: "GB",
            idd: { root: "+44", suffixes: [""] },
            flag: "🇬🇧",
          },
          {
            name: {
              common: "India",
              official: "Republic of India",
              nativeName: {
                hin: {
                  official: "भारत गणराज्य",
                  common: "भारत",
                },
                eng: {
                  official: "Republic of India",
                  common: "India",
                },
              },
            },
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
