import React, { useState, useRef } from 'react';
import MainScreen from "../MainScreen/MainScreen";
import { Box, Card, CardContent, Typography, IconButton } from '@mui/material';
import { useLocation } from 'react-router-dom';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import StopIcon from '@mui/icons-material/Stop';
import { ResearchPaper } from '../types/types';
import './SummarizedScreen.css';

export default function SummarizedScreen() {
    const location = useLocation();
    const { paper }: { paper: ResearchPaper } = location.state || { paper: null };

    const audioRef = useRef<HTMLAudioElement>(new Audio("/voice-example.mp3"));
    const [isPlaying, setIsPlaying] = useState(false);

    if (!paper) {
        return <Typography variant="h6" color="error" textAlign="center">No paper data available.</Typography>;
    }

    const toggleAudio = () => {
        if (isPlaying) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
        } else {
            audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
    };

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
                        </Box>
                        <img src="/didi.jpeg" alt="didi" height="100" onClick={toggleAudio} />
                    </CardContent>
                </Card>
            </Box>
        </MainScreen>
    );
}
