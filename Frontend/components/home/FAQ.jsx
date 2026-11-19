import { useState } from 'react';
import { Box, Typography, Button, Paper, Stack } from '@mui/material';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

const faqData = [
  { question: 'What is ThinkSpace?', answer: 'ThinkSpace is an all-in-one academic and productivity platform designed for student communities to write structured Markdown study notes, organize assignment deadlines on a Kanban board, and trade textbooks peer-to-peer.' },
  { question: 'What features are available for note and post management?', answer: 'You can write articles in rich Markdown, preview them live, tag topics, set visibility to Public (Feed) or Private (Personal), react with emojis, and participate in discussion threads.' },
  { question: 'How does the Task Manager work?', answer: 'The Task Manager is a full Kanban board with drag-and-drop. You can add assignments with priority flags and deadlines, and move them seamlessly between To Do, In Progress, and Completed.' },
  { question: 'How does the campus Book Marketplace work?', answer: 'Students can upload photos of textbooks, specify condition, category, and price, and list them. Other students can search, filter by subject, and contact the seller directly to buy or exchange.' },
  { question: 'Is my data and account secure?', answer: 'Yes. ThinkSpace uses industry-standard JWT token authentication, Bcrypt password hashing (10 salt rounds), and DOMPurify sanitization to protect all user-generated content from XSS attacks.' },
];

const FAQ = () => {
  const [selectedQuestion, setSelectedQuestion] = useState(faqData[0]);

  return (
    <Box sx={{ maxWidth: '1280px', mx: 'auto', px: { xs: 2, md: 3 }, my: { xs: 6, md: 10 } }}>
      <Box sx={{ textAlign: 'center', mb: 5 }}>
        <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1, color: '#0f766e', mb: 1 }}>
          <HelpOutlineIcon />
          <Typography variant="subtitle2" sx={{ fontWeight: 'bold', letterSpacing: 1.2 }}>
            HAVE QUESTIONS?
          </Typography>
        </Box>
        <Typography variant="h3" component="h2" sx={{ fontWeight: 800, color: '#1b2e35' }}>
          Frequently Asked Questions
        </Typography>
      </Box>

      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          gap: 3,
          backgroundColor: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: '20px',
          overflow: 'hidden',
          p: { xs: 2.5, md: 4 },
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.05)',
        }}
      >
        {/* Questions list */}
        <Stack spacing={1.5} sx={{ width: { xs: '100%', md: '45%' } }}>
          {faqData.map((faq, index) => {
            const isSelected = selectedQuestion.question === faq.question;
            return (
              <Button
                key={index}
                onClick={() => setSelectedQuestion(faq)}
                sx={{
                  textAlign: 'left',
                  justifyContent: 'flex-start',
                  backgroundColor: isSelected ? '#1b2e35' : '#f8fafc',
                  color: isSelected ? '#ffffff' : '#334155',
                  borderRadius: '12px',
                  p: 1.8,
                  fontWeight: 600,
                  fontSize: '0.95rem',
                  textTransform: 'none',
                  transition: 'all 0.2s ease',
                  border: isSelected ? '1px solid #1b2e35' : '1px solid #f1f5f9',
                  boxShadow: isSelected ? '0 4px 12px rgba(27, 46, 53, 0.25)' : 'none',
                  '&:hover': {
                    backgroundColor: isSelected ? '#2c4955' : '#f1f5f9',
                  },
                }}
              >
                {faq.question}
              </Button>
            );
          })}
        </Stack>

        {/* Answer panel */}
        <Paper
          elevation={0}
          sx={{
            width: { xs: '100%', md: '55%' },
            p: { xs: 3, md: 4 },
            backgroundColor: '#1b2e35',
            borderRadius: '16px',
            color: 'white',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            minHeight: '220px'
          }}
        >
          <Typography variant="overline" sx={{ color: '#59e3a7', fontWeight: 700, letterSpacing: 1.5 }}>
            EXPLANATION
          </Typography>
          <Typography variant="h5" sx={{ fontWeight: 700, mt: 0.5, mb: 2, color: 'white' }}>
            {selectedQuestion.question}
          </Typography>
          <Typography variant="body1" sx={{ color: '#cbd5e1', lineHeight: 1.7, fontSize: '1.02rem' }}>
            {selectedQuestion.answer}
          </Typography>
        </Paper>
      </Box>
    </Box>
  );
};

export default FAQ;
