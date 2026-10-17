// Match whole Unicode words: JavaScript \b truncates Turkish suffixes such as ı.
const noise = new Set([
  "oto", "otomobil", "yedek", "parca", "parcasi", "parcalari",
  "urun", "urunu", "urunleri", "fren", "balata", "balatasi", "balatalari",
  "disk", "diski", "diskleri", "set", "seti", "setleri", "sistemleri", "ve",
])

export const cleanVehicleLabel = (value: string) =>
  value
    .replace(new RegExp("[\\p{L}\\p{N}]+", "gu"), (word) => {
      const key = word.toLocaleLowerCase("tr-TR").normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "").replace(/ı/g, "i")
      return noise.has(key) ? " " : word
    })
    .replace(/[|,:&]+/g, " ")
    .replace(/(?:^|\s)\/(?=\s|$)/g, " ")
    .replace(/\s*[-–]\s*$/g, "")
    .replace(/\s+/g, " ")
    .trim()
