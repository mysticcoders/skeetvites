import {Box, Button, Flex, Table, Tbody, Td, Text, Th, Thead, Tr, useColorModeValue, VStack} from '@chakra-ui/react';
import {
    ColumnFiltersState,
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getSortedRowModel,
    SortingState,
    useReactTable
} from '@tanstack/react-table';
// Custom components
import Card from 'components/card/Card';
import * as React from 'react';
import dayjs from 'dayjs';
import { CopyToClipboard } from 'react-copy-to-clipboard';

// Assets
import SwitchField from "../../../../components/fields/SwitchField";
import {InviteCodeUse} from "@atproto/api/dist/client/types/com/atproto/server/defs";
import {useSkeet} from "../../../../contexts/SkeetContext";
import AssignNameToInviteModal from "../../invites/AssignNameToInviteModal";

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
    const { skeetState, skeetDispatch } = useSkeet()
    const [ sorting, setSorting ] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([{
        id: 'uses',
        value: true,
    }])
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
                    <VStack
                        spacing={2}
                        align="stretch"
                    >
                        <Box>
                            <Text color={textColor} fontSize='sm' fontWeight='700' textDecoration={info.row.original.uses.length > 0 ? 'line-through' : null}>
                                <CopyToClipboard text={info.getValue()}>
                                    <span>{info.getValue()}</span>
                                </CopyToClipboard>
                                {}
                            </Text>
                        </Box>
                        <Box>
                            <Button
                                color={textColor} fontSize='sm' fontWeight='200' variant="link"
                                onClick={() => { skeetDispatch({ type: 'OPEN_ASSIGN_INVITE_MODAL', payload: { inviteCode: info.getValue() }})}}
                            >
                                {!skeetState.assignedInvites?.[info.getValue()] ? (
                                    <>
                                        Add Name
                                    </>
                                ) : (
                                    <>
                                        {skeetState.assignedInvites[info.getValue()]}
                                    </>
                                )}
                            </Button>
                        </Box>
                    </VStack>
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
                    USED BY
                </Text>
            ),
            cell: (info: any) => (
                <Flex align='center'>
                    {info.getValue().length > 0 ? (
                        <Button variant="brand" size="xs"
                            onClick={() => { window.location.href = `https://staging.bsky.app/profile/${skeetState.didToProfile[info.getValue()?.[0]?.usedBy]['handle']}` }}
                        >
                            @{skeetState.didToProfile[info.getValue()?.[0]?.usedBy]['handle']}
                        </Button>
                    ) : 'No'}
                </Flex>
            ),
            filterFn: (row, _columnId, value) => {
                if (value && row.original.uses.length > 0) {
                    return false
                }
                return true
            }
        })
    ];
    const [ data] = React.useState(() => [ ...defaultData ]);
    const table = useReactTable({
        data,
        columns,
        enableFilters: true,
        enableColumnFilters: true,
        getFilteredRowModel: getFilteredRowModel(),
        state: {
            sorting,
            columnFilters,
        },
        onColumnFiltersChange: setColumnFilters,
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
                <Box>
                    <SwitchField
                        isChecked={!hideUsed}
                        reversed={true}
                        fontSize='sm'
                        mb='20px'
                        id='1'
                        label='Hide used'
                        onChange={() => {
                            setHideUsed(!hideUsed)
                            setColumnFilters([{
                                id: 'uses',
                                value: hideUsed,
                            }])
                        }}
                    />
                </Box>
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
            <AssignNameToInviteModal />
        </Card>
    );
}