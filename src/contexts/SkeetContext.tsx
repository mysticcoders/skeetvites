import React, {createContext, ReactNode, useContext, useReducer} from "react";
import * as AppBskyActorDefs from "@atproto/api/src/client/types/app/bsky/actor/defs";
import * as ComAtprotoServerDefs from "@atproto/api/src/client/types/com/atproto/server/defs";

import store from 'store2';
import {BskyAgent} from "@atproto/api";
import {ProfileViewDetailed} from "@atproto/api/dist/client/types/app/bsky/actor/defs";

interface SkeetState {
    isLoggedIn: boolean;
    openAssignInviteModal: boolean;
    inviteCodeForModal: string | null;
    agent: BskyAgent | null;
    // @ts-ignore
    profile: AppBskyActorDefs.ProfileViewDetailed | null;
    didToProfile: {[did: string]: AppBskyActorDefs.ProfileViewDetailed};
    invites: ComAtprotoServerDefs.InviteCode[] | null;
    assignedInvites: {[code: string]: string | null};
}

type SkeetAction =
    | {
    type: "LOGIN";
    payload: { agent: BskyAgent };
}
    | {
    type: "LOGOUT";
}
    | {
    type: "SET_PROFILE";
    payload: { profile: object };
}
    | {
    type: "SET_INVITES";
    payload: { invites: object };
}
    | {
    type: "SET_ASSIGNED_INVITE";
    payload: { assignedInvite: object };
}
    | {
    type: "SET_PROFILE_FOR_DID";
    payload: { profile: object };
}
    | {
    type: "OPEN_ASSIGN_INVITE_MODAL";
    payload: { inviteCode: string };
}
    | {
    type: "CLOSE_ASSIGN_INVITE_MODAL";
}
;

interface SkeetContextProps {
    skeetState: SkeetState;
    skeetDispatch: React.Dispatch<SkeetAction>;
}

// Define the initial state of the reducer
const initialSkeetState: SkeetState = {
    isLoggedIn: false,
    openAssignInviteModal: false,
    inviteCodeForModal: null,
    agent: null,
    profile: null,
    invites: null,
    didToProfile: null,
    assignedInvites: store.get('assignedInvites'),
};

// Define the reducer function
function skeetReducer(state: SkeetState, action: SkeetAction): SkeetState {
    switch (action.type) {
        case "LOGIN":
            return {
                isLoggedIn: true,
                openAssignInviteModal: false,
                inviteCodeForModal: null,
                agent: action.payload.agent,
                didToProfile: null,
                profile: null,
                invites: null,
                assignedInvites: store.get('assignedInvites'),
            };
        case "LOGOUT":
            return initialSkeetState;
        case "SET_PROFILE":
            const profile = action.payload.profile as ProfileViewDetailed
            return {
                ...state,
                profile: profile,
            }
        case "SET_INVITES":
            return {
                ...state,
                invites: action.payload.invites,
            } as SkeetState;
        case "SET_ASSIGNED_INVITE":
            let assignedInvites = store.get('assignedInvites')
            assignedInvites = { ...assignedInvites,
                [action.payload.assignedInvite?.['code']]: action.payload.assignedInvite?.['name']
            }
            store.set('assignedInvites', assignedInvites)
            return {
                ...state,
                assignedInvites: {
                    ...state.assignedInvites,
                    [action.payload.assignedInvite?.['code']]: action.payload.assignedInvite?.['name']
                }
            } as SkeetState;
        case "OPEN_ASSIGN_INVITE_MODAL":
            return {
                ...state,
                openAssignInviteModal: true,
                inviteCodeForModal: action.payload.inviteCode
            } as SkeetState;
        case "CLOSE_ASSIGN_INVITE_MODAL":
            return {
                ...state,
                openAssignInviteModal: false,
                inviteCodeForModal: null
            } as SkeetState;
        case "SET_PROFILE_FOR_DID":
            return {
                ...state,
                didToProfile: {
                    ...state.didToProfile,
                    [action.payload.profile['did']]: action.payload.profile
                }
            } as SkeetState;
        default:
            return state;
    }
}

// Create the context with an initial state of `initialSkeetState`
export const SkeetContext = createContext<SkeetContextProps>({
    skeetState: initialSkeetState,
    skeetDispatch: () => {},
});

// Define a custom hook for accessing the SkeetContext
export const useSkeet = () => useContext(SkeetContext);

// Export a provider component that wraps the app and provides the SkeetContext
export const SkeetProvider = ({ children }: { children: ReactNode }) => {    // Use the reducer hook to manage the skeet state
    const [skeetState, skeetDispatch] = useReducer(
        skeetReducer,
        initialSkeetState
    );

    return (
        <SkeetContext.Provider value={{ skeetState, skeetDispatch }}>
            {children}
        </SkeetContext.Provider>
    );
}
