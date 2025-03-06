"use client";

import React from 'react';
import IconButton from '@mui/material/IconButton';
import HomeIcon from '@mui/icons-material/Home';
import Link from 'next/link';

const HomeNavButton = () => {
  return (
    <Link href="/panou-principal" passHref legacyBehavior>
      <IconButton
        sx={{
          backgroundColor: '#4caf50', // culoare de fundal dorită
          '&:hover': {
            backgroundColor: '#43a047', // culoare la hover
          },
          color: 'white',
          width: 48,
          height: 48,
        }}
      >
        <HomeIcon fontSize="medium" />
      </IconButton>
    </Link>
  );
};

export default HomeNavButton;
