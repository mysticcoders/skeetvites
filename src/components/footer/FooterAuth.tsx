/* eslint-disable */

import { Flex, Link, List, ListItem, Text, useColorModeValue } from '@chakra-ui/react';
import { useSkeet } from '../../contexts/SkeetContext';

export default function Footer() {
	let textColor = useColorModeValue('gray.400', 'white');
	let linkColor = useColorModeValue({ base: 'gray.400', lg: 'white' }, 'white');

	return (
		<Flex
			zIndex='3'
			flexDirection={{
				base: 'column',
				lg: 'row'
			}}
			alignItems={{
				base: 'center',
				xl: 'start'
			}}
			justifyContent='space-between'
			px={{ base: '30px', md: '0px' }}
			pb='30px'>
			<Text
				color={textColor}
				textAlign={{
					base: 'center',
					xl: 'start'
				}}
				mb={{ base: '20px', lg: '0px' }}>
				{' '}
				&copy; {new Date().getFullYear()}
				<Text as='span' fontWeight='500' ms='4px'>
					Skeetvites. All Rights Reserved. Made with love and snark by
					<Link mx='3px' color={textColor} href='https://mysticcoders.com' target='_blank' fontWeight='700'>
						Mystic Coders, LLC
					</Link>
				</Text>
			</Text>
			<List display='flex'>
				<ListItem
					me={{
						base: '20px',
						md: '44px'
					}}>
					<Link fontWeight='500' color={linkColor} href='https://staging.bsky.app/profile/andrewlombardi.com'>
						@andrewlombardi.com
					</Link>
				</ListItem>
				<ListItem>
					<Link fontWeight='500' color={linkColor} href='https://mysticcoders.com/blog'>
						Blog
					</Link>
				</ListItem>
			</List>
		</Flex>
	);
}
