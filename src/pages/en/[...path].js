import { useRouter } from 'next/router';

export default function DefaultLanguageCatchAll() {
  const router = useRouter()
  if (Array.isArray(router.query.path) && typeof window !== 'undefined') {
    router.replace(`/${router.query.path.join('/')}`)
  }
  return null
}
