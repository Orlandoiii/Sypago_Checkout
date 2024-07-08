export const initialStateMessage = {
    receivedMessages: [],
    sentMessages: [],
    stepsRuns: []
}

export const reducer = (state, action) => {

    switch (action.type) {
        case "practice/test-1":
            {
                const currentStepsRun = [...state.stepsRuns]
                currentStepsRun.push(`Este es el Step del Dispacht TEST-1 ${action.type}`)
                return { ...state, stepsRuns: [...currentStepsRun] }
            }

        case "practice/test-2":
            {
                const currentStepsRun = [...state.stepsRuns]
                currentStepsRun.push(`Este es el Step del Dispacht TEST-2 ${action.type}`)
                return { ...state, stepsRuns: [...currentStepsRun] }
            }


    }

    return state
}




