import {
  RoomInviter,
}                       from 'wechaty-plugin-contrib'

import {
  polyglotWechaty,
}                             from '../../../database/mod'

import {
  repeat,
  // WECHATY_DEVELOPERS_ROOM_RULES,
  // WECHATY_DEVELOPERS_ROOM_WELCOME,
}                                       from './config'

// const wechatyNonTsConfig: RoomInviterConfig = {
//   password : [
//     /^\s*(python|go|java|scala|php|dotnet|rust)\s*(wechaty)*\s*$/i,
//   ],
//   repeat,
//   room    : MULTI_LANG_ROOM_ID,
//   rule    : WECHATY_DEVELOPERS_ROOM_RULES,
//   welcome : WECHATY_DEVELOPERS_ROOM_WELCOME,
// }

/**
 * https://stackoverflow.com/a/1026087/1123955
 */
function capitalizeFirstLetter (str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

const rule = (language: string) => [
  `Thanks for asking me to invite you for joining the "${capitalizeFirstLetter(language)} Wechaty User Group"!`,
  'Wechaty is a Conversational SDK for chatbot makers.',
  `You can find our documentation at https://wechaty.js.org/docs/polyglot/${language.toLowerCase()}, and all archived discussions on https://gitter.im/wechaty/wechaty`,
  'Please introduce yourself after you join the room, cheers!',
].join('\n')

const welcome = (language: string) => [
  `, welcome to join the "${capitalizeFirstLetter(language)} Wechaty User Group"!`,
  `You can find ${capitalizeFirstLetter(language)} Wechaty docs at https://wechaty.js.org/docs/polyglot/${language.toLowerCase()} ,`,
  `read blog post at https://wechaty.js.org/tags.html#${language.toLowerCase()} .`,
  'Please go ahead to introduce yourself to the group.',
].join('\n')

const config = (language: keyof typeof polyglotWechaty) => ({
  password : [
    new RegExp(`^\\s*${language.toLowerCase()}\\s*(wechaty)*\\s*$`, 'i'),
    // /^\s*python\s*(wechaty)*\s*$/i,
  ],
  repeat,
  room    : polyglotWechaty[language],
  rule    : rule(language),
  welcome : welcome(language),
})

const InviterPluginList = []

for (const language of Object.keys(polyglotWechaty)) {
  const configObj = config(polyglotWechaty[language])
  /**
   * Alias JavaScript -> TypeScript
   */
  if (language === 'typescript') {
    configObj.password.push(
      new RegExp(`^\\s*javascript\\s*(wechaty)*\\s*$`, 'i'),
    )
  }
  const InviterPlugin = RoomInviter(configObj)
  InviterPluginList.push(InviterPlugin)
}

export {
  InviterPluginList,
}
