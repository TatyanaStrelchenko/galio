import { Action as BaseAction, RootState, UiState } from '../../types/state'

export const TOGGLE_SHOW_SIDEBAR = 'ui/TOGGLE_SHOW_SIDEBAR'
export const TOGGLE_ACCORDION_STATE = 'ui/TOGGLE_ACCORDION_STATE'

type AccordionsState = UiState['accordions']
type ToggleShowSidebarAction = BaseAction<typeof TOGGLE_SHOW_SIDEBAR, boolean | undefined>
type ToggleAccordionStateAction = BaseAction<
  typeof TOGGLE_ACCORDION_STATE,
  Partial<AccordionsState>
>

type Action = ToggleShowSidebarAction | ToggleAccordionStateAction

const restoreAccordionsState = (): UiState['accordions'] => {
  try {
    const accordionsState: Partial<UiState> = JSON.parse(localStorage.getItem('ui') || '')

    return {
      isVideoChannelsOpen: Boolean(accordionsState?.accordions?.isVideoChannelsOpen),
      isTextChannelsOpen: Boolean(accordionsState?.accordions?.isTextChannelsOpen),
    }
  } catch (e) {
    return {
      isVideoChannelsOpen: false,
      isTextChannelsOpen: false,
    }
  }
}

const initialState: UiState = {
  showSidebar: true,
  accordions: restoreAccordionsState(),
}

export default function reducer(state: UiState = initialState, action: Action) {
  switch (action.type) {
    case TOGGLE_SHOW_SIDEBAR:
      return {
        ...state,
        showSidebar: action.payload ?? !state.showSidebar,
      }
    case TOGGLE_ACCORDION_STATE:
      return {
        ...state,
        accordions: {
          ...state.accordions,
          ...action.payload,
        },
      }
    default:
      return state
  }
}

export const toggleShowSidebar = (show?: boolean): ToggleShowSidebarAction => ({
  type: TOGGLE_SHOW_SIDEBAR,
  payload: show,
})

export const toggleAccordionsState = (
  accordionsState: Partial<AccordionsState>
): ToggleAccordionStateAction => ({
  type: TOGGLE_ACCORDION_STATE,
  payload: accordionsState,
})

export const showSidebarSelector = (state: RootState) => {
  return state.ui.showSidebar
}

export const uiSelector = (state: RootState) => {
  return state.ui
}
