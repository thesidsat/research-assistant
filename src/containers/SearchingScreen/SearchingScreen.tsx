import React, { useEffect } from 'react';
import MainScreen from "../MainScreen/MainScreen";
import { Box, Card, CardActionArea, CardContent, Typography, Chip } from '@mui/material';
import { useFetchResearchPapersData } from '../../hooks/useFetchResearchPapersData';
import { ResearchPaper } from '../types/types';
import { useLocation, useNavigate } from 'react-router-dom';
import { useRecoilState } from "recoil";
import { textState } from "../../recoils";

export default function SearchingScreen() {
    const location = useLocation();
    const { searchTerm } = location.state || { searchTerm: '' };

    const { data: papers, loading, error } = useFetchResearchPapersData(searchTerm, true);
    const [searchTermInput, setSearchTermInput] = React.useState('');
    const [mainText, setMainText] = useRecoilState(textState);
    const navigate = useNavigate();

    const allPapers = papers.filter(paper =>
        paper.title.toLowerCase().includes(searchTermInput.toLowerCase())
    );
    
    console.log(allPapers);

    useEffect(() => {
        setMainText("Summaries of articles:");
    }, [papers]);

    if (loading) {
        return <Typography variant="h6" textAlign="center">Searching...</Typography>;
    }

    if (error) {
        return <Typography variant="h6" color="error" textAlign="center">{error}</Typography>;
    }

    const handlePaperClick = (paper: ResearchPaper) => {
        navigate('/summarized', { state: { paper } });
    };

    return (
        <MainScreen text="Searching...">
            <Box display="flex" flexDirection="column" alignItems="flex-start" sx={{ padding: 2 }}>
                {allPapers.length > 0 ? (
                    allPapers.map((paper: ResearchPaper) => (
                        <Card key={paper.id} sx={{ maxWidth: '90%', margin: 2 }}>
                            <CardActionArea onClick={() => handlePaperClick(paper)}>
                                <CardContent>
                                    <Box display="flex" flexDirection="column">
                                        <Box display="flex" alignItems="center" mb={1}>
                                            <Chip
                                                color="default"
                                                label={`Research paper: ${paper.title}`}
                                                sx={{ backgroundColor: 'black', color: 'white', marginRight: 1 }}
                                            />
                                        </Box>
                                        <Typography variant="body2">
                                            {typeof paper.summary === 'string'
                                                ? (paper.summary.length > 50 ? `${paper.summary.substring(0, 350)}...` : paper.summary)
                                                : (paper.summary["Main Objective"] || "No summary available")}
                                        </Typography>
                                    </Box>
                                </CardContent>
                            </CardActionArea>
                        </Card>
                    ))
                ) : (
                    <Typography variant="body2" textAlign="center"></Typography>
                )}
            </Box>
        </MainScreen>
    );
}
