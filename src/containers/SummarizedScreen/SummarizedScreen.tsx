import React from 'react';
import MainScreen from "../MainScreen/MainScreen";
import { Box, Card, CardContent, Typography, Chip } from '@mui/material';
import { useLocation } from 'react-router-dom';
import { ResearchPaper } from '../types/types';
import './SummarizedScreen.css'; // Import the CSS file for styles

export default function SummarizedScreen() {
    const location = useLocation();
    const { paper }: { paper: ResearchPaper } = location.state || { paper: null };

    if (!paper) {
        return <Typography variant="h6" color="error" textAlign="center">No paper data available.</Typography>;
    }

    const isSummaryObject = (summary: any): summary is {
        "Main Objective": string;
        "Key Innovation": string;
        Methodology: string;
        "Principal Findings": string;
        "Implications for the Field": string;
    } => {
        return typeof summary === 'object' && summary !== null;
    };

    return (
        <MainScreen text={paper.title}>
            <Box className="summarized-screen" sx={{ padding: 2, overflowY: 'auto' }}>
                <Card sx={{ maxWidth: '90%', margin: 2 }}>
                    <CardContent>
                        <Box display="flex" flexDirection="column" textAlign="left">
                            <Typography variant="body1" sx={{ marginBottom: 1 }}>
                                <strong>Authors:</strong> {paper.authors}
                            </Typography>
                            <Typography variant="body1" sx={{ marginBottom: 1 }}>
                                <strong>Published:</strong> {paper.published}
                            </Typography>

                            <Typography variant="body1" sx={{ marginBottom: 1 }}>
                                <strong>Main Objective:</strong>
                                {isSummaryObject(paper.summary) ? paper.summary["Main Objective"] : paper.summary}
                            </Typography>

                            <Typography variant="body1" sx={{ marginBottom: 1 }}>
                                <strong>Key Innovation:</strong>
                                {isSummaryObject(paper.summary) ? paper.summary["Key Innovation"] : "N/A"}
                            </Typography>

                            <Typography variant="body1" sx={{ marginBottom: 1 }}>
                                <strong>Methodology:</strong>
                                {isSummaryObject(paper.summary) ? paper.summary["Methodology"] : "N/A"}
                            </Typography>

                            <Typography variant="body1" sx={{ marginBottom: 1 }}>
                                <strong>Principal Findings:</strong>
                                {isSummaryObject(paper.summary) ? paper.summary["Principal Findings"] : "N/A"}
                            </Typography>

                            <Typography variant="body1" sx={{ marginBottom: 1 }}>
                                <strong>Implications for the Field:</strong>
                                {isSummaryObject(paper.summary) ? paper.summary["Implications for the Field"] : "N/A"}
                            </Typography>
                        </Box>
                    </CardContent>
                </Card>
            </Box>
        </MainScreen>

        //to use manupilation of the data for the Key Innovation etc, it is broken.
    // <MainScreen text={paper.title}>
    //     <Box className="summarized-screen" sx={{ padding: 2, overflowY: 'auto' }}>
    //         <Card sx={{ maxWidth: '90%', margin: 2 }}>
    //             <CardContent>
    //                 <Box display="flex" flexDirection="column" textAlign="left">
    //                     <Box display="flex" alignItems="center" mb={1}>
    //                         <Chip
    //                             color="default"
    //                             label={`Research paper: ${paper.title}`}
    //                             sx={{ backgroundColor: 'black', color: 'white', marginRight: 1 }}
    //                         />
    //                     </Box>
    //                     <Typography variant="body1" sx={{ marginBottom: 1 }}>
    //                         <strong>Authors:</strong> {paper.authors}
    //                     </Typography>
    //                     <Typography variant="body1" sx={{ marginBottom: 1 }}>
    //                         <strong>Published:</strong> {paper.published}
    //                     </Typography>
    //
    //                     <Typography variant="body1" sx={{ marginBottom: 1 }}>
    //                         <strong>Main Objective:</strong>
    //                         {summaryData["Main Objective"] || "N/A"}
    //                     </Typography>
    //
    //                     <Typography variant="body1" sx={{ marginBottom: 1 }}>
    //                         <strong>Key Innovation:</strong>
    //                         {summaryData["Key Innovation"] || "N/A"}
    //                     </Typography>
    //
    //                     <Typography variant="body1" sx={{ marginBottom: 1 }}>
    //                         <strong>Methodology:</strong>
    //                         {summaryData.Methodology || "N/A"}
    //                     </Typography>
    //
    //                     <Typography variant="body1" sx={{ marginBottom: 1 }}>
    //                         <strong>Principal Findings:</strong>
    //                         {summaryData["Principal Findings"] || "N/A"}
    //                     </Typography>
    //
    //                     <Typography variant="body1" sx={{ marginBottom: 1 }}>
    //                         <strong>Implications for the Field:</strong>
    //                         {summaryData["Implications for the Field"] || "N/A"}
    //                     </Typography>
    //                 </Box>
    //             </CardContent>
    //         </Card>
    //     </Box>
    // </MainScreen>
    );
}
