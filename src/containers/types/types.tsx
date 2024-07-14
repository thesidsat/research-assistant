export interface ResearchPaper {
    id: string;
    title: string;
    authors: string;
    published: string;
    summary: string | {
        "Main Objective": string;
        "Key Innovation": string;
        Methodology: string;
        "Principal Findings": string;
        "Implications for the Field": string;
    };
}

export interface ResearchPaperSummaries {
    results: ResearchPaper[];
}
// types/types.ts

export interface Summary {
    "Main Objective": string;
    "Key Innovation": string;
    Methodology: string;
    "Principal Findings": string;
    "Implications for the Field": string;
}

export interface ResearchPaper {
    id: string;
    title: string;
    authors: string;
    published: string;
    summary: string | Summary; // Allow summary to be a string or a structured Summary
}


