/*!
  _   _  ___  ____  ___ ________  _   _   _   _ ___
 | | | |/ _ \|  _ \|_ _|__  / _ \| \ | | | | | |_ _|
 | |_| | | | | |_) || |  / / | | |  \| | | | | || |
 |  _  | |_| |  _ < | | / /| |_| | |\  | | |_| || |
 |_| |_|\___/|_| \_\___/____\___/|_| \_|  \___/|___|

=========================================================
* Horizon UI - v1.1.0
=========================================================

* Product Page: https://www.horizon-ui.com/
* Copyright 2022 Horizon UI (https://www.horizon-ui.com/)

* Designed and Coded by Simmmple

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/

import React from 'react';

// Chakra imports
import { Box, Grid } from '@chakra-ui/react';
import InviteTable from "../dataTables/components/InviteTable";

import { useSkeet } from '../../../contexts/SkeetContext';

// Custom components

// Assets

export default function InvitesList() {
    const { skeetState } = useSkeet();

    return (
        <Box pt={{ base: '180px', md: '80px', xl: '80px' }}>
            {/* Main Fields */}
            <Grid
                mb='20px'
                gridTemplateColumns={{ xl: 'repeat(3, 1fr)', '2xl': '1fr 0.46fr' }}
                gap={{ base: '20px', xl: '20px' }}
                display={{ base: 'block', xl: 'grid' }}>

                { skeetState.invites && (
                    <InviteTable tableData={skeetState.invites} />
                )}
            </Grid>
        </Box>
    );
}
