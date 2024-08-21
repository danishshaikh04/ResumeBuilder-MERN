import React, { useEffect } from "react";
import { Box, Button, Container, Typography } from "@mui/material";
import { motion } from "framer-motion";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import "../styles/LandingPage.css";
import { useDispatch, useSelector } from "react-redux";
import { updateEducation } from "../redux/educationSlice";
import { updateProfile } from "../redux/profileSlice";
import { updateProject } from "../redux/projectSlice";
import { updateExperience } from "../redux/experienceSlice";
import axios from "axios";
import { BASE_URL } from "../api";
import {
  updateAchievements,
  updateExtraCoCurricular,
  updateSkills,
} from "../redux/extraDetailsSlice";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#ff6f61",
    },
    background: {
      default: "#ffecd6",
    },
    text: {
      primary: "#333333",
      secondary: "#555555",
    },
  },
});

export default function LandingPage() {
  const currentUser = useSelector((state) => state.user.currentUser);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const getAllResumeData = async () => {
    // console.log('entered');
    try {
      const response = await axios.get(
        `${BASE_URL}/data/get-all-resume-data?id=${currentUser._id}`,
        {
          headers: {
            authorization: currentUser.token,
          },
        }
      );
      // console.log("response: ", response.data.resumeData[0]);
      const resumeData = response.data.resumeData[0];
      // console.log('Education:', resumeData.education[0])
      if (resumeData) {
        dispatch(updateProfile(resumeData.profile));
        dispatch(updateEducation(resumeData.education[0]));
        resumeData.projects.forEach((project, index) => {
          Object.keys(project).forEach((field) => {
            dispatch(updateProject({ index, field, value: project[field] }));
          });
        });

        // Assuming resumeData.experience is an array
        resumeData.experience.forEach((experience, index) => {
          Object.keys(experience).forEach((field) => {
            dispatch(
              updateExperience({ index, field, value: experience[field] })
            );
          });
        });
        const { skills, achievements, extraCoCurricular } =
          resumeData.extraDetails;
        // Update skills
        // console.log(skills);
        Object.keys(skills).forEach((type) => {
          skills[type].forEach((skill, index) => {
            dispatch(updateSkills({ type, index, value: skill }));
          });
        });

        // Update achievements
        achievements.forEach((achievement, index) => {
          dispatch(updateAchievements({ index, value: achievement }));
        });

        // Update extra co-curricular activities
        extraCoCurricular.forEach((activity, index) => {
          dispatch(updateExtraCoCurricular({ index, value: activity }));
        });
      }
    } catch (error) {
      console.error("Error in getAllResumeData:", error);
    }
  };

  useEffect(() => {
    getAllResumeData();
  }, []);

  const handleGetStarted = () => {
    navigate("/profile");
  };

  return (
    <ThemeProvider theme={theme}>
      <Box className="box-container" sx={{ display: 'flex', height: '100vh' }}>
        {/* Left side for text content */}
        <Box
          sx={{
            width: '50vw',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            // padding: '50px',
            boxSizing: 'border-box',
            backgroundColor: '#99C9ED', // You can set a background color if needed
          }}
        >
          <div style={{ color: 'black',
            maxWidth:'500px'
           }}>
            <Container maxWidth="sx" className="text">
              <motion.div
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
              >
                <Typography className="heading"
                  variant="h2"
                  component="h1"
                  gutterBottom
                  sx={{ fontWeight: '800' }}
                >
                  Unlock Your Dream Job
                  with Our Cutting-Edge Resume Builder App .
                </Typography>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.5 }}
              >
                <Typography variant="h5" component="h1" className="para" gutterBottom>
                Create a resume that truly reflects your skills, experience, and personality with our intuitive resume builder. Choose from a wide range of customizable templates, each carefully designed to help you showcase your strengths and achievements.
                </Typography>
              </motion.div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 1 }}
              >
                <Button
                  onClick={handleGetStarted}
                  variant="outlined"
                  className="cta-btn"
                  sx={{
                    // borderRadius: '30px',
                    color: 'white',
                    backgroundColor: '#000000',
                    padding:'15px 50px',
                    '&:hover': {
                      color: 'grey',
                      backgroundColor: '#000000',
                      border: 'none',
                    },
                    border: 'none',
                    fontWeight: 600,
                  }}
                  size="large"
                >
                  Get Started
                </Button>
                
              </motion.div>
            </Container>
          </div>
        </Box>
  
        {/* Right side for image */}
        <Box className="img-container">
          {/* Additional image containers can be added here if needed */}
        </Box>
      </Box>
     
    </ThemeProvider>
  );
  
}
