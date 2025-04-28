interface UseCalculationsApi {
  getSku: () => Promise<unknown>
}

export const useCalculationsApi = (): UseCalculationsApi => {
  const getSku = (): Promise<unknown> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve([
          {
            id: 101,
            cost: 10,
            steps: {
              method: 'multiplier',
              stepsData: {multiplier: [10, 100, 1000], value: [10, 7, 5, 3]},
            },
          },
          {
            id: 801, cost: 10, discount: 0,
          },
          {
            id: 158, cost: 36, discount: 0,
          },
        ])
      }, 1000)
    })
  }

  return {
    getSku,
  }
}
