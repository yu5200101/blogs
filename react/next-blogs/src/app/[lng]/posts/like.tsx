'use client';
import { CookiesProvider } from 'react-cookie';
import LikeCon from './likeCon'

export default function Like({lng}: {lng: string}) {
  return (
    <CookiesProvider>
      <LikeCon lng={lng}/>
    </CookiesProvider>
  )
}