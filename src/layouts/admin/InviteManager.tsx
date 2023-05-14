// Chakra imports
import { Portal, Box, useDisclosure } from '@chakra-ui/react';
import Footer from 'components/footer/FooterAdmin';
// Layout components
import Navbar from 'components/navbar/NavbarAdmin';
import Sidebar from 'components/sidebar/Sidebar';
import { SidebarContext } from 'contexts/SidebarContext';
import React, { useState } from 'react';
import routes from 'routes';
import InviteTable from "../../views/admin/dataTables/components/InviteTable";
import {useSkeet} from "../../contexts/SkeetContext";
import {getProfiles} from "../../skeet";

// Custom Chakra theme
export default function InviteManager(props: { [x: string]: any }) {
    const { ...rest } = props;
    // states and functions
    const [ fixed ] = useState(false);
    const [ toggleSidebar, setToggleSidebar ] = useState(false);
    // functions for changing the states from components
    const { skeetState, skeetDispatch } = useSkeet();

    async function batchProfiles(batch: string[]) {
        const profiles = await getProfiles(skeetState.agent, batch)

        for(const profile of profiles.data.profiles) {
            skeetDispatch({ type: "SET_PROFILE_FOR_DID", payload: { profile: profile }})
        }
    }

    React.useEffect(() => {
        const redeemedInvites = skeetState.invites.filter((invite) => invite.uses.length > 0).map((invite) => {
            return invite.uses?.[0].usedBy
        })

        const batchSize = 25
        for (let i = 0; i < redeemedInvites.length; i += batchSize) {
            const batch = redeemedInvites.slice(i, i + batchSize);
            batchProfiles(batch)
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

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
