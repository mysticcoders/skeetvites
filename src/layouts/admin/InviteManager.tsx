// Chakra imports
import { Portal, Box, useDisclosure } from '@chakra-ui/react';
import Footer from 'components/footer/FooterAdmin';
// Layout components
import Navbar from 'components/navbar/NavbarAdmin';
import Sidebar from 'components/sidebar/Sidebar';
import { SidebarContext } from 'contexts/SidebarContext';
import React, { useState } from 'react';
import { Route } from 'react-router-dom';
import routes from 'routes';
import UserReports from "../../views/admin/default";
import InviteTable from "../../views/admin/dataTables/components/InviteTable";
import {useSkeet} from "../../contexts/SkeetContext";

// Custom Chakra theme
export default function InviteManager(props: { [x: string]: any }) {
    const { ...rest } = props;
    // states and functions
    const [ fixed ] = useState(false);
    const [ toggleSidebar, setToggleSidebar ] = useState(false);
    // functions for changing the states from components
    const { skeetState } = useSkeet();

    const getRoute = () => {
        return window.location.pathname !== '/admin/full-screen-maps';
    };

    const getActiveRoute = (routes: RoutesType[]): string => {
        let activeRoute = 'Default Brand Text';
        for (let i = 0; i < routes.length; i++) {
            if (window.location.href.indexOf(routes[i].layout + routes[i].path) !== -1) {
                return routes[i].name;
            }
        }
        return activeRoute;
    };
    const getActiveNavbar = (routes: RoutesType[]): boolean => {
        let activeNavbar = false;
        for (let i = 0; i < routes.length; i++) {
            if (window.location.href.indexOf(routes[i].layout + routes[i].path) !== -1) {
                return routes[i].secondary;
            }
        }
        return activeNavbar;
    };
    const getActiveNavbarText = (routes: RoutesType[]): string | boolean => {
        let activeNavbar = false;
        for (let i = 0; i < routes.length; i++) {
            if (window.location.href.indexOf(routes[i].layout + routes[i].path) !== -1) {
                return routes[i].name;
            }
        }
        return activeNavbar;
    };

    document.documentElement.dir = 'ltr';
    const { onOpen } = useDisclosure();
    return (
        <Box>
            <SidebarContext.Provider
                value={{
                    toggleSidebar,
                    setToggleSidebar
                }}>
                <Sidebar routes={routes} display='none' {...rest} />
                <Box
                    float='right'
                    minHeight='100vh'
                    height='100%'
                    overflow='auto'
                    position='relative'
                    maxHeight='100%'
                    w={{ base: '100%', xl: 'calc( 100% - 290px )' }}
                    maxWidth={{ base: '100%', xl: 'calc( 100% - 290px )' }}
                    transition='all 0.33s cubic-bezier(0.685, 0.0473, 0.346, 1)'
                    transitionDuration='.2s, .2s, .35s'
                    transitionProperty='top, bottom, width'
                    transitionTimingFunction='linear, linear, ease'>
                    <Portal>
                        <Box>
                            <Navbar
                                onOpen={onOpen}
                                logoText={'Skeetvites'}
                                brandText={getActiveRoute(routes)}
                                secondary={getActiveNavbar(routes)}
                                message={getActiveNavbarText(routes)}
                                fixed={fixed}
                                {...rest}
                            />
                        </Box>
                    </Portal>
                    <Box w="100%" p={10} color="white">
                        {/* TODO fix the CSS here */}
                    </Box>
                    <Box mx='auto' p={{ base: '20px', md: '30px' }} pe='20px' minH='100vh' pt='50px'>
                        { skeetState.invites && (
                            <InviteTable tableData={skeetState.invites} />
                        )}
                    </Box>
                    <Box>
                        <Footer />
                    </Box>

                </Box>
            </SidebarContext.Provider>
        </Box>
    );
}