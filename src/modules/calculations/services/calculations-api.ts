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
              method: 'cost',
              stepsData: [
                {multiplier: 10, value: 10},
                {multiplier: 100, value: 7},
                {multiplier: 1000, value: 5},
                {multiplier: null, value: 3},
              ],
            },
          },
          {
            id: 801, cost: 10, discount: 0,
          },
          {
            id: 158, cost: 36, discount: 0,
          },
          {
            id: 130,
            cost: 25,
            steps: {
              method: 'discount',
              stepsData: [
                {multiplier: 10, value: 0},
                {multiplier: 500, value: 40},
                {multiplier: 1000, value: 60},
                {multiplier: null, value: 80},
              ],
            },
          },
        ])
      }, 1000)
    })
  }

  return {
    getSku,
  }
}
