const INITIALS = ['g','kk','n','d','tt','r','m','b','pp','s','ss','','j','jj','ch','k','t','p','h']
const VOWELS = ['a','ae','ya','yae','eo','e','yeo','ye','o','wa','wae','oe','yo','u','wo','we','wi','yu','eu','ui','i']
const FINALS = ['','k','k','k','n','n','n','t','l','k','m','p','l','l','p','l','m','p','p','t','t','ng','t','t','k','t','p','t']

const PROVINCES = {
  '서울특별시':'Seoul', '부산광역시':'Busan', '대구광역시':'Daegu', '인천광역시':'Incheon',
  '광주광역시':'Gwangju', '대전광역시':'Daejeon', '울산광역시':'Ulsan', '세종특별자치시':'Sejong',
  '경기도':'Gyeonggi-do', '강원특별자치도':'Gangwon-do', '강원도':'Gangwon-do',
  '충청북도':'Chungcheongbuk-do', '충청남도':'Chungcheongnam-do', '전북특별자치도':'Jeonbuk-do',
  '전라북도':'Jeollabuk-do', '전라남도':'Jeollanam-do', '경상북도':'Gyeongsangbuk-do',
  '경상남도':'Gyeongsangnam-do', '제주특별자치도':'Jeju-do'
}

const COMMON_TERMS = [
  ['반려견놀이터', 'Dog Playground'], ['반려견운동장', 'Dog Park'], ['대학교병원', 'University Hospital'],
  ['행정복지센터', 'Community Service Center'], ['공중화장실', 'Public Restroom'], ['공공화장실', 'Public Restroom'],
  ['고속버스터미널', 'Express Bus Terminal'], ['버스터미널', 'Bus Terminal'], ['대학교', 'University'],
  ['기차역', 'Station'], ['지하철역', 'Subway Station'], ['어린이공원', 'Children’s Park'],
  ['체육공원', 'Sports Park'], ['운동장', 'Stadium'], ['놀이터', 'Playground'], ['화장실', 'Restroom'],
  ['도서관', 'Library'], ['박물관', 'Museum'], ['미술관', 'Art Museum'], ['병원', 'Hospital'],
  ['학교', 'School'], ['시장', 'Market'], ['공원', 'Park'], ['호텔', 'Hotel'], ['아파트', 'Apartment']
]

const SUFFIXES = [
  ['광역시', ''], ['특별시', ''], ['특별자치시', ''], ['특별자치도', '-do'],
  ['시', '-si'], ['군', '-gun'], ['구', '-gu'], ['동', '-dong'], ['읍', '-eup'], ['면', '-myeon'],
  ['리', '-ri'], ['로', '-ro'], ['길', '-gil']
]

const capitalize = (value) => value ? value.charAt(0).toUpperCase() + value.slice(1) : ''

const romanizeHangul = (value) => {
  let result = ''
  for (const character of String(value || '')) {
    const code = character.charCodeAt(0) - 0xac00
    if (code < 0 || code > 11171) {
      result += character
      continue
    }
    const initial = Math.floor(code / 588)
    const vowel = Math.floor((code % 588) / 28)
    const final = code % 28
    result += INITIALS[initial] + VOWELS[vowel] + FINALS[final]
  }
  return capitalize(result)
}

const romanizeWord = (word) => {
  for (const [suffix, englishSuffix] of SUFFIXES) {
    if (word.length > suffix.length && word.endsWith(suffix)) {
      return `${romanizeHangul(word.slice(0, -suffix.length))}${englishSuffix}`
    }
  }
  return romanizeHangul(word)
}

export const toEnglishLocation = (value) => {
  let text = String(value || '').trim()
  if (!text) return ''

  for (const [korean, english] of Object.entries(PROVINCES)) {
    text = text.replaceAll(korean, `[[${english}]]`)
  }
  for (const [korean, english] of COMMON_TERMS) {
    text = text.replaceAll(korean, ` [[${english}]] `)
  }

  return text
    .split(/(\[\[[^\]]+\]\])/)
    .map((part) => {
      if (part.startsWith('[[')) return part.slice(2, -2)
      return part.replace(/[가-힣]+/g, romanizeWord)
    })
    .join('')
    .replace(/\s+/g, ' ')
    .replace(/\s+([,·])/g, '$1')
    .trim()
}
