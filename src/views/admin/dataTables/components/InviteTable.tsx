import { Box, Flex, Table, Tbody, Td, Text, Th, Thead, Tr, useColorModeValue } from '@chakra-ui/react';
import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    getSortedRowModel,
    SortingState,
    useReactTable
} from '@tanstack/react-table';
// Custom components
import Card from 'components/card/Card';
import * as React from 'react';
import dayjs from 'dayjs';

// Assets
import SwitchField from "../../../../components/fields/SwitchField";
import {InviteCodeUse} from "@atproto/api/dist/client/types/com/atproto/server/defs";

type RowObj = {
    code: string;
    createdBy: string;
    createdAt: string;
    uses: InviteCodeUse[];
};

const columnHelper = createColumnHelper<RowObj>();

// const columns = columnsDataCheck;
export default function InviteTable(props: { tableData: any }) {
    const { tableData } = props;
    const [ sorting, setSorting ] = React.useState<SortingState>([]);
    const textColor = useColorModeValue('secondaryGray.900', 'white');
    const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');
    let defaultData = tableData;

    const [hideUsed, setHideUsed] = React.useState<boolean>(false)

    const columns = [
        columnHelper.accessor('code', {
            id: 'code',
            header: () => (
                <Text
                    justifyContent='space-between'
                    align='center'
                    fontSize={{ sm: '10px', lg: '12px' }}
                    color='gray.400'>
                    CODE
                </Text>
            ),
            cell: (info: any) => (
                <Flex align='center'>
                    <Text color={textColor} fontSize='sm' fontWeight='700' textDecoration={info.row.original.uses.length > 0 ? 'line-through' : null}>
                        {info.getValue()}
                    </Text>
                </Flex>
            )
        }),
        columnHelper.accessor('createdBy', {
            id: 'createdBy',
            header: () => (
                <Text
                    justifyContent='space-between'
                    align='center'
                    fontSize={{ sm: '10px', lg: '12px' }}
                    color='gray.400'>
                    CREATED BY
                </Text>
            ),
            cell: (info: any) => (
                <Flex align='center'>
                    <Text color={textColor} fontSize='sm' fontWeight='700'>
                        {info.getValue()}
                    </Text>
                </Flex>
            )
        }),
        columnHelper.accessor('createdAt', {
            id: 'createdAt',
            header: () => (
                <Text
                    justifyContent='space-between'
                    align='center'
                    fontSize={{ sm: '10px', lg: '12px' }}
                    color='gray.400'>
                    CREATED AT
                </Text>
            ),
            cell: (info: any) => (
                <Text color={textColor} fontSize='sm' fontWeight='700'>
                    {dayjs(info.getValue()).format('YYYY-MM-DD')}
                </Text>
            )
        }),
        columnHelper.accessor('uses', {
            id: 'uses',
            header: () => (
                <Text
                    justifyContent='space-between'
                    align='center'
                    fontSize={{ sm: '10px', lg: '12px' }}
                    color='gray.400'>
                    USED
                </Text>
            ),
            cell: (info: any) => (
                <Flex align='center'>
                    {info.getValue().length > 0 ? 'Yes' : 'No'}
                </Flex>
            )
        })
    ];
    const [ data] = React.useState(() => [ ...defaultData ]);
    const table = useReactTable({
        data,
        columns,
        state: {
            sorting
        },
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        debugTable: true,
    });
    return (
        <Card flexDirection='column' w='100%' px='0px' overflowX={{ sm: 'scroll', lg: 'hidden' }}>
            <Flex px='25px' mb="8px" justifyContent='space-between' align='center'>
                <Text color={textColor} fontSize='22px' fontWeight='700' lineHeight='100%'>
                    Invites
                </Text>
                <SwitchField
                    isChecked={hideUsed}
                    reversed={true}
                    fontSize='sm'
                    mb='20px'
                    id='1'
                    label='Hide used'
                    onChange={() => {
                        setHideUsed(!hideUsed)
                    }}
                />
            </Flex>
            <Box>
                <Table variant='simple' color='gray.500' mb='24px' mt="12px">
                    <Thead>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <Tr key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <Th
                                            key={header.id}
                                            colSpan={header.colSpan}
                                            pe='10px'
                                            borderColor={borderColor}
                                            cursor='pointer'
                                            onClick={header.column.getToggleSortingHandler()}>
                                            <Flex
                                                justifyContent='space-between'
                                                align='center'
                                                fontSize={{ sm: '10px', lg: '12px' }}
                                                color='gray.400'>
                                                {flexRender(header.column.columnDef.header, header.getContext())}{{
                                                asc: '',
                                                desc: '',
                                            }[header.column.getIsSorted() as string] ?? null}
                                            </Flex>
                                        </Th>
                                    );
                                })}
                            </Tr>
                        ))}
                    </Thead>
                    <Tbody>
                        {table.getRowModel().rows.map((row) => {
                            return (
                                <Tr key={row.id}>
                                    {row.getVisibleCells().map((cell) => {
                                        return (
                                            <Td
                                                key={cell.id}
                                                fontSize={{ sm: '14px' }}
                                                minW={{ sm: '150px', md: '200px', lg: 'auto' }}
                                                borderColor='transparent'>
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </Td>
                                        );
                                    })}
                                </Tr>
                            );
                        })}
                    </Tbody>
                </Table>
            </Box>
        </Card>
    );
}