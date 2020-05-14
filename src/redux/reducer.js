const reducers = (state = {}, action) => {
  switch (action.type) {
    case 'UPDATE_SETTINGS_OPTION':
      return {
        ...state,
        settings: {
          ...state.settings,
          [action.option]: action.value,
        },
      }

    default:
      return state
  }
}

export default reducers
