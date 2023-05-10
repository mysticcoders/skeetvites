import React from 'react'

// Chakra imports
import { Box, Icon, SimpleGrid, useColorModeValue } from '@chakra-ui/react';
// Assets
// Custom components
import MiniStatistics from 'components/card/MiniStatistics';
import IconBox from 'components/icons/IconBox';
import { MdNewspaper, MdOutlineSpeakerPhone, MdPostAdd, MdHandshake } from 'react-icons/md';
import { useSkeet } from '../../../contexts/SkeetContext';
import numeral from 'numeral'

export default function UserReports() {
	// Chakra Color Mode
	const brandColor = useColorModeValue('brand.500', 'white');
	const boxBg = useColorModeValue('secondaryGray.300', 'whiteAlpha.100');

	const { skeetState } = useSkeet();

	const [availableInvites, setAvailableInvites] = React.useState<number>(0);

	React.useEffect(() => {
		if (skeetState?.invites) {
			setAvailableInvites(skeetState?.invites.filter((invite) => invite.uses.length === 0).length)
		}
	}, [skeetState?.invites])

	return (
		<Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
			<SimpleGrid columns={{ base: 1, md: 2, lg: 3, '2xl': 6 }} gap='20px' mb='20px'>
				<MiniStatistics
					startContent={
						<IconBox
							w='56px'
							h='56px'
							bg={boxBg}
							icon={<Icon w='32px' h='32px' as={MdOutlineSpeakerPhone} color={brandColor} />}
						/>
					}
					name='Followers'
					value={numeral(skeetState.profile?.followersCount).format()}
				/>
				<MiniStatistics
					startContent={
						<IconBox
							w='56px'
							h='56px'
							bg={boxBg}
							icon={<Icon w='32px' h='32px' as={MdNewspaper} color={brandColor} />}
						/>
					}
					name='Following'
					value={numeral(skeetState.profile?.followsCount).format()}
				/>
				<MiniStatistics
					startContent={
						<IconBox
							w='56px'
							h='56px'
							bg={boxBg}
							icon={<Icon w='32px' h='32px' as={MdPostAdd} color={brandColor} />}
						/>
					}
					name='Posts' value={numeral(skeetState.profile?.postsCount).format()} />
				<MiniStatistics
					startContent={
						<IconBox
							w='56px'
							h='56px'
							bg={boxBg}
							icon={<Icon w='32px' h='32px' as={MdHandshake} color={brandColor} />}
						/>
					}
					name='Invites' value={numeral(availableInvites).format()} />

			</SimpleGrid>
		</Box>
	);
}
