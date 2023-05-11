import {
    AppBskyActorGetProfile,
    AppBskyGraphGetFollowers, AppBskyGraphGetFollows,
    AppBskyGraphGetMutes,
    BskyAgent,
    ComAtprotoRepoCreateRecord,
    ComAtprotoRepoDeleteRecord, ComAtprotoRepoListRecords
} from '@atproto/api'
import dayjs from "dayjs";
import * as ComAtprotoServerDefs from "@atproto/api/src/client/types/com/atproto/server/defs";

export async function login(identifier, password) : Promise<BskyAgent> {
    const agent = new BskyAgent({
        service: 'https://bsky.social',
    });

    await agent.login({
        identifier,
        password,
    });

    return agent
}

export async function follow(agent: BskyAgent, personalDid : string, followDid : string) : Promise<ComAtprotoRepoCreateRecord.Response> {
    return await agent.api.com.atproto.repo.createRecord({
        collection: 'app.bsky.graph.follow',
        repo: personalDid,
        record: {
            subject: followDid,
            createdAt: dayjs().format(),
            "$type": "app.bsky.graph.follow"
        }
    })
}

export async function unfollow(agent: BskyAgent, personalDid : string, rkey : string) : Promise<ComAtprotoRepoDeleteRecord.Response> {
    return await agent.api.com.atproto.repo.deleteRecord({
        collection: 'app.bsky.graph.follow',
        repo: personalDid,
        rkey: rkey,
    })
}

export async function getProfiles(agent: BskyAgent, actors: string[]) {
    return agent.app.bsky.actor.getProfiles({
        actors
    })
}

export async function getMutes(agent: BskyAgent): Promise<AppBskyGraphGetMutes.Response> {
    return agent.app.bsky.graph.getMutes()
}


export async function getFollowersWithCallback(agent: BskyAgent, actor: string, limit = 100, callbackFollower : any, callbackSegment: any) {
    let getMore = true
    let cursor_next : string | undefined = undefined
    while (getMore) {
        const followers = await getFollowers(agent, actor, cursor_next)
        cursor_next = followers.data.cursor

        if (!cursor_next) {
            getMore = false
        }

        for (const follower of followers.data.followers) {
            await callbackFollower(follower)
        }

        await callbackSegment(followers)
    }
}


/**
 * Get followers from the bsky protocol
 *
 * @param actor the did to lookup followers
 * @param cursor the latest cursor or undefined/null if not
 * @param limit a number between 1 and 100 (default: 100)
 */
export async function getFollowers(agent: BskyAgent, actor: string, cursor?: string,  limit = 100): Promise<AppBskyGraphGetFollowers.Response> {
    const params : { actor: string; limit: number, cursor?: string } = {
        actor,
        limit
    }

    if (cursor) {
        params['cursor'] = cursor
    }
    return await agent.app.bsky.graph.getFollowers(params)
}

//https://bsky.social/xrpc/com.atproto.server.getAccountInviteCodes

/**
 * Return the array of invite codes
 *
 * @param agent
 */
export async function getInviteCodes(agent: BskyAgent) : Promise<ComAtprotoServerDefs.InviteCode[]> {
    const inviteCodesResponse = await agent.com.atproto.server.getAccountInviteCodes()

    return inviteCodesResponse.data.codes
}

export async function getProfile(agent: BskyAgent, actor: string) : Promise<AppBskyActorGetProfile.Response> {
    return agent.app.bsky.actor.getProfile({
        actor
    })
}

export async function getLikes(agent: BskyAgent, repo : string): Promise<ComAtprotoRepoListRecords.Response> {
    return await agent.api.com.atproto.repo.listRecords({
        repo: repo,
        collection: 'app.bsky.feed.like'
    })
}

export async function getFollowsWithCallback(agent: BskyAgent, actor: string, limit = 100, callbackFollow: any, callbackSegment: any) {
    let getMore = true
    let cursor_next : string | undefined = undefined
    while (getMore) {
        const follows = await getFollowsUsingListRecords(agent, actor, cursor_next)
        cursor_next = follows.data.cursor

        if (!cursor_next) {
            getMore = false
        }

        console.log(`cursor_next: ${cursor_next}`)

        for (const follow of follows.data.records) {
            try {
                await callbackFollow(follow.value)
            } catch(error) {
                console.error(error)
            }
        }

        await callbackSegment(follows)
    }
}

export async function getFollows(agent: BskyAgent, actor: string, cursor?: string,  limit = 100): Promise<AppBskyGraphGetFollows.Response> {
    const params : { actor: string; limit: number, cursor?: string } = {
        actor,
        limit
    }

    if (cursor) {
        params['cursor'] = cursor
    }

    return await agent.app.bsky.graph.getFollows(params)
}

export async function getFollowsUsingListRecords(agent: BskyAgent, repo: string, cursor?: string, limit = 100) {
    const params : {repo: string, collection: string, limit: number, cursor?: string } = {
        repo,
        collection: 'app.bsky.graph.follow',
        limit,
    }

    if (cursor) {
        params['cursor'] = cursor
    }

    return await agent.api.com.atproto.repo.listRecords(params)
}



export async function resolveHandle(agent: BskyAgent, handle : string): Promise<string> {
    const response = await agent.api.com.atproto.identity.resolveHandle({
        handle
    })

    return response.data.did
}
