// @ts-nocheck
import I18nProvider from 'next-translate/I18nProvider'
import React from 'react'
import C from '../../../src/pages_'
import ns0 from '../../../locales/fi/common.json'
import ns1 from '../../../locales/fi/_error.json'
import ns2 from '../../../locales/fi/404.json'
import ns3 from '../../../locales/fi/languages.json'
import ns4 from '../../../locales/fi/forms.json'
import ns5 from '../../../locales/fi/validation.json'
import ns6 from '../../../locales/fi/notifications.json'
import ns7 from '../../../locales/fi/tooltips.json'
import ns8 from '../../../locales/fi/activity.json'
import ns9 from '../../../locales/fi/offline.json'
import ns10 from '../../../locales/fi/index.json'

const namespaces = { 'common': ns0, '_error': ns1, '404': ns2, 'languages': ns3, 'forms': ns4, 'validation': ns5, 'notifications': ns6, 'tooltips': ns7, 'activity': ns8, 'offline': ns9, 'index': ns10 }

export default function Page(p){
  return (
    <I18nProvider 
      lang="fi" 
      namespaces={namespaces}  
      internals={{"defaultLangRedirect":"root","defaultLanguage":"en","isStaticMode":true}}
    >
      <C {...p} />
    </I18nProvider>
  )
}

Page = Object.assign(Page, { ...C })

if(C && C.getInitialProps) {
  Page.getInitialProps = ctx => C.getInitialProps({ ...ctx, lang: 'fi'})
}








