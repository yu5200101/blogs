'use client';
import { CookiesProvider } from 'react-cookie';
import SidebarSearchFieldCon from '../SidebarSearchFieldCon';
interface SidebarSearchFieldProps {
  lng: string
}

export default function SidebarSearchField({lng}: SidebarSearchFieldProps) {

  return (
    <CookiesProvider>
      <SidebarSearchFieldCon lng={lng}/>
    </CookiesProvider>
  );
}