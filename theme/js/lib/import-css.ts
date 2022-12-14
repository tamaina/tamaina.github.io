export default () => {
  for (const preload
    of document.querySelectorAll("link[rel=\"preload\"][as=\"style\"]") as unknown as HTMLLinkElement[]) {
    const href = preload.href
    const style = document.createElement("link")
    style.rel = "stylesheet"
    style.href = href
    document.head.appendChild(style)
  }

  const top = require("../../styl/lazy/top.sass")
  top.unuse()
  const tjwf = require("../../styl/lazy/tjwf.sass")
  tjwf.unuse()

  const p = window.location.pathname

  if (p === "/") top.use()
  else if (top.unuse) top.unuse()
  if (p.startsWith("/The-Japanese-Web-Fonts/")) {
    const fonts = [
      "SourceHanSansHW",
      "SourceHanSerif",
      "mplus-1",
      "mplus-S",
      "irohakakuC",
      "corporateLogo",
      "LiNovePOP",
      "KeiFont",
      "Boku2Gothic",
      "BokuGothic",
      "GenEiAntique",
      "GenEiAntique-N",
      "GenEiLateGo",
      "GenEiLateGo-N",
      "GenEiNuGothic",
      "GenEiUniverSans",
      "GenEiRomanNotes",
      "Nasu",
      "NasuM"
    ]

    document.head.append(...fonts.map(font => {
      const lnk = document.createElement("link")
      lnk.setAttribute("rel", "stylesheet")
      lnk.setAttribute("href", `https://cdn.jsdelivr.net/gh/tamaina/The-Japanese-Web-Fonts@v7.2.0/dist/${font}/${font}.css`)
      return lnk
    }))

    tjwf.use()
  } else if (tjwf.unuse) { tjwf.unuse() }
}
