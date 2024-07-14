import {ResearchPaperSummaries} from "../containers/types/types";
import {useEffect, useState} from "react";

export const useFetchResearchPapersData = (searchTerm: string, shouldFetch: boolean) => {
    const [data, setData] = useState<ResearchPaperSummaries>({ results: [] });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch('http://localhost:3001/proxy', {
                    method: 'POST',
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ query: searchTerm, max_results: 2 })
                });

                // if (!response.ok) {
                //     const errorText = await response.text();
                //     console.error(`Network response was not ok: ${errorText}`);
                //     return;
                // }

                const json: ResearchPaperSummaries = await response.json();
                console.log("json", json);
                setData(json);
            } catch (error) {
                // console.error("Error fetching data:", error);
                // setError('Failed to fetch data');
                // setData({ results: [] });
            } finally {
                setLoading(false);
            }
        };

        if (shouldFetch) {
            fetchData();
        }
    }, [searchTerm, shouldFetch]);

    return { data: data.results, loading, error };
};
