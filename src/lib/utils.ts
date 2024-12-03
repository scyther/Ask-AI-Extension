import { ClassNameValue, twMerge } from 'tailwind-merge'

export const cn: (...classLists: ClassNameValue[]) => string = twMerge

export const extractUsefulData = (keywords: string[]) => {
  const text = document.body.innerText
  // keywords.forEach((keyword) => {
  //   const regex = new RegExp(`\\b${keyword}\\b`, 'gi')
  //   const matches = text.match(regex)
  //   if (matches) {
  //     usefulData += matches.join(' ')
  //   }
  // })
  // const elements = document.querySelectorAll('*')
  // const lowercaseKeywords = keywords.map((keyword) => keyword.toLowerCase())
  // let usefulData = ''
  // lowercaseKeywords.forEach((lowercaseKeyword) => {
  //   elements.forEach((element) => {
  //     // Check text content
  //     if (element.textContent?.toLowerCase().includes(lowercaseKeyword)) {
  //       console.log(
  //         'Element with keyword in text content:',
  //         element,
  //         element.innerHTML.toString()
  //       )
  //       usefulData += element.innerHTML.toString()
  //     }

  //     // Check attribute values
  //     if (element.hasAttributes()) {
  //       const attributes = element.attributes
  //       for (let i = 0; i < attributes.length; i++) {
  //         const attribute = attributes[i]
  //         if (attribute.value.toLowerCase().includes(lowercaseKeyword)) {
  //           console.log(
  //             'Element with keyword in attribute:',
  //             element,
  //             element.innerHTML.toString()
  //           )
  //           usefulData += element.innerHTML.toString()
  //         }
  //       }
  //     }
  //   })
  // })
  return text
}
