// @ts-nocheck
import I18nProvider from 'next-translate/I18nProvider'
import React from 'react'
import C from '../../../src/pages_/account/verify-account'
import ns0 from '../../../locales/en/common.json'
import ns1 from '../../../locales/en/_error.json'
import ns2 from '../../../locales/en/404.json'
import ns3 from '../../../locales/en/languages.json'
import ns4 from '../../../locales/en/forms.json'
import ns5 from '../../../locales/en/validation.json'
import ns6 from '../../../locales/en/notifications.json'
import ns7 from '../../../locales/en/tooltips.json'
import ns8 from '../../../locales/en/activity.json'
import ns9 from '../../../locales/en/offline.json'
import ns10 from '../../../locales/en/verify-account.json'

const namespaces = { 'common': ns0, '_error': ns1, '404': ns2, 'languages': ns3, 'forms': ns4, 'validation': ns5, 'notifications': ns6, 'tooltips': ns7, 'activity': ns8, 'offline': ns9, 'verify-account': ns10 }

export default function Page(p){
  return (
    <I18nProvider 
      lang="en" 
      namespaces={namespaces}  
      internals={{"defaultLangRedirect":"root","defaultLanguage":"en","isStaticMode":true}}
    >
      <C {...p} />
    </I18nProvider>
  )
}

Page = Object.assign(Page, { ...C })

if(C && C.getInitialProps) {
  Page.getInitialProps = ctx => C.getInitialProps({ ...ctx, lang: 'en'})
}








