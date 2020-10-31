// @ts-nocheck
import I18nProvider from 'next-translate/I18nProvider'
import React from 'react'
import C, * as _rest from '../../../../src/pages_/schools/[id]'
import ns0 from '../../../../locales/sv/common.json'
import ns1 from '../../../../locales/sv/_error.json'
import ns2 from '../../../../locales/sv/404.json'
import ns3 from '../../../../locales/sv/languages.json'
import ns4 from '../../../../locales/sv/forms.json'
import ns5 from '../../../../locales/sv/validation.json'
import ns6 from '../../../../locales/sv/notifications.json'
import ns7 from '../../../../locales/sv/tooltips.json'
import ns8 from '../../../../locales/sv/activity.json'
import ns9 from '../../../../locales/sv/offline.json'
import ns10 from '../../../../locales/sv/school.json'

const namespaces = { 'common': ns0, '_error': ns1, '404': ns2, 'languages': ns3, 'forms': ns4, 'validation': ns5, 'notifications': ns6, 'tooltips': ns7, 'activity': ns8, 'offline': ns9, 'school': ns10 }

export default function Page(p){
  return (
    <I18nProvider 
      lang="sv" 
      namespaces={namespaces}  
      internals={{"defaultLangRedirect":"root","defaultLanguage":"en","isStaticMode":true}}
    >
      <C {...p} />
    </I18nProvider>
  )
}

Page = Object.assign(Page, { ...C })

if(C && C.getInitialProps) {
  Page.getInitialProps = ctx => C.getInitialProps({ ...ctx, lang: 'sv'})
}


export const getStaticProps = ctx => _rest.getStaticProps({ ...ctx, lang: 'sv' })
export const getStaticPaths = ctx => _rest.getStaticPaths({ ...ctx, lang: 'sv' })




