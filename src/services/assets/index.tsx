export class AssetManager {
  static preload = async (urls: string[] = []) => {
    try {
      const promises = await urls.map((url: string) => {
        return new Promise((resolve, reject) => {
          const img = new Image()

          img.src = url
          img.onload = () => {
            resolve(url)
          }
          img.onerror = () => {
            reject()
          }
        })
      })

      return await Promise.allSettled(promises)
    } catch (error) {
      console.error(error)
      return error
    }
  }
}
