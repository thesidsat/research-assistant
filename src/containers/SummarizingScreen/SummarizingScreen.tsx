import React, { useState } from 'react';
import { Box, Card, CardActionArea, CardContent, Typography, Chip, TextField } from '@mui/material';
import { useFetchResearchPapersData } from '../../hooks/useFetchResearchPapersData';
// import { ResearchPaperSummary } from '../types/types';
import { useNavigate } from 'react-router-dom';

export default function SearchingScreen() {
    
    const { data: papers, loading, error } = useFetchResearchPapersData("something", true);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    const filteredPapers = papers.filter(paper =>
        paper.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // const handlePaperClick = (paper: ResearchPaperSummary) => {
    //     navigate('/summarizing', { state: { paper } });
    // };

    if (loading) {
        return <Typography variant="h6" textAlign="center">Loading...</Typography>;
    }

    if (error) {
        return <Typography variant="h6" color="error" textAlign="center">{error}</Typography>;
    }

    return (
        <Box display="flex" flexDirection="column" alignItems="flex-start" sx={{ padding: 2 }}>
            <TextField
                label="Search"
                variant="outlined"
                fullWidth
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                sx={{ mb: 2 }}
            />

            {/*{filteredPapers.map((paper: ResearchPaperSummary) => (*/}
            {/*    // <Card key={paper.id} sx={{maxWidth: '90%', margin: 2}}>*/}
            {/*    //     <CardActionArea onClick={() => handlePaperClick(paper)}>*/}
            {/*    //         <CardContent>*/}
            {/*    //             <Box display="flex" flexDirection="column">*/}
            {/*    //                 <Box display="flex" alignItems="center" mb={1}>*/}
            {/*    //                     <Chip*/}
            {/*    //                         color="default"*/}
            {/*    //                         label={`Research paper: ${paper.title}`}*/}
            {/*    //                         sx={{backgroundColor: 'black', color: 'white', marginRight: 1}}*/}
            {/*    //                     />*/}
            {/*    //                 </Box>*/}
            {/*    //                 <Typography variant="body2">*/}
            {/*    //                     {paper.summary.substring(0, 50)}...*/}
            {/*    //                 </Typography>*/}
            {/*    //             </Box>*/}
            {/*    //         </CardContent>*/}
            {/*    //     </CardActionArea>*/}
            {/*    // </Card>*/}
            {/*))}*/}
        </Box>
    );
}
