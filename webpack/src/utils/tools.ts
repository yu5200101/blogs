export const sleepTime = (time: number) => new Promise((resolve, reject) => {
  try {
    setTimeout(() => {
      resolve(undefined)
    }, time)
  } catch (err) {
    reject(err)
  }
})