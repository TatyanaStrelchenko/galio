import { Action as BaseAction, MediaChannelsByIdState, RootState } from '../../types/state'
import { ChannelInfo } from '../../types/textChannel'

export const UPDATE_CHANNELS_INFO = 'mediaChannels/UPDATE_CHANNELS_INFO'

type UpdateChannelsInfoAction = BaseAction<typeof UPDATE_CHANNELS_INFO, ChannelInfo[]>

type State = Record<string, MediaChannelsByIdState>
type Action = UpdateChannelsInfoAction

const initialState: State = {}

export default function reducer(state: State = initialState, action: Action) {
  switch (action.type) {
    case UPDATE_CHANNELS_INFO:
      return updateChannelsInfo(state, action)
    default:
      return state
  }
}

function updateChannelsInfo(state: State, action: UpdateChannelsInfoAction): State {
  const nextState = { ...state }

  action.payload.forEach(({ channelId, participantsCount }) => {
    nextState[channelId] = {
      ...nextState[channelId],
      participantsCount,
    }
  })

  return nextState
}

export const updateChannelsInfoAction = (
  channelsInfo: ChannelInfo[]
): UpdateChannelsInfoAction => ({
  type: UPDATE_CHANNELS_INFO,
  payload: channelsInfo,
})

export const participantsCountSelector = (
  state: RootState,
  channelId: number
): number | undefined => {
  return state.mediaChannels.byId[channelId]?.participantsCount
}
