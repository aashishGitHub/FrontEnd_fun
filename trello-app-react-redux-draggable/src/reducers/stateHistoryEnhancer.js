const stateHistoryEnhancer = reducer => {
  const initialState = {
    previousStates: [],
    currentState: reducer(undefined, {}),
    futureStates: []
  };

  return (state = initialState, action) => {
    const { previousStates, currentState, futureStates } = state;   
        const newCurrentState = reducer(currentState, action);
        if (currentState === newCurrentState) {
          return state;
        }
        if (currentState) {
          return {
            previousStates: [...(previousStates || []), currentState],
            currentState: newCurrentState,
            futureStates: []
          };
        }
        return {
          previousStates: [...(previousStates || [])],
          currentState: newCurrentState,
          futureStates: []
        };
  };
};

export default stateHistoryEnhancer;
