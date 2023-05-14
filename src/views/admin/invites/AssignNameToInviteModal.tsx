import React from 'react'

import {
    Button,
    FormControl, FormLabel, Input,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent, ModalFooter,
    ModalHeader,
    ModalOverlay, useDisclosure
} from "@chakra-ui/react";
import {useSkeet} from "../../../contexts/SkeetContext";


export default function AssignNameToInviteModal() {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const initialRef = React.useRef()
    const finalRef = React.useRef()
    const { skeetState, skeetDispatch } = useSkeet()
    const [name, setName] = React.useState('')

    React.useEffect(() => {
        if (skeetState.openAssignInviteModal) {
            if (skeetState.assignedInvites[skeetState.inviteCodeForModal]) {
                setName(skeetState.assignedInvites[skeetState.inviteCodeForModal])
            }
            onOpen();
        }
    }, [skeetState.openAssignInviteModal])

    React.useEffect(() => {
        if (!isOpen) {
            setName('')
            skeetDispatch({ type: 'CLOSE_ASSIGN_INVITE_MODAL' })
        }
    }, [isOpen])

    return (
        <Modal
            initialFocusRef={initialRef}
            finalFocusRef={finalRef}
            isOpen={isOpen}
            onClose={onClose}
        >
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Assign name to invite code</ModalHeader>
                <ModalCloseButton />
                <ModalBody pb={6}>
                    <FormControl>
                        <FormLabel>Invite code</FormLabel>
                        <Input placeholder="Invite code" value={skeetState.inviteCodeForModal} disabled={true} />
                    </FormControl>
                    <FormControl mt={4}>
                        <FormLabel>Name</FormLabel>
                        <Input value={ name } onChange={(e) => { setName(e.target.value )}} placeholder="Name" />
                    </FormControl>
                </ModalBody>
                <ModalFooter>
                    <Button onClick={() => {
                        skeetDispatch({
                            type: "SET_ASSIGNED_INVITE",
                            payload: { assignedInvite: { code: skeetState.inviteCodeForModal, name: name } }
                        })
                        onClose()
                    }} colorScheme="brand" mr={3}>
                        Save
                    </Button>
                    <Button onClick={onClose}>Cancel</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}