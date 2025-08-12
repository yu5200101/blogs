'use client';
import { CookiesProvider } from 'react-cookie';
import SidebarSearchFieldCon from '../SidebarSearchFieldCon';

export default function SidebarSearchField() {

  return (
    <CookiesProvider>
      <SidebarSearchFieldCon />
    </CookiesProvider>
  );
}